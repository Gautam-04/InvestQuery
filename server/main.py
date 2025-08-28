from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import spacy
import re
import json
from transformers import AutoTokenizer, AutoModelForCausalLM
import google.generativeai as genai
import os
from dotenv import load_dotenv
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.fundamentaldata import FundamentalData



load_dotenv()


app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
MODEL = genai.GenerativeModel('gemini-1.5-flash')

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY_2")

ts = TimeSeries(key=ALPHA_VANTAGE_KEY, output_format='json')
fd = FundamentalData(key=ALPHA_VANTAGE_KEY, output_format='json')


# Extract money (like "10,000 rupees" / "$500")
def extract_amount(text):
    doc = nlp(text)
    money = []
    for ent in doc.ents:
        if ent.label_ in ["MONEY", "QUANTITY", "CARDINAL"]:
            money.append(ent.text)
    # fallback regex (like "10000 rs")
    regex_match = re.findall(r"\d+(?:,\d+)?\s?(?:rs|rupees|dollars|usd|inr)?", text.lower())
    money.extend(regex_match)
    return money if money else ["Not specified"]

# Detect risk (low, medium, high)
def extract_risk(text):
    risks = []
    if re.search(r"\blow risk\b|\blow\b", text.lower()):
        risks.append("Low risk")
    elif re.search(r"\bmedium risk\b|\bmoderate\b|\baverage\b", text.lower()):
        risks.append("Medium risk")
    elif re.search(r"\bhigh risk\b|\brisky\b|\bvolatile\b", text.lower()):
        risks.append("High risk")
    return risks if risks else ["Not specified"]

# Extract duration (like "2 years", "6 months")
def extract_duration(text):
    regex_match = re.findall(r"\d+\s?(?:year|years|month|months|days|day)", text.lower())
    return regex_match if regex_match else ["Not specified"]

# Extract investment domain keywords
def extract_domain(text):
    keywords = ["stocks", "mutual funds", "crypto", "real estate", "bonds", "gold", "etf", "etfs", "commodities", "savings account", "fixed deposits", "mfs"]
    found = [word for word in keywords if word in text.lower()]
    return found if found else ["Not specified"]

def preferred_stock_type(text):
    keywords = ["Large Cap", "Mid Cap", "Small Cap", "Blue Chip", "Growth", "Value"]
    found = [word for word in keywords if word.lower() in text.lower()]
    return found if found else ["Not specified"]

def preferred_country(text):
    keywords = ["USA", "India", "UK", "Germany", "China", "Japan", "Canada", "Australia", "US", "UAE"]
    found = [word for word in keywords if word.lower() in text.lower()]
    return found if found else ["Not specified"]

def industry_type(text):
    keywords = ["Technology", "Healthcare", "Finance", "Energy", "Consumer Goods", "Utilities", "Real Estate", "Telecommunications", "Industrials", "Materials", "Banks", "Insurance", "Pharmaceuticals", "Automotive", "Retail", "Pharma", "Banking"]
    found = [word for word in keywords if word.lower() in text.lower()]
    return found if found else ["Not specified"]

def generate_response(prompt):
    response = MODEL.generate_content(f'''{prompt}''')
    return response.text

def get_country_ticker(stock_symbol, country):
    country = country.strip().lower()
    exchange_mapping = {
        "india": ".BSE",      
        "nse": ".BSE",
        "uk": ".LON",           
        "london": ".LON",
        "germany": ".DE",     
        "china": ".SHH",        
        "japan": ".T",         
        "canada": ".TRV",      
        "australia": ".AX", 
        "uae": ".DFM"         
    }
    suffix = exchange_mapping.get(country, "")  
    return stock_symbol + suffix


@app.route('/api/nlpinput', methods=['POST'])
def nlpinput():
    data = request.get_json()
    searchInput = data.get('search', "")

    structured_data = []

    # Extract keywords
    extracted = {
        "amount": extract_amount(searchInput),
        "risk": extract_risk(searchInput),
        "duration": extract_duration(searchInput),
        "domain": extract_domain(searchInput),
        "preferred_stock_type": preferred_stock_type(searchInput),
        "preferred_country": preferred_country(searchInput),
        "industry_type": industry_type(searchInput)
    }

    # Refined prompt for AI
    prompt = f"""
    Based on the following investment preferences, suggest suitable investments. Only provide the names of stocks, ETFs, mutual funds, or crypto coins that match the criteria. 
    Return the final output strictly as a JSON array of strings, without any explanations, strategies, or extra text.

    Investment Preferences:
    Amount: {', '.join(extracted['amount'])}
    Risk Tolerance: {', '.join(extracted.get('risk', ['Not specified']))}
    Duration: {', '.join(extracted.get('duration', ['Not specified']))}
    Domain: {', '.join(extracted.get('domain', ['Not specified']))}
    Preferred Stock Type: {', '.join(extracted.get('preferred_stock_type', ['Not specified']))}
    Preferred Country: {', '.join(extracted.get('preferred_country', ['Not specified']))}
    Industry Type: {', '.join(extracted.get('industry_type', ['Not specified']))}

    Example output: ["JPMorgan", "Citibank", "XLF"]
    """

    # Call AI model
    recommendation = generate_response(prompt)

    # Clean AI response and parse JSON array
    cleanedRecommendations = re.sub(r'```json|```', '', recommendation).strip()
    try:
        stocks_list = json.loads(cleanedRecommendations)
    except json.JSONDecodeError:
        stocks_list = []
        print("Failed to parse AI recommendation:", recommendation)

    # Map stock symbols to tickers based on country
    countries = extracted.get('preferred_country', ["Not specified"])
    tickers = [get_country_ticker(stock, countries[0]) for stock in stocks_list]
    print(tickers)

    # Fetch stock data from Alpha Vantage
    for ticker in tickers:
        try:
            url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={ALPHA_VANTAGE_KEY}"
            r = requests.get(url)
            data = r.json()
            print(data)
            # data, meta = ts.get_quote_endpoint(symbol=ticker)
            # price = float(data['05. price'])
            # last_refreshed = data['07. latest trading day']

            # # Get fundamentals
            # fundamentals, _ = fd.get_company_overview(ticker)
            # market_cap = fundamentals.get("MarketCapitalization", "N/A")
            # pe_ratio = fundamentals.get("PERatio", "N/A")
            # dividend_yield = fundamentals.get("DividendYield", "N/A")

            # stock_json = {
            #     "symbol": ticker.split('.')[0],
            #     "name": fundamentals.get("Name", ticker.split('.')[0]),
            #     "exchange": ticker.split('.')[-1],
            #     "sector": fundamentals.get("Sector", "N/A"),
            #     "current_price": {
            #         "value": price,
            #         "currency": "INR" if countries[0].lower() == "india" else "USD",
            #         "as_of": last_refreshed
            #     },
            #     "details": {
            #         "market_cap": market_cap,
            #         "pe_ratio": pe_ratio,
            #         "dividend_yield": dividend_yield,
            #         "52_week_high": fundamentals.get("52WeekHigh", "N/A"),
            #         "52_week_low": fundamentals.get("52WeekLow", "N/A")
            #     },
            #     "future_growth": {
            #         "prediction_years": 2,
            #         "predicted_values": [],
            #         "growth_reason": []
            #     },
            #     "ratings": [],
            #     "news": []
            # }

            structured_data.append(data)
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")

    # Combine all extracted words
    combined = extracted["amount"] + extracted["risk"] + extracted["domain"] + extracted["duration"] + extracted["preferred_stock_type"] + extracted["preferred_country"] + extracted["industry_type"]

    return jsonify({
        "NLP Extracted Words": combined,
        "structured_data": structured_data,
        "ai_raw_response": recommendation
    }), 200

if __name__ == '__main__':
    app.run(debug=True)

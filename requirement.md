PRD – Web Scraping API Development using AI
1. Overview
Purpose:
Build a JavaScript-based API that scrapes product listings from an e-commerce page (example: eBay) and uses AI (Deepseek preferred, but alternatives like ChatGPT are acceptable) to extract and process product details. The API should return structured JSON data containing at least product name, price, and description, gathered from both listing and product detail pages, across all paginated results.

Target Audience:
Internal engineering evaluators and interview panel for assessment of:

Web scraping skills

AI integration skills

Problem-solving ability

API design and documentation skills

2. Objectives & Goals
Primary Goal:
Provide a REST API endpoint that, given an eBay search URL, returns all product data (name, price, description) from all paginated search results.

Secondary Goals:

Ensure data is clean, structured, and JSON-ready.

Handle missing or inconsistent data gracefully by returning '-'.

Demonstrate AI-assisted data extraction for unstructured or inconsistent product descriptions.

Ensure easy setup and running instructions for evaluators.

3. Core Features (Mandatory)
3.1 API Functionalities
Input

Accepts a search URL (e.g., https://www.ebay.com/sch/i.html?_nkw=nike&_pgn=1) as a query parameter or via POST JSON payload.

Output (JSON)

Array of product objects:

json
Copy
Edit
[
  {
    "name": "Nike Air Max 90",
    "price": "$120.00",
    "description": "Classic Nike Air Max sneakers with cushioned sole..."
  }
]
Missing fields should be returned as "-".

Data Extraction

Name – From product listing.

Price – From product listing (if not found, return "-").

Description – Extracted from each product’s detail page, using AI to parse and clean up unstructured text.

AI should be able to:

Summarize overly long seller descriptions.

Extract relevant details and ignore noise (shipping terms, unrelated ads, etc.).

Pagination Handling

Automatically iterate through all available pages until no more products are found.

Merge results into a single JSON array.

4. Technical Requirements
4.1 Tech Stack
Language: JavaScript (Node.js)

Libraries/Tools:

axios / node-fetch – HTTP requests

cheerio – HTML parsing

puppeteer / playwright – For dynamic rendering (if needed)

AI API – Deepseek API (preferred) or OpenAI API for text extraction and summarization

express – To create API endpoints

4.2 API Endpoints
GET /scrape
Query Params:

url – eBay search URL (string, required)
Response: JSON object with scraped products.

Example:

bash
Copy
Edit
GET /scrape?url=https://www.ebay.com/sch/i.html?_nkw=nike&_pgn=1
Response:

json
Copy
Edit
{
  "status": "success",
  "products": [
    {
      "name": "Nike Air Force 1",
      "price": "$90",
      "description": "Iconic Nike sneakers with classic design..."
    }
  ]
}
5. Data Processing Flow
Receive Search URL

Validate that it’s a valid eBay search URL.

Scrape Product Listings

Extract product names, prices, and links to detail pages.

Visit Each Detail Page

Extract raw description HTML/text.

Send Description to AI

Pass raw text to Deepseek/OpenAI API for cleanup & summarization.

Return concise, relevant product descriptions.

Handle Pagination

Detect "Next Page" link, repeat until last page.

Return Results in JSON

Ensure missing data is "-".

6. AI Integration Requirements
Prompt Example for AI:

css
Copy
Edit
You are a product description cleaner. From the following seller description, remove irrelevant details such as shipping info or unrelated promotions. Keep only the core product details, rewrite concisely in 1–3 sentences:
[RAW_DESCRIPTION]
Expected AI Output:
Short, readable product descriptions, removing unnecessary text.

7. Error Handling
Invalid URL → Return { "status": "error", "message": "Invalid eBay URL" }.

Network failure → Retry up to 3 times before failing.

AI API failure → Return raw scraped description instead of AI summary.

8. Performance Requirements
Handle at least 100 product detail scrapes in one request.

Response time target: < 30s for 3–4 pages of results.

9. Non-Functional Requirements
Documentation – Clear README with:

Installation steps

Environment variable setup (AI API key, etc.)

Example requests and responses

Code Quality – Modular, readable, well-commented code.

Scalability – Easy to adapt to other e-commerce sites.

10. Deliverables
Public GitHub repo containing:

Source code

README documentation

Working API endpoint (local run acceptable)

Sample JSON output file with at least 1 eBay search scrape.
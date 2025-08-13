# Web Scraping API

JavaScript-based API that scrapes eBay product listings and uses AI to process product descriptions. Features both REST API endpoints and a real-time web interface for comprehensive product data extraction.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys (DEEPSEEK_API_KEY or OPENAI_API_KEY)
```

3. Start the server:
```bash
npm start
```

4. Access the web interface:
```
http://localhost:3000
```

## Usage Options

### Option 1: Web Interface (Recommended)

1. Open `http://localhost:3000` in your browser
2. Enter eBay search URL (e.g., `https://www.ebay.com/sch/i.html?_nkw=nike+shoes`)
3. Click "Start Scraping" to begin real-time extraction
4. View products as they load with live statistics
5. Stop anytime or let it complete all pages

**Web Interface Features:**
- Real-time product updates
- Live statistics (total products, current page, success rate)
- Error resilience (failed pages don't stop the process)
- Visual product cards with detailed information
- Start/Stop controls

### Option 2: REST API

**GET /scrape**

Scrapes eBay search results and returns structured product data.

**Query Parameters:**
- `url` (required): eBay search URL
- `page` (optional): Page number (default: 1)

**Example Request:**
```bash
GET http://localhost:3000/scrape?url=https://www.ebay.com/sch/i.html?_nkw=nike&page=1
```

**Example Response:**
```json
{
  "status": "success",
  "products": [
    {
      "name": "Nike Air Max 90 Essential Men's Shoes",
      "price": "$89.99",
      "shipping": "Free shipping",
      "condition": "Brand New",
      "location": "United States",
      "series": "Air Max 90",
      "seller": "nike_official_store",
      "itemNumber": "123456789012",
      "description": "Classic Nike Air Max 90 with visible Air cushioning..."
    }
  ],
  "currentPage": 1,
  "hasNextPage": true,
  "nextPageUrl": "..."
}
```

## Enhanced Features

### Core Functionality
- **Comprehensive Data Extraction**: Name, price, shipping, condition, location, seller, item number
- **AI-Powered Series Detection**: Automatically identifies Nike shoe series (Air Max 90, Air Force 1, etc.)
- **Batch Processing**: 25 products per page for optimal performance
- **Pagination Support**: Handles multiple pages with continuation URLs
- **Error Resilience**: Continues scraping even if individual pages fail

### AI Integration
- **Deepseek API** (preferred) or **OpenAI API** for description processing
- **Series Extraction**: AI identifies product series from names
- **Fallback Logic**: Local pattern matching when AI APIs are unavailable
- **Description Cleaning**: Removes shipping info and promotional content

### Technical Features
- **Multiple Extraction Strategies**: Pattern matching, container scanning, text mining
- **Robust Selectors**: Handles various eBay page layouts and structures
- **Rate Limiting**: Built-in delays to avoid being blocked
- **Timeout Handling**: Configurable timeouts for reliable operation

## Testing

### Quick Test
```bash
npm test
```

### Batch Testing
```bash
npm run test-batch
```

### Debug Mode
```bash
npm run debug
```

## Data Structure

Each product object contains:
- `name`: Product title
- `price`: Price with currency symbol
- `shipping`: Shipping cost or "Free shipping"
- `condition`: Item condition (New, Used, etc.)
- `location`: Seller location
- `series`: Nike shoe series (AI-extracted)
- `seller`: Seller username/store name
- `itemNumber`: eBay item number
- `description`: AI-processed product description

## Error Handling

- **Invalid URLs**: Returns error message for non-eBay URLs
- **Network Failures**: Automatic retry logic with graceful degradation
- **AI API Failures**: Falls back to raw descriptions and local processing
- **Missing Data**: Returns "-" for unavailable fields
- **Page Failures**: Continues with remaining pages

## Performance

- **Response Time**: ~15-30 seconds per page (25 products)
- **Scalability**: Handles 100+ products across multiple pages
- **Memory Efficient**: Processes products in batches
- **Rate Limited**: Respects eBay's server limits

## Architecture

```
├── server.js              # Express server with static file serving
├── controllers/
│   └── scrapeController.js # Request handling and validation
├── services/
│   ├── scraperService.js   # Core scraping logic with multiple strategies
│   └── aiService.js        # AI integration (Deepseek/OpenAI)
├── public/
│   └── index.html          # Real-time web interface
└── sample-output.json      # Example API response
```
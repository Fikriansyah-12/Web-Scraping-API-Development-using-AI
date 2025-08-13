import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """Basic web scraper function"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = soup.find('title')
        title_text = title.get_text().strip() if title else "No title found"
        
        # Extract all links
        links = [a.get('href') for a in soup.find_all('a', href=True)]
        
        return {
            'title': title_text,
            'links': links,
            'status_code': response.status_code
        }
        
    except requests.RequestException as e:
        return {'error': f"Request failed: {e}"}

if __name__ == "__main__":
    url = input("Enter URL to scrape: ")
    result = scrape_website(url)
    
    if 'error' in result:
        print(result['error'])
    else:
        print(f"Title: {result['title']}")
        print(f"Found {len(result['links'])} links")
        print(f"Status: {result['status_code']}")
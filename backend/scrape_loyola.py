import requests
from bs4 import BeautifulSoup

urls = [
    "https://licet.ac.in/",
    "https://licet.ac.in/about/",
    "https://licet.ac.in/information-technology/",
    "https://licet.ac.in/information-technology/obe_it/",
    "https://licet.ac.in/information-technology/infrastructure-it/",
    "https://licet.ac.in/information-technology/information-technology-faculty/",
    "https://licet.ac.in/information-technology/students/",
    "https://licet.ac.in/information-technology/information-technology-placements/"
]

all_text = ""

headers = {
    "User-Agent":
    "Mozilla/5.0"
}

for url in urls:

    try:
        print("Scraping:", url)

        response = requests.get(
            url,
            headers=headers
        )

        print("Status:", response.status_code)

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        text = soup.get_text(
            separator="\n"
        )

        all_text += "\n\n"
        all_text += "=" * 50
        all_text += "\n"
        all_text += url
        all_text += "\n"
        all_text += "=" * 50
        all_text += "\n"
        all_text += text

    except Exception as e:
        print("Error:", e)

with open(
    "knowledge_base.txt",
    "w",
    encoding="utf-8"
) as f:

    f.write(all_text)

print("Website data saved successfully.")
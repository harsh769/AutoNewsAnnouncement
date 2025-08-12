from flask import Flask, render_template, request
import feedparser

app = Flask(__name__)

rss_feeds = {
    "NDTV": "https://feeds.feedburner.com/ndtvnews-top-stories",
    "Times of India": "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    "India Today": "https://www.indiatoday.in/rss/home",
    "Hindustan Times": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    "The Hindu": "https://www.thehindu.com/feeder/default.rss",
    "Zee News": "https://zeenews.india.com/rss/india-national-news.xml",
    "Aaj Tak": "https://aajtak.intoday.in/rsshomepage.xml",
    "ABP News": "https://news.abplive.com/rss/news-91.rss",
    "News18": "https://www.news18.com/rss/india.xml",
    "Hindustan Times": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    "Indian Express": "https://indianexpress.com/section/india/feed/",
    "Deccan Herald": "https://www.deccanherald.com/rss-feed/31",
    "Economic Times": "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
    "LiveMint": "https://www.livemint.com/rss/news",
    "Business Standard": "https://www.business-standard.com/rss/latest.rss"
}

@app.route("/")
def home():
    from datetime import datetime
    return render_template("index.html", channels=list(rss_feeds.keys()), year=datetime.now().year)

@app.route("/channel/<name>")
def channel(name):
    url = rss_feeds.get(name)
    if not url:
        return "Channel not found"
    feed = feedparser.parse(url)
    return render_template("channel.html", name=name, news=feed.entries)

if __name__ == "__main__":
    app.run(debug=True)

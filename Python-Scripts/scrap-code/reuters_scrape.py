import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
from urllib.request import urlopen


def request(url):
    res = urlopen(url)
    data = res.read()
    soup = BeautifulSoup(data, 'lxml')
    return soup

urls = ['https://in.reuters.com/news/technology']
ind = ['https://in.reuters.com']

soup = request(urls[0])

articles_tab = soup.find_all('article',{'class':'story'})

li = []

for article in articles_tab:
    image_url = article.find('img')['src']
    story = article.find('div',{'class':'story-content'})
    url_s = ind[0] + story.find('a')['href']
    headlines = (story.find('h3').text).strip(' ')
    brief = (story.find('p').text)
    soup2 = request(url_s)
    paras = soup2.find_all('p',{'class':'Paragraph-paragraph-2Bgue ArticleBody-para-TD_9x'})
    
    st = ''
    for P in paras:
        st = st + P.text +  '\n'
    #articles_list.append([title, story_url, brief, para, images])
    li.append([headlines, url_s, brief, st, image_url])


df = pd.DataFrame(li, columns=['Title', 'Story Url', 'Brief Intro', 'Paragraph', 'Image Url'])

df

df.to_csv('ThirdSetArticles.csv', index=False)
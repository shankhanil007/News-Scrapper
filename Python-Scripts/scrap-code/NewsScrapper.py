import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
from urllib.request import urlopen


def request(url):
    res = urlopen(url)
    data = res.read()
    soup = BeautifulSoup(data, 'lxml')
    return soup

urls = ['https://www.indiatoday.in/top-stories']
india = ['https://www.indiatoday.in']


soup = request(urls[0])
#temp1 = soup.find_all('div',{'class':'view view-category-wise-content-list view-id-category_wise_content_list view-display-id-section_wise_content_listing view-dom-id- custom'})
temp2 = soup.find_all('div',{'class':'catagory-listing'})
articles_list = []
for news in temp2:
    images = news.find('img')['src']
    title = news.find('a').text
    story_url = india[0]+news.find('a')['href']
    brief = news.find('p').text
    #print(brief,"\n")
    soup2 = request(story_url)
    descr = soup2.find_all('div',{'class':'description'})
    
    para = []
    for des in descr:
        P = des.find_all('p')
        for x in P:
            content = x.text
            para.append(content)
    print(para,'\n\n')
    articles_list.append([title, story_url, brief, para, images])


df = pd.DataFrame(articles_list, columns=['Title', 'Story Url', 'Brief Intro', 'Paragraph', 'Image Url'])


df.to_csv('Second.csv', index=False)
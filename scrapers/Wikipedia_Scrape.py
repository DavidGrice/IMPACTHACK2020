#!/usr/bin/env python
# coding: utf-8

# In[5]:


import urllib
import urllib3
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time
from bs4 import BeautifulSoup as bs
import os
import getpass
import re 
import glob
from pynput.keyboard import Key, Controller
import pandas as pd


# In[6]:


def getDriver():
    DRIVER_PATH = './chromedriver.exe'
    wd = webdriver.Chrome(executable_path=DRIVER_PATH)
    time.sleep(5)
    wd.get('https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory')
    time.sleep(5)
    return wd

def makeDataFrames(country, countryLanguages):
    df1 = pd.DataFrame(country, columns=['Country'])
    df1["ID"] = range(0, len(df1))
    df2 = pd.DataFrame(countryLanguages, columns=['Languages'])
    df2["ID"] = range(0, len(df2))
    final_dataFrame = pd.merge(df1, df2, how='right', on='ID')
    final_dataFrame[:-17]

def scrapeCountry(wd):
    countryName = {}
    i = 0
    for items in wd.find_elements_by_xpath("//table[@class='wikitable sortable jquery-tablesorter']"):
        countryDict = {}
        languageDict = {}

        for tableBody in items.find_elements_by_xpath(".//tbody"):

            for tableRow in tableBody.find_elements_by_xpath(".//tr"):
                x = 0
                for attrib,l in enumerate(tableRow.find_elements_by_xpath(".//td")):

                    if (attrib == 0):
                        for info, k in enumerate(l.find_elements_by_xpath(".//a")):
                            if (info == 0):
                                country.append(k.text)
                    if (attrib == 1):
                        countryLanguages.append(l.text)
    
    makeDataFrames(country, countryLanguages)
    


# In[7]:


country = []
countryLanguages = []
wd = getDriver()
scrapeCountry(wd)


# In[8]:


df1 = pd.DataFrame(country, columns=['Country'])
df1["ID"] = range(0, len(df1))
df2 = pd.DataFrame(countryLanguages, columns=['Languages'])
df2["ID"] = range(0, len(df2))
final_dataFrame = pd.merge(df1, df2, how='right', on='ID')
final_dataFrame = final_dataFrame[:-17]
final_dataFrame = final_dataFrame.replace({'Languages': r'[[].*'}, {'Languages': ''}, regex=True)
final_dataFrame = final_dataFrame.replace({'Languages': r'\n'}, {'Languages': ', '}, regex=True)
final_dataFrame = final_dataFrame.replace({'Languages': r'\(.+\)'}, {'Languages': ''}, regex=True)
final_dataFrame = final_dataFrame.replace({'Country': 'Ivory Coast'}, {'Country': "Cote d'Ivoire"}, regex=True)
final_dataFrame = final_dataFrame.replace({'Country': 'Gambia'}, {'Country': "Gambia, The"}, regex=True)
final_dataFrame = final_dataFrame.replace({'Country': 'South Korea'}, {'Country': "Korea, South"}, regex=True)
final_dataFrame = final_dataFrame.replace({'Country': 'Hong Kong, China'}, {'Country': "Hong Kong"}, regex=True)
final_dataFrame = final_dataFrame[['ID', 'Country', 'Languages']]
final_dataFrame = final_dataFrame.set_index('ID')
final_dataFrame
#final_dataFrame[['Language_1','Language_2','Language_3','Language_4','Language_5','Language_6','Language_7','Language_8','Language_9','Language_10','Language_11','Language_12','Language_13','Language_14','Language_15','Language_16']] = final_dataFrame.Languages.str.split("\n",expand=True)
#final_dataFrame.pivot(index='ID', columns='Country', values=['Language_1','Language_2','Language_3','Language_4','Language_5','Language_6','Language_7','Language_8','Language_9','Language_10','Language_11','Language_12','Language_13','Language_14','Language_15','Language_16'])


# In[9]:


final_dataFrame.to_csv('Languages.csv', columns=['Country', 'Languages'])


# In[10]:


openDF = pd.read_excel('../data/EmbassiesConsulatesandMissionsLatLongs042220.xlsx', encoding="latin-1")
openDF


# In[15]:


final_merge = pd.merge(openDF, final_dataFrame, how='left', on='Country')
final_merge = final_merge[['Status', 'Bureau', 'Country', 'Post', 'Latitude', 'Longitude', 'Languages']]
final_merge


# In[16]:


final_merge.to_json('Final_data.json', orient='records', indent=4)


# In[ ]:





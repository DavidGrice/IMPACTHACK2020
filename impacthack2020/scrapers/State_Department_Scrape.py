#!/usr/bin/env python
# coding: utf-8

# In[284]:


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


# In[274]:


def getDriver():
    DRIVER_PATH = './chromedriver.exe'
    wd = webdriver.Chrome(executable_path=DRIVER_PATH)
    time.sleep(5)
    wd.get('https://www.usembassy.gov/#C')
    return wd

def getMainCountryURL(wd):
    main_country_list = wd.find_elements_by_xpath("//a[@class='pcs-post-title']")
    main_country_url = []
    embassy_url = []
    for i in main_country_list:
        main_country_url.append(i.get_attribute('href'))
    #main_country_url
    time.sleep(7)
    return main_country_url

def getCountryNamesCleaned(wd):
    country_ar = []
    country_temp = wd.page_source
    country_data = bs(country_temp, 'lxml')
    for strong_tag in country_data.find_all('li'):
        tester = strong_tag.find_all('a')
        for names in tester:
            pattern = re.compile(r'[//][a-z]{4,30}')
            for i in re.findall(pattern, str(names.get('href'))):
                country_ar.append(i)
    return country_ar

def getPostName(wd, country_url):
    try:
        path = wd.find_element_by_xpath("//div[@class='cityname1']//a").get_attribute('href')
        wd.get(path)
    except NoSuchElementException:
        keyboard = Controller()
        keyboard.press(Key.ctrl)
        keyboard.press('r')
        keyboard.release(Key.ctrl)
        keyboard.release('r')
        time.sleep(5)
        path = wd.find_element_by_xpath("//div[@class='cityname1']//a").get_attribute('href')
        wd.get(path)
        
def getPostNamesCleaned(wd):
    consulate_dict = {}
    consulates = []
    for footer in wd.find_elements_by_xpath(".//div[@class='footer-middle']"):
        for widget in footer.find_elements_by_xpath(".//div[@class='textwidget']//a"):
            consulates.append(widget.get_attribute('href'))
    post_names = []
    for post_name in consulates:
        pattern = re.compile(r'[v][//].+[//]')
        for i in re.findall(pattern, str(post_name)):
            post_names.append(i)
    consulate_dict["Posts"] = post_names
    return consulate_dict

def getLanguages(wd):
    language_dict = {}
    language_arr = []
    try:
        wd.find_element_by_xpath("//i[@class='fa fa-plus-square']").click()
        languages = wd.find_elements_by_xpath("//div[@class='translations_sidebar']//li")
        for i in (languages):
            language_arr.append(i.text)
    except NoSuchElementException:
        language_arr.append(None)
    language_dict["Language"] = language_arr
    return language_dict

def socialMediaDictionary(wd, post_names):
    social_dict = {}
    ret_dict = {}
    temp_arr = []
    final_arr = []
    x = 0
    for main in wd.find_elements_by_xpath(".//main"):

        for social in main.find_elements_by_xpath(".//div[@class='mo-social-links']"):
            social_arr = []
            for attrib in social.find_elements_by_xpath('.//a'):
                social_arr.append(attrib.get_attribute('href'))
            social_dict[x] = social_arr
            x+=1

    if(len(social_dict) == 0):
        for side in wd.find_elements_by_xpath("//div[@class='textbox-content']"):
            for social in side.find_elements_by_xpath(".//div[@class='mo-social-links']"):
                social_arr = []
                for attrib in social.find_elements_by_xpath('.//a'):
                    social_arr.append(attrib.get_attribute('href'))
                social_dict[x] = social_arr
                x+=1
    ret_dict["Social"] = social_dict
    return ret_dict


# In[275]:


wd = getDriver()
main_country_url = getMainCountryURL(wd)
time.sleep(5)
#print(main_country_url)
clean_country_names = getCountryNamesCleaned(wd)
time.sleep(5)
#print(clean_country_names)
country_dict = {}
x = 0
for k,v in enumerate(main_country_url):
    post_names = []
    language_dict = {}
    consulate_level = {}
    social_dict = {}

    # Access Embassy list
    country_url = wd.get(str(main_country_url[k]))
    time.sleep(5)

    # GET POST NAMES
    getPostName(wd,country_url)
    time.sleep(5)
    post_names = getPostNamesCleaned(wd)
    #print(post_names)
    
    time.sleep(5)
    language_dict = getLanguages(wd)
    #print(language_dict)
    
    social_dict = socialMediaDictionary(wd, post_names)
    #print(social_dict)
    
    consulate_level = dict(**language_dict , **social_dict)
    include_posts = dict(**consulate_level, **post_names)
    country_dict[x] = include_posts
    time.sleep(5)
    x+=1
    
    
    #city_names_cleaned = getPostNamesCleaned(wd,city_websites)
    #print(city_names_cleaned)
    


# In[263]:





# In[276]:


country_dict


# In[277]:


len(clean_country_names)


# In[281]:


country_dict["Country"] = clean_country_names


# In[282]:


country_dict


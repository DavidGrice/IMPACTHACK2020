#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd


# In[8]:


raw = pd.read_csv('./data/Embassies_Consulates_Missions_Data.csv', encoding="latin-1")


# In[11]:


raw.to_json('./data/Embassies_Consulates_Missions_Data.json', orient='records', indent=3)


# In[2]:


data = pd.read_excel('./original-embassy-data-incorrect-locations.xlsx')
data


# In[27]:


data_melt = pd.melt(data, id_vars=['country'], value_vars=['year'])
data_melt


# In[10]:


data_pivot_table = pd.pivot_table(data, index=['country','lat','lon'], columns='event',values='year', fill_value="0").reset_index()
data_pivot_table = data_pivot_table[['country','establish legation','elevate to embassy','establish embassy','closure','reopen legation', 'reopen embassy','lat','lon']]
data_pivot_table[['establish legation','elevate to embassy','establish embassy','closure','reopen legation', 'reopen embassy']] = data_pivot_table[['establish legation','elevate to embassy','establish embassy','closure','reopen legation', 'reopen embassy']].astype(int)
data_pivot_table = data_pivot_table.rename(columns={'establish legation':'establish_legation', 'elevate to embassy':'elevate_to_embassy', 'establish embassy':'establish_embassy','reopen legation':'reopen_legation','reopen embassy':'reopen_embassy'})
data_pivot_table


# In[11]:


data_pivot_table.to_json('Embassy_Timeline.json',orient='records', indent=4)


# In[ ]:





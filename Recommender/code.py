#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Fri Aug 17 19:58:37 2018

@author: home
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.decomposition import PCA
from sklearn.decomposition import TruncatedSVD
import nltk

lyrics = pd.read_csv('songdata.csv')
lyrics = lyrics.drop(['link'], axis=1)  
arts_list = lyrics['artist'].unique()
lyrics['text'] = lyrics['text'].str.replace('\n', '')
n_components = 100
n_clusters = 3
tfidf = TfidfVectorizer(use_idf=True, smooth_idf=True, stop_words='english')
X_text = tfidf.fit_transform(lyrics['text'])
svd = TruncatedSVD(n_components=100, random_state = 0)
X_2d = svd.fit_transform(X_text)
from scipy import sparse
feature_matrix=sparse.csr_matrix(X_2d)
km = KMeans(n_clusters=3, init = 'k-means++', max_iter=10000, random_state = 42)
X_clustered = km.fit_predict(X_2d)
lyrics['Cluster']=np.asarray(X_clustered)
clus=lyrics['Cluster'].copy()
def pca_visualise(feature_mat,clus):
    feat = feature_mat.todense()
    sc = StandardScaler()
    features1 = sc.fit_transform(feat)
    pca = PCA(n_components = 2)
    features1 = pca.fit_transform(features1)
    for i in range(2000):
        if clus[i]==0:
            plt.scatter(features1[i,1],features1[i,0],c='r')
        elif clus[i]==1:
            plt.scatter(features1[i,1],features1[i,0],c='b')
        else:
            plt.scatter(features1[i,1],features1[i,0],c='g')
    plt.show()
def predict(lyrics,tfidf,svd,km):
    lyrics=lyrics.decode('utf-8')
    lyrics = lyrics.replace('\n', ' ')
    lyrics=[lyrics]
    x1=tfidf.transform(lyrics)
    x2=svd.transform(x1)
    x3=sparse.csr_matrix(x2)
    c=km.predict(x3)
    print c
    
import pickle
def predict(lyrics,tfidf,svd,km):
    lyrics=lyrics.decode('utf-8')
    lyrics = lyrics.replace('\n', ' ')
    lyrics=[lyrics]
    x1=tfidf.transform(lyrics)
    x2=svd.transform(x1)
    x3=sparse.csr_matrix(x2)
    c=loaded_model.predict(x3)
    print c
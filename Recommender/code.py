loaded_model = pickle.load(open('finalized_model.sav', 'rb'))
t_m=pickle.load(open('tfidf_model.pickle', 'rb'))
s_m=pickle.load(open('svd_model.pickle', 'rb'))

def predict(lyrics,tfidf,svd,km):
    lyrics=lyrics.decode('utf-8')
    lyrics = lyrics.replace('\n', ' ')
    lyrics=[lyrics]
    x1=t_m.transform(lyrics)
    x2=s_m.transform(x1)
    x3=sparse.csr_matrix(x2)
    c=loaded_model.predict(x3)
    print c
    
    
## CLASSES
# 0 - SOOTHING
# 1 - ENERGETIC
# 2 - ROMANTIC / LIVELY
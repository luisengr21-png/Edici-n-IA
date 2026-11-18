import re, sys, json, difflib, unicodedata
sys.argv=['x','/home/user/Edici-n-IA/entregas/pobreza-de-lujo/01_guion_largo.md','/dev/null','rows.py','tecnico_tpl.md']
# reutiliza el parser del generador del guion técnico
src=open('gen_tecnico.py').read().split("body = open(sys.argv[4])")[0]
exec(src)
words_audio=json.load(open('/home/user/Edici-n-IA/audio/pobreza-de-lujo/transcripcion_palabras_largo.json'))
def nz(w):
    w=unicodedata.normalize('NFC',w.lower()); return re.findall(r'[\wáéíóúüñ]+',w)
hyp=[];ht=[]
for w,s,e in words_audio:
    for t in nz(w): hyp.append(t); ht.append((s,e))
sm=difflib.SequenceMatcher(None,words,hyp,autojunk=False)
tmap=[None]*len(words)
for a,b,size in sm.get_matching_blocks():
    for k in range(size): tmap[a+k]=ht[b+k][0]
# interpolar huecos
known=[i for i,v in enumerate(tmap) if v is not None]
for i in range(len(tmap)):
    if tmap[i] is None:
        prev=max([k for k in known if k<i],default=None); nxt=min([k for k in known if k>i],default=None)
        if prev is None: tmap[i]=tmap[nxt]
        elif nxt is None: tmap[i]=tmap[prev]+0.4*(i-prev)
        else: tmap[i]=tmap[prev]+(tmap[nxt]-tmap[prev])*(i-prev)/(nxt-prev)
cov=len(known)/len(words)
AUDIO_END=911.0
sec=None; out=[]; n=0
for r in located:
    if 'section' in r: sec=r['section']; continue
    n+=1
    out.append(dict(n=n,section=sec,start=round(max(0,tmap[r['idx']]-0.12),2) if n>1 else 0.0,tipo=r['tipo'],desc=r['desc'],txt=r['txt'],sfx=r['sfx'],mus=r['mus'],mark=r['mark'],frag=frag(r['idx'],r['end_idx'])))
for a,b in zip(out,out[1:]): a['end']=b['start']
out[-1]['end']=AUDIO_END+12
json.dump(dict(audioEnd=AUDIO_END,duration=AUDIO_END+12,scenes=out),open('plan_base.json','w'),ensure_ascii=False,indent=0)
d=[s['end']-s['start'] for s in out]
print('cobertura',round(cov,3),'escenas',len(out),'max',max(d),'min',min(d))
print([ (s['n'],round(s['end']-s['start'],1)) for s in out if s['end']-s['start']>8.5 or s['end']-s['start']<1.0])

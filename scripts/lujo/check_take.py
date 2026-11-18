import sys, re, difflib, unicodedata, json, subprocess, numpy as np
def load(f):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True,check=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8')
def norm(s):
    s=unicodedata.normalize('NFC',s.lower()); s=re.sub(r'\[[^\]]*\]',' ',s)
    return re.findall(r"[\wáéíóúüñ]+", s)
ref = norm(open(sys.argv[1]).read())
for f in sys.argv[2:]:
    segs,_ = m.transcribe(load(f), language='es', word_timestamps=True, vad_filter=False)
    words=[]; 
    for s in segs:
        for w in s.words: words.append((w.word.strip(), round(w.start,2), round(w.end,2)))
    hyp = norm(' '.join(w for w,_,_ in words))
    sm = difflib.SequenceMatcher(None, ref, hyp)
    errs=[(op,' '.join(ref[i1:i2]),' '.join(hyp[j1:j2])) for op,i1,i2,j1,j2 in sm.get_opcodes() if op!='equal']
    errs=[e for e in errs if not re.search(r'\d', e[2])]
    print(f'== {f}: ratio {sm.ratio():.3f}, diferencias {len(errs)}')
    for e in errs[:25]: print('  ',e)
    json.dump(words, open(f+'.words.json','w'), ensure_ascii=False)

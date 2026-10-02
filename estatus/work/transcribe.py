import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe("work/narracion.mp3", language="es", word_timestamps=True, vad_filter=True, beam_size=5)
out = []
for s in segs:
    out.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
                "words": [{"w": w.word, "s": round(w.start, 2), "e": round(w.end, 2)} for w in s.words]})
    print(f"[{s.start:7.2f} - {s.end:7.2f}] {s.text.strip()}", flush=True)
json.dump(out, open("work/transcript.json", "w"), ensure_ascii=False, indent=1)

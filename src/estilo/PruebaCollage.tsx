// Prueba del estilo «collage» (inicio del video 6, «El hombre de los volantes»).
// Referencias del creador: MOATSEEK (recortes tipo estampa, tarjetas, sellos, ritmo rápido),
// The School of Life (notas escritas a mano, papel cuadriculado, espacio, escenas que se arman despacio)
// y MIGALA (collage con humor). Solo es una prueba: usa recursos de videos anteriores.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderEl} from '../burnout/elements';
import {clamp, eio, eo, hash, lerp, spr} from '../burnout/kit';

const ANTON = 'Anton, Impact, sans-serif';
const HAND = 'Caveat, cursive';
const MARKER = '"Permanent Marker", cursive';
const EMOJI = '"Noto Color Emoji", sans-serif';
const C = {char: '#26252b', navy: '#14213d', cream: '#f3ead8', red: '#e63b2e', green: '#2ee59d', yellow: '#ffc93c', ink: '#1d1b22'};

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fuentes'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Anton', `url(${staticFile('canal/fonts/anton-regular.ttf')})`),
      new FontFace('Caveat', `url(${staticFile('canal/fonts/caveat-700.woff2')})`),
      new FontFace('Permanent Marker', `url(${staticFile('canal/fonts/permanent-marker-400.woff2')})`),
    ];
    Promise.all(fs.map((f) => f.load().then((x) => document.fonts.add(x)))).then(() => continueRender(h));
  }, [h]);
};

// ── Fondos de papel (textura hecha con ruido) ──
const Paper: React.FC<{color: string; id: string; grid?: string; crumple?: boolean}> = ({color, id, grid, crumple}) => (
  <AbsoluteFill style={{background: color}}>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <filter id={`n${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency={crumple ? 0.006 : 0.9} numOctaves={crumple ? 4 : 2} seed={3} />
        {crumple ? (
          <feDiffuseLighting lightingColor="#fff" surfaceScale={3}>
            <feDistantLight azimuth={225} elevation={55} />
          </feDiffuseLighting>
        ) : (
          <feColorMatrix type="saturate" values="0" />
        )}
      </filter>
      <rect width="1920" height="1080" filter={`url(#n${id})`} opacity={crumple ? 0.35 : 0.13} style={{mixBlendMode: 'multiply'}} />
    </svg>
    {grid && <AbsoluteFill style={{backgroundImage: `linear-gradient(${grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${grid} 1.5px, transparent 1.5px)`, backgroundSize: '54px 54px'}} />}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)'}} />
  </AbsoluteFill>
);

const Stars: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#08080c'}}>
    {Array.from({length: 160}).map((_, k) => {
      const tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(k) * 2) + k);
      return <div key={k} style={{position: 'absolute', left: hash(k * 3.1) * 1920, top: hash(k * 7.7) * 1080, width: 1 + hash(k) * 3, height: 1 + hash(k) * 3, borderRadius: 3, background: '#fff', opacity: 0.25 + 0.6 * tw}} />;
    })}
  </AbsoluteFill>
);

// ── Piezas del collage ──
// Borde blanco tipo estampa (calcomanía) alrededor de cualquier recorte.
const STICKER = 'drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 18px 22px rgba(0,0,0,0.45))';

// Tarjeta con marco blanco y esquinas redondeadas que entra deslizándose y rebota.
const Card: React.FC<{t: number; at: number; x: number; y: number; w: number; h: number; rot?: number; from?: 'left' | 'right' | 'top'; children: React.ReactNode}> = ({t, at, x, y, w, h, rot = 0, from = 'right', children}) => {
  const p = spr(t, at, 1.6, 0.5);
  const dx = from === 'right' ? 1400 : from === 'left' ? -1400 : 0, dy = from === 'top' ? -900 : 0;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translate(${lerp(dx, 0, p)}px, ${lerp(dy, 0, p)}px) rotate(${rot + (1 - p) * 10}deg)`, background: '#fff', padding: 14, borderRadius: 26, boxShadow: '0 30px 50px rgba(0,0,0,0.45)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative'}}>{children}</div>
    </div>
  );
};

// Texto escrito a mano que aparece letra por letra.
const Hand: React.FC<{t: number; at: number; text: string; x: number; y: number; size: number; color: string; rot?: number; font?: string; speed?: number}> = ({t, at, text, x, y, size, color, rot = 0, font = HAND, speed = 22}) => {
  const n = Math.floor(clamp((t - at) * speed, 0, text.length));
  if (t < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: font, fontSize: size, color, whiteSpace: 'pre', lineHeight: 1}}>{text.slice(0, n)}<span style={{opacity: 0}}>{text.slice(n)}</span></div>;
};

// Trazo dibujado a mano (flecha, subrayado, círculo) que se va dibujando.
const Stroke: React.FC<{t: number; at: number; d: string; color: string; w?: number; dur?: number; len?: number; head?: string}> = ({t, at, d, color, w = 7, dur = 0.5, len = 1600, head}) => {
  const p = eio(t, at, dur);
  return (
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {head && p > 0.95 && <path d={head} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

// Sello de goma que cae de golpe.
const Stamp: React.FC<{t: number; at: number; text: string; x: number; y: number; color: string; rot?: number; size?: number}> = ({t, at, text, x, y, color, rot = -12, size = 92}) => {
  if (t < at) return null;
  const s = lerp(2.4, 1, eo(t, at, 0.14));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: clamp((t - at) / 0.06), border: `9px solid ${color}`, borderRadius: 14, padding: '6px 30px', fontFamily: ANTON, fontSize: size, color, letterSpacing: 4, background: 'rgba(0,0,0,0.12)', boxShadow: `0 0 30px ${color}55`, maskImage: 'radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 100%)', WebkitMaskImage: 'radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 100%)'}}>
      {text}
    </div>
  );
};

const Pop: React.FC<{t: number; at: number; x: number; y: number; children: React.ReactNode; rot?: number}> = ({t, at, x, y, children, rot = 0}) => {
  const s = spr(t, at, 2.4, 0.42);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot + Math.sin(t * 1.6) * 3}deg)`, filter: STICKER}}>{children}</div>;
};

const Tu: React.FC<{t: number; at: number; x: number; y: number; s: number; pose: string; mood?: string; hold?: string; float?: number}> = ({t, at, ...p}) => (
  <div style={{position: 'absolute', inset: 0, filter: STICKER}}>{renderEl({k: 'person', at, anim: 'up', ...p} as any, t, 0)}</div>
);

// ── Escenas (tiempos de la voz real del gancho) ──
const S1: React.FC<{t: number}> = ({t}) => {
  // «Son las once de la mañana en Las Vegas. El calor derrite el asfalto.»
  const heat = eo(t, 2.9, 1.2);
  return (
    <AbsoluteFill>
      <Paper color={C.char} id="s1" />
      <Card t={t} at={0.05} x={1020} y={560} w={1180} h={680} rot={-3}>
        <AbsoluteFill style={{transform: `scale(${1.08 + t * 0.01})`, filter: `saturate(1.15) contrast(1.05) blur(${heat * Math.abs(Math.sin(t * 9)) * 0.8}px)`}}>
          <OffthreadVideo src={staticFile('dedicas/videos/escena_074.mp4')} startFrom={30} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: `linear-gradient(0deg, rgba(255,120,30,${0.28 * heat}), transparent 60%)`}} />
      </Card>
      <Hand t={t} at={0.35} text="11:00 a.m." x={300} y={210} size={110} color={C.cream} rot={-6} />
      <Stroke t={t} at={1.0} d="M 330 280 Q 380 420 520 420" color={C.cream} w={6} len={400} head="M 490 395 L 525 421 L 488 444" />
      <Pop t={t} at={2.75} x={1560} y={210}>
        <svg width="260" height="260" viewBox="-130 -130 260 260" style={{transform: `rotate(${t * 25}deg)`}}>
          {Array.from({length: 12}).map((_, k) => <line key={k} x1="0" y1="-78" x2="0" y2="-118" stroke={C.yellow} strokeWidth="12" strokeLinecap="round" transform={`rotate(${k * 30})`} />)}
          <circle r="62" fill={C.yellow} />
        </svg>
      </Pop>
      {[0, 1, 2].map((k) => (
        <Stroke key={k} t={t} at={3.1 + k * 0.18} d={`M ${720 + k * 230} 930 q 25 -35 0 -70 q -25 -35 0 -70 q 25 -35 0 -70`} color={C.red} w={9} len={300} dur={0.6} />
      ))}
    </AbsoluteFill>
  );
};

const S2: React.FC<{t: number}> = ({t}) => {
  // «Un hombre con chaleco brillante reparte volantes en la banqueta: "Pásele, hay aire acondicionado… y tragamonedas".»
  const t0 = 5.6;
  return (
    <AbsoluteFill>
      <Paper color={C.cream} id="s2" grid="rgba(80,120,190,0.22)" crumple />
      <Tu t={t} at={t0 + 0.15} x={560} y={600} s={1.55} pose="reach" mood="happy" hold="📄" float={3} />
      {[0, 1, 2, 3].map((k) => {
        const at = t0 + 1.4 + k * 0.45;
        const p = eo(t, at, 1.1);
        if (t < at || p >= 1) return null;
        return (
          <div key={k} style={{position: 'absolute', left: lerp(760, 2050, p), top: lerp(560, 260 + hash(k) * 520, p), opacity: 1 - clamp((p - 0.7) / 0.3), transform: `rotate(${lerp(0, -25 + hash(k + 4) * 50, p) + p * 180}deg)`, width: 120, height: 160, background: ['#ff5d8f', C.yellow, C.green, '#6ec6ff'][k], borderRadius: 8, boxShadow: '0 12px 18px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI, fontSize: 60}}>🎰</div>
        );
      })}
      {t > 9.35 && (
        <div style={{position: 'absolute', left: 1180, top: 150, transform: `scale(${spr(t, 9.35, 2.2, 0.45)}) rotate(-3deg)`, transformOrigin: '0% 100%', background: '#fff', border: `6px solid ${C.ink}`, borderRadius: 60, padding: '22px 60px', fontFamily: MARKER, fontSize: 96, color: C.ink, boxShadow: '0 14px 0 rgba(0,0,0,0.15)'}}>
          ¡Pásele!
        </div>
      )}
      <Pop t={t} at={10.35} x={1180} y={560}><div style={{fontFamily: EMOJI, fontSize: 170}}>❄️</div></Pop>
      <Hand t={t} at={10.5} text="aire acondicionado" x={1180} y={730} size={70} color={C.ink} rot={-4} />
      <Pop t={t} at={11.95} x={1640} y={520} rot={8}><div style={{fontFamily: EMOJI, fontSize: 190}}>🎰</div></Pop>
      <Stroke t={t} at={12.1} d="M 1470 850 Q 1620 860 1640 680" color={C.red} w={8} len={400} head="M 1616 705 L 1641 676 L 1664 708" />
      <Hand t={t} at={12.15} text="…y tragamonedas" x={1400} y={900} size={64} color={C.red} rot={3} />
    </AbsoluteFill>
  );
};

const S3: React.FC<{t: number}> = ({t}) => {
  // «Para las estadísticas, este hombre es una excelente noticia.» → gráfica que baja + sello.
  const pts = [[330, 330], [560, 380], [790, 360], [1020, 520], [1250, 560], [1480, 760], [1650, 800]];
  const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ');
  return (
    <AbsoluteFill>
      <Paper color={C.navy} id="s3" />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '120px 120px'}} />
      <Hand t={t} at={13.5} text="desempleo" x={420} y={210} size={96} color={C.cream} rot={-4} />
      <Stroke t={t} at={13.7} d={d} color="#ffffff" w={10} dur={1.6} len={1800} />
      {pts.map((p, k) => (t > 13.7 + (k / pts.length) * 1.6 ? <div key={k} style={{position: 'absolute', left: p[0] - 13, top: p[1] - 13, width: 26, height: 26, borderRadius: 13, background: '#fff', transform: `scale(${spr(t, 13.7 + (k / pts.length) * 1.6, 3, 0.5)})`}} /> : null))}
      <Tu t={t} at={14.8} x={1650} y={520} s={0.8} pose="handup" mood="happy" />
      <Stamp t={t} at={15.75} text="¡BUENA NOTICIA!" x={980} y={880} color={C.green} rot={-6} size={84} />
    </AbsoluteFill>
  );
};

const S4: React.FC<{t: number}> = ({t}) => {
  // «Tiene trabajo, ya no cuenta como desempleado.» → la lista oficial, con su nombre tachado.
  const t0 = 17.35;
  const rows = ['Ana R.', 'Luis M.', 'Carlos P.', 'Hombre de los volantes', 'Sofía T.'];
  return (
    <AbsoluteFill>
      <Paper color="#e9e2d2" id="s4" crumple />
      <div style={{position: 'absolute', left: 520, top: 110, width: 880, height: 860, background: '#fffdf6', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', transform: `rotate(${-2 + (1 - spr(t, t0, 1.6, 0.5)) * 8}deg) translateY(${(1 - spr(t, t0, 1.6, 0.5)) * 900}px)`, backgroundImage: 'linear-gradient(rgba(70,110,200,0.25) 2px, transparent 2px)', backgroundSize: '100% 112px', backgroundPosition: '0 70px'}}>
        <div style={{position: 'absolute', left: 60, top: 40, fontFamily: ANTON, fontSize: 70, color: C.ink, letterSpacing: 3}}>LISTA DE DESEMPLEADOS</div>
        {rows.map((r, k) => (
          <div key={k} style={{position: 'absolute', left: 80, top: 172 + k * 112, fontFamily: HAND, fontSize: 64, color: '#2b3a67'}}>{r}</div>
        ))}
      </div>
      <Stroke t={t} at={18.6} d="M 590 664 C 800 648 1100 684 1330 656" color={C.red} w={12} dur={0.45} len={900} />
      <Hand t={t} at={19.05} text="¡ya no!" x={1560} y={560} size={92} color={C.red} rot={-10} font={MARKER} />
    </AbsoluteFill>
  );
};

const S5: React.FC<{t: number}> = ({t}) => {
  // «Y aún así, le está pasando algo que ningún gobierno mide… y que a lo mejor también te está pasando a ti.» (lento)
  const z = 1 + eio(t, 20.4, 8.5) * 0.12;
  return (
    <AbsoluteFill>
      <Stars t={t} />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${Math.sin(t * 0.7) * 20}px, ${Math.cos(t * 0.5) * 16}px) rotate(${Math.sin(t * 0.4) * 6}deg)`, transformOrigin: '960px 560px'}}>
          <Tu t={t} at={20.6} x={960} y={600} s={1.1} pose="shrug" mood="worried" />
        </div>
        <Hand t={t} at={21.7} text="algo que ningún gobierno mide…" x={960} y={180} size={92} color={C.cream} speed={26} />
        <Stroke t={t} at={23.9} d="M 640 250 C 800 270 1150 240 1300 262" color={C.red} w={9} dur={0.5} len={800} />
      </AbsoluteFill>
      <Stroke t={t} at={26.8} d="M 1330 860 C 1500 900 1660 760 1700 620" color={C.red} w={11} dur={0.6} len={700} head="M 1668 650 L 1701 612 L 1726 657" />
      <Hand t={t} at={27.2} text="¿a ti?" x={1600} y={960} size={120} color={C.red} rot={-8} font={MARKER} />
    </AbsoluteFill>
  );
};

// Cambios entre escenas: hoja que entra deslizándose, golpe rápido y fundido lento al espacio.
const CUTS = [5.6, 13.4, 17.35, 20.4];
export const PruebaCollage: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scenes = [S1, S2, S3, S4, S5];
  const i = CUTS.filter((c) => t >= c).length;
  const Cur = scenes[i];
  const Prev = i > 0 ? scenes[i - 1] : null;
  const since = i > 0 ? t - CUTS[i - 1] : 99;
  const style = (k: number): React.CSSProperties => {
    const p = [eio(since, 0, 0.55), eo(since, 0, 0.3), eio(since, 0, 0.45), eio(since, 0, 0.9)][k];
    if (k === 0) return {transform: `translateX(${(1 - p) * 1920}px) rotate(${(1 - p) * 4}deg)`, boxShadow: '-40px 0 60px rgba(0,0,0,0.5)'};
    if (k === 1) return {transform: `translateX(${(1 - p) * -1920}px)`, filter: `blur(${(1 - p) * 18}px)`};
    if (k === 2) return {transform: `translateY(${(1 - p) * 1080}px)`};
    return {opacity: p};
  };
  const inTr = Prev && since < [0.55, 0.3, 0.45, 0.9][i - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {inTr && Prev && <AbsoluteFill><Prev t={t} /></AbsoluteFill>}
      <AbsoluteFill style={inTr ? style(i - 1) : undefined}><Cur t={t} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: 1 - eo(t, 28.9, 0.6), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

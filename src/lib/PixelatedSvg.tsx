import React, {useLayoutEffect, useRef, useState} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {continueRender, delayRender} from 'remotion';

// Pixelación real: rasteriza un SVG en un canvas diminuto y lo amplía sin suavizado.
export const PixelatedSvg: React.FC<{children: React.ReactElement; block: number; saturation?: number}> = ({children, block, saturation = 1}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender('Pixelando el sueño'));
  const markup = renderToStaticMarkup(children).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

  useLayoutEffect(() => {
    const canvas = ref.current!;
    const img = new Image();
    img.onload = () => {
      const w = Math.max(1, Math.round(1920 / block));
      const h = Math.max(1, Math.round(1080 / block));
      const small = document.createElement('canvas');
      small.width = w;
      small.height = h;
      const sctx = small.getContext('2d')!;
      sctx.filter = `saturate(${saturation})`;
      sctx.drawImage(img, 0, 0, w, h);
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 1920, 1080);
      ctx.drawImage(small, 0, 0, 1920, 1080);
      continueRender(handle);
    };
    img.onerror = () => continueRender(handle);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
  }, [markup, block, saturation, handle]);

  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', inset: 0}} />;
};

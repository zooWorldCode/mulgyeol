import { useEffect, useRef, useState } from 'react';
import './ScratchCard.css';

export default function ScratchCard({ children, onComplete }) {
  const canvasRef = useRef(null);
  const coverImageRef = useRef(null);
  const isDrawingRef = useRef(false);
  const hasScratchedRef = useRef(false);
  const completedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function drawCover() {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * scale);
      canvas.height = Math.floor(rect.height * scale);

      const ctx = canvas.getContext('2d');
      const coverImage = coverImageRef.current;

      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (coverImage) {
        ctx.drawImage(coverImage, 0, 0, rect.width, rect.height);
        ctx.fillStyle = 'rgba(42, 37, 35, 0)';
        ctx.fillRect(0, 0, rect.width, rect.height);
      } else {
        ctx.fillStyle = '#ed906e';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      ctx.fillStyle = '#fffcf6';
      ctx.font = '400 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('유약을 긁어보세요!', rect.width / 2, rect.height / 2);
    }

    const coverImage = new Image();
    coverImage.src = '/images/coupon/scratch.png';
    coverImage.onload = () => {
      coverImageRef.current = coverImage;
      if (!hasScratchedRef.current && !completedRef.current) {
        drawCover();
      }
      setReady(true);
    };
    coverImage.onerror = () => {
      setReady(true);
    };

    drawCover();
    setReady(true);

    const resizeObserver = new ResizeObserver(() => {
      if (hasScratchedRef.current || completedRef.current) return;
      drawCover();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function getPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event;

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  }

  function scratch(event) {
    event.preventDefault();
    hasScratchedRef.current = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPoint(event);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  }

  function checkProgress() {
    if (completedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        cleared += 1;
      }
    }

    if (cleared / (pixels.length / 4) > 0.55) {
      completedRef.current = true;
      canvas.style.opacity = '0';
      window.setTimeout(() => onComplete?.(), 250);
    }
  }

  return (
    <div className="scratch-card">
      <div className="scratch-card__result">{children}</div>
      <canvas
        ref={canvasRef}
        className="scratch-card__cover"
        onMouseDown={(event) => {
          isDrawingRef.current = true;
          scratch(event);
        }}
        onMouseMove={(event) => {
          if (isDrawingRef.current) scratch(event);
        }}
        onMouseUp={() => {
          isDrawingRef.current = false;
        }}
        onMouseLeave={() => {
          isDrawingRef.current = false;
        }}
        onTouchStart={(event) => {
          isDrawingRef.current = true;
          scratch(event);
        }}
        onTouchMove={(event) => {
          if (isDrawingRef.current) scratch(event);
        }}
        onTouchEnd={() => {
          isDrawingRef.current = false;
        }}
        aria-hidden={!ready}
      />
    </div>
  );
}

import { useLocation } from 'react-router-dom';
import './TopMarqueeBar.css';

export const MARQUEE_LINE =
  '수제작 · 자연의 결을 담다 · 물결 · Handmade Ceramics · Mulgyeol · Crafted by Hand · 자연에서 온 곡선 · Handmade Pottery · 자연을 빚다';

const HIDDEN_PATHS = ['/login', '/signup'];

/** 한 줄 길이를 넉넉히 확보해 끊김 없이 이어지도록 동일 문구를 이어 붙입니다. */
const STRIP_UNITS = 12;

function buildStrip() {
  const unit = `${MARQUEE_LINE} · `;
  return unit.repeat(STRIP_UNITS);
}

export default function TopMarqueeBar() {
  const { pathname } = useLocation();
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (HIDDEN_PATHS.includes(normalized)) {
    return null;
  }

  const strip = buildStrip();

  return (
    <div
      className="top-marquee-bar"
      role="region"
      aria-label={`브랜드 슬로건: ${MARQUEE_LINE}`}
    >
      <div className="top-marquee-bar__viewport">
        <div className="top-marquee-bar__track" aria-hidden="true">
          <span className="top-marquee-bar__segment">{strip}</span>
          <span className="top-marquee-bar__segment">{strip}</span>
        </div>
      </div>
    </div>
  );
}

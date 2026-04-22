import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroBannerSlider.css';

const banners = [
  {
    id: 1,
    image: '/images/main/hero/1.png',
    alt: '메인 배너 1',
    link: '/event/1',
  },
  {
    id: 2,
    image: '/images/main/hero/2.png',
    alt: '메인 배너 2',
    link: '/event/2',
  },
  {
    id: 3,
    image: '/images/main/hero/3.png',
    alt: '메인 배너 3',
    link: '/event/3',
  },
];

const DURATION = 4000;
const N = banners.length;

const buildSlides = () => [banners[N - 1], ...banners, banners[0]];
const SLIDES = buildSlides();

function Divider() {
  return (
    <div className="hero-banner__divider" aria-hidden="true">
      <div className="hero-banner__divider-solid" />
      <div className="hero-banner__divider-dotted" />
    </div>
  );
}

export default function HeroBannerSlider() {
  const [trackIndex, setTrackIndex] = useState(1);
  const [realIndex, setRealIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const isJumping = useRef(false);

  const moveToTrack = useCallback((tIdx, rIdx, withAnim = true) => {
    setAnimated(withAnim);
    setTrackIndex(tIdx);
    setRealIndex(rIdx);
    setProgressKey((k) => k + 1);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (isJumping.current) return;

    if (trackIndex === N + 1) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(1);
      setTimeout(() => {
        isJumping.current = false;
      }, 50);
    } else if (trackIndex === 0) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(N);
      setTimeout(() => {
        isJumping.current = false;
      }, 50);
    }
  }, [trackIndex]);

  useEffect(() => {
    if (paused) return undefined;

    const id = setInterval(() => {
      setTrackIndex((prev) => {
        const next = prev + 1;
        const nextReal = next > N ? 0 : next - 1;
        setRealIndex(nextReal);
        setAnimated(true);
        setProgressKey((k) => k + 1);
        return next;
      });
    }, DURATION);

    return () => clearInterval(id);
  }, [paused]);

  const goTo = useCallback(
    (rIdx) => {
      moveToTrack(rIdx + 1, rIdx, true);
    },
    [moveToTrack]
  );

  return (
    <section className="hero-banner" aria-label="메인 배너">
      <div className="hero-banner__top-divider">
        <Divider />
      </div>

      <div
        className="hero-banner__viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="hero-banner__track"
          style={{
            transform: `translateX(-${trackIndex * 100}%)`,
            transition: animated
              ? 'transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {SLIDES.map((banner, i) => (
            <Link
              key={`${banner.id}-${i}`}
              to={banner.link}
              className="hero-banner__slide"
            >
              <img className="hero-banner__image" src={banner.image} alt={banner.alt} />
            </Link>
          ))}
        </div>
      </div>

      <div className="hero-banner__bottom-row">
        <div className="hero-banner__bottom-divider">
          <Divider />
        </div>

        <div className="hero-banner__indicators">
          {banners.map((_, i) => {
            const isActive = i === realIndex;

            return (
              <button
                key={i}
                type="button"
                className={
                  isActive
                    ? 'hero-banner__dot hero-banner__dot--active'
                    : 'hero-banner__dot'
                }
                onClick={() => goTo(i)}
                aria-label={`슬라이드 ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive ? (
                  <span
                    key={progressKey}
                    className="hero-banner__progress"
                    style={{
                      animationDuration: `${DURATION}ms`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

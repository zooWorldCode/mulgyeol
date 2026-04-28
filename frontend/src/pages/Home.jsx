import { useEffect, useState } from 'react';
import HeroBannerSlider from '../components/home/hero/HeroBannerSlider.jsx';
import HomeCategorySection from '../components/home/category/HomeCategorySection.jsx';
import HomeBestsSection from '../components/home/bests/HomeBestsSection.jsx';
import HomeEventSection from '../components/home/event/HomeEventSection.jsx';
import HomeCommunitySection from '../components/home/community/HomeCommunitySection.jsx';
import ScratchCouponModal from '../components/coupon/ScratchCouponModal.jsx';
import './Home.css';

function HomeTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={
        isVisible
          ? 'home-top-button home-top-button--visible'
          : 'home-top-button'
      }
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로 이동"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      <ScratchCouponModal />
      <HomeTopButton />
      <HeroBannerSlider />
      <HomeCategorySection />
      <HomeBestsSection />
      <HomeEventSection />
      <HomeCommunitySection />
    </main>
  );
}

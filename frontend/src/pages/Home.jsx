import HeroBannerSlider from '../components/home/hero/HeroBannerSlider.jsx';
import HomeCategorySection from '../components/home/category/HomeCategorySection.jsx';
import HomeBestsSection from '../components/home/bests/HomeBestsSection.jsx';
import HomeEventSection from '../components/home/event/HomeEventSection.jsx';
import HomeCommunitySection from '../components/home/community/HomeCommunitySection.jsx';
import ScratchCouponModal from '../components/coupon/ScratchCouponModal.jsx';
import './Home.css';

export default function Home() {
  return (
    <main className="home-page">
      <ScratchCouponModal />
      <HeroBannerSlider />
      <HomeCategorySection />
      <HomeBestsSection />
      <HomeEventSection />
      <HomeCommunitySection />
    </main>
  );
}

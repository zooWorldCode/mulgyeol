import { useEffect, useMemo, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './HomeCategorySection.css';

const ROTATION_DELAY = 4000;
const MotionLink = motion(Link);
const cardTransition = {
  layout: {
    duration: 0.72,
    ease: [0.22, 1, 0.36, 1],
  },
};

const categories = [
  {
    id: 'plate',
    title: '접시',
    name: 'PLATE',
    image: '/images/main/category/plate.png',
    count: '20 Items',
  },
  {
    id: 'bowl',
    title: '그릇',
    name: 'BOWL',
    image: '/images/main/category/bowl.png',
    count: '20 Items',
  },
  {
    id: 'cup_teaware',
    title: '컵/다기',
    name: 'CUP',
    image: '/images/main/category/cup.png',
    count: '20 Items',
  },
  {
    id: 'vase',
    title: '화병',
    name: 'VASE',
    image: '/images/main/category/vase.png',
    count: '20 Items',
  },
  {
    id: 'decor',
    title: '장식',
    name: 'DECO',
    image: '/images/main/category/deco.png',
    count: '20 Items',
  },
];

function ArrowIcon() {
  return (
    <svg
      className="home-category__arrow-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="home-category__arrow-circle" cx="12" cy="12" r="10" />
      <path className="home-category__arrow-path" d="M7 12h9" />
      <path className="home-category__arrow-path" d="m12 8 4 4-4 4" />
    </svg>
  );
}

function CategoryCard({ category, variant }) {
  const isFeatured = variant === 'featured';
  const className = isFeatured
    ? 'home-category__featured-card'
    : 'home-category__card';

  return (
    <MotionLink
      layout
      layoutId={`home-category-card-${category.id}`}
      to={`/category?category=${category.id}`}
      className={className}
      style={
        isFeatured
          ? { '--featured-category-image': `url(${category.image})` }
          : undefined
      }
      transition={cardTransition}
      whileHover={{ y: -6 }}
    >
      {isFeatured ? (
        <>
          <img
            key={`featured-image-${category.id}`}
            className="home-category__featured-image-layer"
            src={category.image}
            alt=""
            aria-hidden="true"
          />

          <motion.span layout="position" className="home-category__featured-copy">
            <span className="home-category__featured-title">{category.title}</span>
            <span className="home-category__featured-name">{category.name}</span>
            <span className="home-category__arrow-button">
              <ArrowIcon />
            </span>
          </motion.span>

          <motion.span layout="position" className="home-category__badge">
            {category.count}
          </motion.span>
        </>
      ) : (
        <>
          <span
            className="home-category__image-panel"
            style={{ '--category-card-image': `url(${category.image})` }}
            aria-hidden="true"
          >
            <span className="home-category__image-shadow" />
          </span>

          <motion.span layout="position" className="home-category__copy-panel">
            <span className="home-category__title">{category.title}</span>
            <span className="home-category__name">{category.name}</span>
            <span className="home-category__arrow-button home-category__arrow-button--small">
              <ArrowIcon />
            </span>
          </motion.span>
        </>
      )}
    </MotionLink>
  );
}

export default function HomeCategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % categories.length);
    }, ROTATION_DELAY);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, []);

  const featuredCategory = categories[activeIndex];
  const sideCategories = useMemo(
    () => [
      ...categories.slice(activeIndex + 1),
      ...categories.slice(0, activeIndex),
    ],
    [activeIndex],
  );

  return (
    <section className="home-category" aria-labelledby="home-category-title">
      <h2 id="home-category-title" className="home-category__sr-only">
        카테고리
      </h2>

      <LayoutGroup id="home-category-carousel">
        <div className="home-category__layout">
          <CategoryCard category={featuredCategory} variant="featured" />

          <div className="home-category__side-grid">
            {sideCategories.map((category) => (
              <CategoryCard key={category.id} category={category} variant="side" />
            ))}
          </div>
        </div>
      </LayoutGroup>
    </section>
  );
}

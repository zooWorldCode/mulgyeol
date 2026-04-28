import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './HomeCategorySection.css';

const ROTATION_DELAY = 10000;
const MotionLink = motion(Link);
const cardTransition = {
  layout: {
    duration: 1.25,
    ease: [0.16, 1, 0.3, 1],
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

function CategoryCard({ category, position }) {
  const isFeatured = position === 0;
  const className = [
    'home-category__item',
    isFeatured ? 'home-category__item--featured' : 'home-category__item--side',
    `home-category__item--slot-${position}`,
  ].join(' ');

  return (
    <MotionLink
      layout
      to={`/category?category=${category.id}`}
      className={className}
      transition={cardTransition}
      whileHover={{ y: -6 }}
    >
      <img
        className="home-category__featured-image-layer"
        src={category.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <span
        className="home-category__image-panel"
        style={{ '--category-card-image': `url(${category.image})` }}
        aria-hidden="true"
      >
        <span className="home-category__image-shadow" />
      </span>

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

      <motion.span layout="position" className="home-category__copy-panel">
        <span className="home-category__title">{category.title}</span>
        <span className="home-category__name">{category.name}</span>
        <span className="home-category__arrow-button home-category__arrow-button--small">
          <ArrowIcon />
        </span>
      </motion.span>
    </MotionLink>
  );
}

export default function HomeCategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return undefined;

    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % categories.length);
    }, ROTATION_DELAY);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, [isInView]);

  const orderedCategories = useMemo(
    () => [
      ...categories.slice(activeIndex),
      ...categories.slice(0, activeIndex),
    ],
    [activeIndex],
  );

  return (
    <section ref={sectionRef} className="home-category" aria-labelledby="home-category-title">
      <Link to="/category" className="home-category__heading">
        <h2 id="home-category-title">카테고리</h2>
        <span className="home-category__heading-arrow" aria-hidden="true">
          →
        </span>
      </Link>

      <div className="home-category__layout">
        {orderedCategories.map((category, index) => (
          <CategoryCard key={category.id} category={category} position={index} />
        ))}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import './HomeCategorySection.css';

const categories = [
  {
    id: 'plate',
    title: 'PLATE',
    label: '접시',
    image: '/images/main/category/plate.png',
    className: 'home-category__card--wide',
  },
  {
    id: 'bowl',
    title: 'BOWL',
    label: '그릇',
    image: '/images/main/category/bowl.png',
    className: 'home-category__card--warm',
  },
  {
    id: 'cup_teaware',
    title: 'CUP',
    label: '컵 / 다기',
    image: '/images/main/category/cup.png',
  },
  {
    id: 'vase',
    title: 'VASE',
    label: '화병',
    image: '/images/main/category/vase.png',
  },
  {
    id: 'decor',
    title: 'DECO',
    label: '장식',
    image: '/images/main/category/deco.png',
    className: 'home-category__card--warm',
  },
];

export default function HomeCategorySection() {
  return (
    <section className="home-category" aria-labelledby="home-category-title">
      <Link to="/category" className="home-category__heading">
        <h2 id="home-category-title">카테고리</h2>
        <span className="home-category__heading-arrow" aria-hidden="true">→</span>
      </Link>

      <div className="home-category__grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category?category=${category.id}`}
            className={['home-category__card', category.className]
              .filter(Boolean)
              .join(' ')}
          >
            <img
              className="home-category__image"
              src={category.image}
              alt=""
              aria-hidden="true"
            />
            <span className="home-category__copy">
              <span className="home-category__name">{category.title}</span>
              <span className="home-category__label">{category.label}</span>
              <span className="home-category__arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

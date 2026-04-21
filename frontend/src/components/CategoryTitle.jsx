import './CategoryTitle.css';

const ITEMS = [
  { id: 'plate', label: '접시', image: '/images/category_title/plate.png' },
  { id: 'bowl', label: '그릇', image: '/images/category_title/bowl.png' },
  { id: 'cup_teaware', label: '컵 / 다기', image: '/images/category_title/cup.png' },
  { id: 'vase', label: '화병', image: '/images/category_title/vase.png' },
  { id: 'decor', label: '장식', image: '/images/category_title/deco.png' },
];

export default function CategoryTitle({ activeId, onSelect }) {
  return (
    <nav className="category-title" aria-label="카테고리 선택">
      <div className="category-title__inner">
        <div className="category-title__row">
          {ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={
                  active
                    ? 'category-title__item category-title__item--active'
                    : 'category-title__item'
                }
                onClick={() => onSelect(item.id)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="category-title__circle">
                  <img src={item.image} alt="" width={120} height={120} />
                </span>
                <span className="category-title__label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

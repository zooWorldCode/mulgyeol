import { Link } from 'react-router-dom';

function Meta({ views, commentsCount, likes }) {
  const itemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  };

  return (
    <div
      className="blog-card__meta"
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        color: 'var(--shadow-deep)',
        fontSize: 'var(--font-size-sm)',
        marginTop: 'auto',
      }}
    >
      <span style={itemStyle}>
        <img src="/images/icon/eye.png" alt="" width="14" height="14" />
        {Number(views).toLocaleString()}
      </span>
      <span style={itemStyle}>
        <img src="/images/icon/chat.png" alt="" width="14" height="14" />
        {Number(commentsCount).toLocaleString()}
      </span>
      <span style={itemStyle}>
        <img src="/images/icon/wishlist.svg" alt="" width="14" height="14" />
        {Number(likes).toLocaleString()}
      </span>
    </div>
  );
}

export default function BlogCard({ post, basePath }) {
  const summary =
    post.summary ||
    (post.content ? String(post.content).slice(0, 80) : '') ||
    '요약이 없습니다.';

  return (
    <article className="blog-card">
      <Link
        to={`${basePath}/${post.id}`}
        className="blog-card__link"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          backgroundColor: 'var(--shadow-bright)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 550,
          height: '100%',
        }}
      >
        <div
          className="blog-card__thumb"
          style={{
            width: '100%',
            height: 350,
            background: 'var(--shadow-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="blog-card__image"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span
              className="blog-card__no-image"
              style={{ color: 'var(--shadow-deep)' }}
            >
              No Image
            </span>
          )}
        </div>
        <div
          className="blog-card__body"
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <h3 className="blog-card__title" style={{ margin: '0 0 15px' }}>
            {post.title}
          </h3>
          <p
            className="blog-card__summary"
            style={{
              margin: '0 0 20px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--shadow-deep)',
            }}
          >
            {summary}
          </p>
          <Meta
            views={post.views}
            commentsCount={post.commentsCount}
            likes={post.likes}
          />
        </div>
      </Link>
    </article>
  );
}

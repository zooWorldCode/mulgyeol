import { Link } from 'react-router-dom';

function Meta({ views, commentsCount, likes }) {
  const itemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };

  return (
    <div
      className="blog-featured-card__meta"
      style={{
        display: 'flex',
        gap: 15,
        flexWrap: 'wrap',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--shadow-deep)',
        marginTop: 'auto',
      }}
    >
      <span className="blog-featured-card__meta-item" style={itemStyle}>
        <img src="/images/icon/eye.png" alt="" width="14" height="14" />
        {Number(views).toLocaleString()}
      </span>
      <span className="blog-featured-card__meta-item" style={itemStyle}>
        <img src="/images/icon/chat.png" alt="" width="14" height="14" />
        {Number(commentsCount).toLocaleString()}
      </span>
      <span className="blog-featured-card__meta-item" style={itemStyle}>
        <img src="/images/icon/wishlist.svg" alt="" width="14" height="14" />
        {Number(likes).toLocaleString()}
      </span>
    </div>
  );
}

export default function BlogFeaturedCard({ post, basePath }) {
  const summary =
    post.summary || (post.content ? String(post.content).slice(0, 120) : '');

  return (
    <article className="blog-featured-card">
      <Link
        to={`${basePath}/${post.id}`}
        className="blog-featured-card__link"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 0,
          alignItems: 'stretch',
        }}
      >
        <div
          className="blog-featured-card__image-wrap"
          style={{
            width: '100%',
            height: 280,
            background: 'var(--shadow-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="blog-featured-card__image"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="blog-featured-card__no-image">No Image</span>
          )}
        </div>
        <div
          className="blog-featured-card__body"
          style={{
            padding: '30px',
            background: 'var(--shadow-bright)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2
            className="blog-featured-card__title"
            style={{ marginTop: 0, fontSize: 'var(--font-size-xl)' }}
          >
            {post.title}
          </h2>
          <p
            className="blog-featured-card__summary"
            style={{
              lineHeight: 1.5,
              fontSize: 'var(--font-size-lg)',
              color: 'var(--shadow-deep)',
            }}
          >
            {summary || '요약이 없습니다.'}
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

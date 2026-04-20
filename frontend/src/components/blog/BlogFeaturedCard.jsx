import { Link } from 'react-router-dom';

function Meta({ views, commentsCount, likes }) {
  return (
    <div
      className="blog-featured-card__meta"
      style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
    >
      <span className="blog-featured-card__meta-item">
        <span aria-hidden>👁</span> {Number(views).toLocaleString()}
      </span>
      <span className="blog-featured-card__meta-item">
        <span aria-hidden>💬</span> {Number(commentsCount).toLocaleString()}
      </span>
      <span className="blog-featured-card__meta-item">
        <span aria-hidden>♡</span> {Number(likes).toLocaleString()}
      </span>
    </div>
  );
}

/**
 * @param {{ post: object; basePath: string }} props basePath '/community' or '/blog'
 */
export default function BlogFeaturedCard({ post, basePath }) {
  const summary =
    post.summary ||
    (post.content ? String(post.content).slice(0, 120) : '');

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
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        <div
          className="blog-featured-card__image-wrap"
          style={{
            minHeight: 200,
            background: 'var(--shadow-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="blog-featured-card__image"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="blog-featured-card__no-image">No Image</span>
          )}
        </div>
        <div className="blog-featured-card__body">
          <h2 className="blog-featured-card__title" style={{ marginTop: 0 }}>
            {post.title}
          </h2>
          <p className="blog-featured-card__summary" style={{ lineHeight: 1.5 }}>
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

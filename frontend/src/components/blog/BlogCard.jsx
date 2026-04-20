import { Link } from 'react-router-dom';

function Meta({ views, commentsCount, likes }) {
  return (
    <div
      className="blog-card__meta"
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        color: 'var(--shadow-deep)',
      }}
    >
      <span>
        <span aria-hidden>👁</span> {Number(views).toLocaleString()}
      </span>
      <span>
        <span aria-hidden>💬</span> {Number(commentsCount).toLocaleString()}
      </span>
      <span>
        <span aria-hidden>♡</span> {Number(likes).toLocaleString()}
      </span>
    </div>
  );
}

/**
 * @param {{ post: object; basePath: string }} props
 */
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
          border: '1px solid var(--shadow-bright)',
          display: 'block',
          height: '100%',
        }}
      >
        <div
          className="blog-card__thumb"
          style={{
            aspectRatio: '16/10',
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
              className="blog-card__image"
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
        <div className="blog-card__body" style={{ padding: 10 }}>
          <h3 className="blog-card__title" style={{ margin: '0 0 8px' }}>
            {post.title}
          </h3>
          <p className="blog-card__summary" style={{ margin: '0 0 8px' }}>
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

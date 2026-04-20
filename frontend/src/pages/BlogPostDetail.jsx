import { Link, useLocation, useParams } from 'react-router-dom';
import { getPostById } from '../data/postsDummy.js';

export default function BlogPostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/blog') ? '/blog' : '/community';

  const post = id ? getPostById(id) : null;

  if (!post) {
    return (
      <div className="blog-post-detail blog-post-detail--not-found">
        <p>게시글을 찾을 수 없습니다.</p>
        <Link to={basePath}>목록으로</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-detail">
      <p className="blog-post-detail__nav">
        <Link to={basePath}>← 목록</Link>
      </p>
      <h1 className="blog-post-detail__title">{post.title}</h1>
      <p className="blog-post-detail__date">{post.createdAt}</p>
      <div
        className="blog-post-detail__meta"
        style={{ display: 'flex', gap: 16, marginBottom: 16 }}
      >
        <span>
          <span aria-hidden>👁</span> {Number(post.views).toLocaleString()}
        </span>
        <span>
          <span aria-hidden>💬</span> {Number(post.commentsCount).toLocaleString()}
        </span>
        <span>
          <span aria-hidden>♡</span> {Number(post.likes).toLocaleString()}
        </span>
      </div>
      <div className="blog-post-detail__hero" style={{ maxWidth: 640, marginBottom: 24 }}>
        {post.image ? (
          <img src={post.image} alt="" style={{ width: '100%' }} />
        ) : (
          <div
            style={{
              aspectRatio: '16/10',
              background: 'var(--shadow-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No Image
          </div>
        )}
      </div>
      <p className="blog-post-detail__summary" style={{ marginBottom: 16 }}>
        {post.summary}
      </p>
      <div className="blog-post-detail__content">{post.content}</div>
    </div>
  );
}

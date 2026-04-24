import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './BlogPostDetail.css';
import { DUMMY_POSTS, getPostById } from '../data/postsDummy.js';

const CATEGORY_META = [
  { id: 'ceramic', label: '도기' },
  { id: 'glaze', label: '유약' },
  { id: 'craft', label: '공예' },
  { id: 'atelier', label: '작업실' },
  { id: 'object', label: '오브제' },
];

const AUTHOR_META = [
  { name: '김다현', role: '에디터', badge: '김' },
  { name: '박수진', role: '작가', badge: '박' },
  { name: '이서윤', role: '큐레이터', badge: '이' },
  { name: '최수유', role: '에디터', badge: '최' },
  { name: '정해인', role: '작가', badge: '정' },
];

const COMMENT_PRESETS = [
  {
    name: '박수진',
    time: '3일 전',
    body:
      '공방 안의 공기와 작업 리듬이 자연스럽게 떠오르는 글이었어요. 천천히 만든 물건이 주는 감각이 잘 전해집니다.',
    badge: '박',
  },
  {
    name: '이서윤',
    time: '5일 전',
    body:
      '결과보다 만들어지는 과정을 바라보는 시선이 좋아요. 도자기를 다시 보게 만드는 글이네요.',
    badge: '이',
  },
  {
    name: '최수유',
    time: '1주 전',
    body:
      '마지막 문장이 특히 좋았어요. 쓰임이 있는 물건이 생활 속에서 어떻게 기억이 되는지 잘 느껴졌습니다.',
    badge: '최',
  },
];

function formatDate(dateString) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

function buildTags(post, categoryLabel) {
  return [categoryLabel, '도예', '핸드메이드', '라이프스타일', post.id]
    .filter(Boolean)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .slice(0, 5);
}

function buildParagraphs(post) {
  const summary =
    post.summary || '도자기는 손의 흔적과 시간이 만든 감각을 담아내는 매체입니다.';
  const content =
    post.content ||
    '매끈한 완성만으로는 설명되지 않는 온도와 결이 생활 가까이에서 천천히 스며듭니다.';

  return [
    summary,
    content,
    '하나의 손으로 만든 물건은 쓰는 사람의 하루와 감정까지도 조금씩 바꿔 놓습니다. 반복과 건조, 소성과 기다림이 이어지는 과정은 물건의 표면을 넘어 사용자의 기억에도 남게 됩니다.',
    '좋은 도자기를 좋아하게 되는 건 단순한 취향만은 아닙니다. 감각이 회복되는 경험에 가깝습니다. 매번 조금씩 다른 표정을 발견하는 시간, 물건과 취향 사이의 대화가 이어집니다.',
  ];
}

function buildComments(post) {
  return COMMENT_PRESETS.map((comment, index) => ({
    ...comment,
    id: `${post.id}-comment-${index + 1}`,
  }));
}

export default function BlogPostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/blog') ? '/blog' : '/community';

  const [commentDraft, setCommentDraft] = useState('');
  const [liked, setLiked] = useState(false);

  const post = id ? getPostById(id) : null;

  const postIndex = useMemo(
    () => DUMMY_POSTS.findIndex((item) => item.id === id),
    [id]
  );

  const author = AUTHOR_META[((postIndex >= 0 ? postIndex : 0) % AUTHOR_META.length)];
  const category = CATEGORY_META[((postIndex >= 0 ? postIndex : 0) % CATEGORY_META.length)];

  const paragraphs = useMemo(() => (post ? buildParagraphs(post) : []), [post]);
  const initialComments = useMemo(() => (post ? buildComments(post) : []), [post]);
  const [comments, setComments] = useState(initialComments);
  const tags = useMemo(
    () => (post ? buildTags(post, category.label) : []),
    [category.label, post]
  );

  const previousPost = postIndex > 0 ? DUMMY_POSTS[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < DUMMY_POSTS.length - 1
      ? DUMMY_POSTS[postIndex + 1]
      : null;

  useEffect(() => {
    setComments(initialComments);
    setCommentDraft('');
    setLiked(false);
  }, [initialComments]);

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.summary,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = () => {
    const trimmedDraft = commentDraft.trim();
    if (!trimmedDraft || !post) return;

    const newComment = {
      id: `${post.id}-comment-user-${Date.now()}`,
      name: '나',
      time: '방금 전',
      body: trimmedDraft,
      badge: '나',
    };

    setComments((currentComments) => [newComment, ...currentComments]);
    setCommentDraft('');
  };

  const handleCommentDelete = (commentId) => {
    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== commentId)
    );
  };

  if (!post) {
    return (
      <section className="blog-post-detail blog-post-detail--not-found">
        <p className="blog-post-detail__empty-copy">게시글을 찾을 수 없습니다.</p>
        <Link to={basePath} className="blog-post-detail__ghost-btn">
          블로그 목록
        </Link>
      </section>
    );
  }

  return (
    <article className="blog-post-detail">
      <header className="blog-post-detail__header">
        <div className="blog-post-detail__header-top">
          <Link to={basePath} className="blog-post-detail__ghost-btn">
            블로그 목록
          </Link>
          <button
            type="button"
            className="blog-post-detail__ghost-btn blog-post-detail__ghost-btn--small"
            onClick={handleShare}
          >
            공유
          </button>
        </div>

        <h1 className="blog-post-detail__title">{post.title}</h1>

        <div className="blog-post-detail__author-row">
          <div className="blog-post-detail__author">
            <span className="blog-post-detail__avatar">{author.badge}</span>
            <div>
              <strong className="blog-post-detail__author-name">{author.name}</strong>
              <span className="blog-post-detail__author-role">{author.role}</span>
            </div>
          </div>

          <div className="blog-post-detail__meta">
            <span>{formatDate(post.createdAt)}</span>
            <span>조회 {Number(post.views).toLocaleString()}</span>
          </div>
        </div>
      </header>

      <section className="blog-post-detail__body">
        <figure className="blog-post-detail__hero">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="blog-post-detail__hero-image"
            />
          ) : (
            <div className="blog-post-detail__image-placeholder">대표 이미지</div>
          )}
          <figcaption className="blog-post-detail__caption">
            장인의 손끝에서 탄생한 도자기 컬렉션, {new Date(post.createdAt).getFullYear()}
          </figcaption>
        </figure>

        <div className="blog-post-detail__prose">
          <p>{paragraphs[0]}</p>
          <p>{paragraphs[1]}</p>

          <blockquote className="blog-post-detail__quote">
            좋은 도자기는 눈보다 손이 먼저 알아봅니다.
          </blockquote>

          <p>{paragraphs[2]}</p>
          <p>{paragraphs[3]}</p>
        </div>
      </section>

      <section className="blog-post-detail__reaction">
        <button
          type="button"
          className={
            'blog-post-detail__ghost-btn' +
            (liked ? ' blog-post-detail__ghost-btn--liked' : '')
          }
          onClick={() => setLiked((value) => !value)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 26 24"
            className="blog-post-detail__button-icon"
          >
            <path
              d="M24.4961 6.90882C24.5026 3.66505 21.768 1.0293 18.3885 1.02253C15.8626 1.01747 13.6902 2.48294 12.7527 4.57875C11.8236 2.4792 9.65704 1.00505 7.12991 0.999985C3.75299 0.993222 1.00651 3.61799 1.00002 6.86176C0.98114 16.2863 12.7167 22.5494 12.7167 22.5494C12.7167 22.5494 24.4773 16.3334 24.4961 6.90882Z"
              className="blog-post-detail__button-icon-fill"
            />
            <path
              d="M24.4961 6.90882C24.5026 3.66505 21.768 1.0293 18.3885 1.02253C15.8626 1.01747 13.6902 2.48294 12.7527 4.57875C11.8236 2.4792 9.65704 1.00505 7.12991 0.999985C3.75299 0.993222 1.00651 3.61799 1.00002 6.86176C0.98114 16.2863 12.7167 22.5494 12.7167 22.5494C12.7167 22.5494 24.4773 16.3334 24.4961 6.90882Z"
              className="blog-post-detail__button-icon-stroke"
            />
          </svg>
          <span>좋아요</span>
        </button>

        <div className="blog-post-detail__tags">
          {tags.map((tag) => (
            <span key={tag} className="blog-post-detail__tag">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="blog-post-detail__comments">
        <h2 className="blog-post-detail__section-title">댓글 {comments.length}</h2>

        <div className="blog-post-detail__comment-form">
          <span className="blog-post-detail__avatar blog-post-detail__avatar--accent">
            나
          </span>
          <div className="blog-post-detail__comment-input-wrap">
            <textarea
              className="blog-post-detail__comment-input"
              placeholder="댓글을 남겨보세요..."
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              rows={4}
            />
            <div className="blog-post-detail__comment-actions">
              <button
                type="button"
                className="blog-post-detail__ghost-btn"
                onClick={handleCommentSubmit}
                disabled={!commentDraft.trim()}
              >
                등록
              </button>
            </div>
          </div>
        </div>

        <ul className="blog-post-detail__comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="blog-post-detail__comment-item">
              <div className="blog-post-detail__comment-top">
                <div className="blog-post-detail__comment-head">
                  <span className="blog-post-detail__avatar">{comment.badge}</span>
                  <div className="blog-post-detail__comment-meta">
                    <strong>{comment.name}</strong>
                    <span>{comment.time}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="blog-post-detail__comment-delete"
                  onClick={() => handleCommentDelete(comment.id)}
                >
                  삭제
                </button>
              </div>
              <p className="blog-post-detail__comment-body">{comment.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <nav className="blog-post-detail__pager" aria-label="이전 다음 글">
        <div className="blog-post-detail__pager-card-wrap">
          {previousPost ? (
            <Link
              to={`${basePath}/${previousPost.id}`}
              className="blog-post-detail__pager-card"
            >
              <span className="blog-post-detail__pager-label">이전 글</span>
              <strong>{previousPost.title}</strong>
            </Link>
          ) : (
            <div className="blog-post-detail__pager-card blog-post-detail__pager-card--disabled">
              <span className="blog-post-detail__pager-label">이전 글</span>
              <strong>첫 번째 글입니다.</strong>
            </div>
          )}
        </div>

        <div className="blog-post-detail__pager-card-wrap">
          {nextPost ? (
            <Link to={`${basePath}/${nextPost.id}`} className="blog-post-detail__pager-card">
              <span className="blog-post-detail__pager-label">다음 글</span>
              <strong>{nextPost.title}</strong>
            </Link>
          ) : (
            <div className="blog-post-detail__pager-card blog-post-detail__pager-card--disabled">
              <span className="blog-post-detail__pager-label">다음 글</span>
              <strong>마지막 글입니다.</strong>
            </div>
          )}
        </div>
      </nav>
    </article>
  );
}

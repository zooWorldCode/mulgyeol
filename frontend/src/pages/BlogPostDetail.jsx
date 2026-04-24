import { useMemo, useState } from 'react';
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
  { name: '김이현', role: '에디터', badge: '김' },
  { name: '박수진', role: '작가', badge: '박' },
  { name: '이준호', role: '큐레이터', badge: '이' },
  { name: '최유나', role: '디렉터', badge: '최' },
  { name: '정해인', role: '필자', badge: '정' },
];

const COMMENT_PRESETS = [
  {
    name: '박수진',
    time: '3일 전',
    body:
      '공산품에 채우지 못하는 결을 좋아한다는 표현에 공감했어요. 천천히 만든 물건이 주는 밀도가 분명히 있네요.',
    likes: 12,
    badge: '박',
  },
  {
    name: '이준호',
    time: '5일 전',
    body:
      '결과보다 만드는 과정이 남긴 감각을 본다는 문장이 좋았습니다. 도자기를 다시 보게 되는 글이네요.',
    likes: 8,
    badge: '이',
  },
  {
    name: '최유나',
    time: '1주 전',
    body:
      '감각을 되찾는 일이라는 마지막 문장이 오래 남아요. 느린 제작 리듬을 디자인 언어로 잘 풀어냈네요.',
    likes: 5,
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

function estimateReadMinutes(post) {
  const text = `${post.summary || ''} ${post.content || ''}`.trim();
  const minutes = Math.max(4, Math.ceil(text.length / 140));
  return `${minutes}분`;
}

function buildTags(post, categoryLabel) {
  return [categoryLabel, '도예', '핸드메이드', '라이프스타일', post.id]
    .filter(Boolean)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .slice(0, 5);
}

function buildParagraphs(post) {
  const summary = post.summary || '도자기는 손의 흔적과 시간이 만든 감각을 담아내는 매체입니다.';
  const content =
    post.content ||
    '매끈한 완성도만으로는 설명할 수 없는 온도와 결이 생활 속에서 천천히 쌓이기 때문입니다.';

  return [
    summary,
    content,
    '또 하나는 손으로 만든 물건이 주는 느린 리듬입니다. 반복과 건조, 소성과 기다림이 이어지는 과정은 물건의 표면을 넘어 사용자의 감정까지 바꾸어 놓습니다.',
    '결국 좋은 도자기를 좋아하게 된다는 건 단순히 소유가 아니라 감각을 회복하는 경험에 가깝습니다. 매끈함 너머의 작은 차이를 알아보는 순간, 물건은 취향을 넘어 기억이 됩니다.',
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
  const comments = useMemo(() => (post ? buildComments(post) : []), [post]);
  const tags = useMemo(
    () => (post ? buildTags(post, category.label) : []),
    [category.label, post]
  );
  const readTime = post ? estimateReadMinutes(post) : '0분';
  const previousPost = postIndex > 0 ? DUMMY_POSTS[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < DUMMY_POSTS.length - 1
      ? DUMMY_POSTS[postIndex + 1]
      : null;

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
            ← 블로그 목록
          </Link>
          <button
            type="button"
            className="blog-post-detail__ghost-btn blog-post-detail__ghost-btn--small"
            onClick={handleShare}
          >
            공유
          </button>
        </div>

        <span className="blog-post-detail__badge">{category.label}</span>

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
            <span>{readTime}</span>
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
            좋은 도자기는 눈보다 손이 먼저 알아챈다.
          </blockquote>

          <p>{paragraphs[2]}</p>

          <div className="blog-post-detail__inline-image">본문 이미지 자리</div>

          <p>{paragraphs[3]}</p>
        </div>
      </section>

      <section className="blog-post-detail__reaction">
        <button
          type="button"
          className="blog-post-detail__ghost-btn"
          onClick={() => setLiked((value) => !value)}
        >
          {liked ? '♥ 좋아요' : '♡ 좋아요'}
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
              <button type="button" className="blog-post-detail__ghost-btn">
                등록
              </button>
            </div>
          </div>
        </div>

        <ul className="blog-post-detail__comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="blog-post-detail__comment-item">
              <div className="blog-post-detail__comment-head">
                <span className="blog-post-detail__avatar">{comment.badge}</span>
                <div className="blog-post-detail__comment-meta">
                  <strong>{comment.name}</strong>
                  <span>{comment.time}</span>
                </div>
              </div>
              <p className="blog-post-detail__comment-body">{comment.body}</p>
              <div className="blog-post-detail__comment-buttons">
                <button type="button" className="blog-post-detail__ghost-btn">
                  ♡ {comment.likes}
                </button>
                <button type="button" className="blog-post-detail__ghost-btn">
                  답글
                </button>
              </div>
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
              <span className="blog-post-detail__pager-label">← 이전 글</span>
              <strong>{previousPost.title}</strong>
            </Link>
          ) : (
            <div className="blog-post-detail__pager-card blog-post-detail__pager-card--disabled">
              <span className="blog-post-detail__pager-label">← 이전 글</span>
              <strong>첫 번째 글입니다</strong>
            </div>
          )}
        </div>

        <div className="blog-post-detail__pager-card-wrap">
          {nextPost ? (
            <Link
              to={`${basePath}/${nextPost.id}`}
              className="blog-post-detail__pager-card"
            >
              <span className="blog-post-detail__pager-label">다음 글 →</span>
              <strong>{nextPost.title}</strong>
            </Link>
          ) : (
            <div className="blog-post-detail__pager-card blog-post-detail__pager-card--disabled">
              <span className="blog-post-detail__pager-label">다음 글 →</span>
              <strong>마지막 글입니다</strong>
            </div>
          )}
        </div>
      </nav>
    </article>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard.jsx';
import BlogFeaturedCard from '../components/blog/BlogFeaturedCard.jsx';
import BlogSearchBar from '../components/blog/BlogSearchBar.jsx';
import BlogSortMenu from '../components/blog/BlogSortMenu.jsx';
import Pagination from '../components/blog/Pagination.jsx';
import { DUMMY_POSTS } from '../data/postsDummy.js';

const PAGE_SIZE = 8;

function filterBySearch(posts, q) {
  const t = q.trim().toLowerCase();
  if (!t) return posts;
  return posts.filter(
    (p) =>
      (p.title && p.title.toLowerCase().includes(t)) ||
      (p.summary && p.summary.toLowerCase().includes(t))
  );
}

function sortPosts(posts, sortId) {
  const arr = [...posts];
  if (sortId === 'popular') {
    return arr.sort((a, b) => b.views - a.views || b.likes - a.likes);
  }
  if (sortId === 'latest') {
    return arr.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return arr;
}

function pickFeatured(sorted) {
  const flagged = sorted.filter((p) => p.isFeatured);
  if (flagged.length) {
    return [...flagged].sort((a, b) => b.views - a.views)[0];
  }
  return sorted[0] || null;
}

export default function BlogPage() {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/blog') ? '/blog' : '/community';

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('all');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const filtered = filterBySearch(DUMMY_POSTS, search);
    return sortPosts(filtered, sort);
  }, [search, sort]);

  const featured = useMemo(() => pickFeatured(sorted), [sorted]);

  const rest = useMemo(() => {
    if (!featured) return sorted;
    return sorted.filter((p) => p.id !== featured.id);
  }, [sorted, featured]);

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return rest.slice(start, start + PAGE_SIZE);
  }, [rest, effectivePage]);

  return (
    <div className="blog-page">
      <h1 className="blog-page__title" style={{ marginTop: 0 }}>
        블로그 in 도예
      </h1>

      <div
        className="blog-page__toolbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <BlogSearchBar value={search} onChange={setSearch} />
        <BlogSortMenu active={sort} onChange={setSort} />
      </div>

      {sorted.length === 0 ? (
        <p className="blog-page__empty">검색 결과가 없습니다.</p>
      ) : (
        <>
          {featured ? (
            <section className="blog-page__featured" style={{ marginBottom: 32 }}>
              <BlogFeaturedCard post={featured} basePath={basePath} />
            </section>
          ) : null}

          <section className="blog-page__list">
            {rest.length === 0 ? (
              <p className="blog-page__empty-list">일반 목록에 표시할 글이 없습니다.</p>
            ) : (
              <>
                <div
                  className="blog-page__grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 16,
                  }}
                >
                  {pageItems.map((post) => (
                    <BlogCard key={post.id} post={post} basePath={basePath} />
                  ))}
                </div>
                <Pagination
                  page={effectivePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

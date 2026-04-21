import { useEffect, useMemo, useState } from 'react';
import EventCard from '../components/event/EventCard.jsx';
import PaginationBar from '../components/common/PaginationBar.jsx';
import SortBar, { EVENT_STATUS_OPTIONS } from '../components/common/SortBar.jsx';
import { DUMMY_EVENTS } from '../data/eventsDummy.js';

const PAGE_SIZE = 6;

export default function Event() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return DUMMY_EVENTS;
    return DUMMY_EVENTS.filter((e) => e.status === statusFilter);
  }, [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, effectivePage]);

  return (
    <div className="event-page">
      <section
        className="event-page__hero"
        style={{
          background: 'var(--color-key)',
          padding: '48px 0',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <h1 className="event-page__hero-title" style={{ margin: '0 0 12px' }}>
          물결의 특별한 순간들
        </h1>
        <p
          className="event-page__hero-desc"
          style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text)' }}
        >
          진행중인 이벤트부터 곧 찾아올 소식까지,
          <br />
          물결의 모든 이벤트를 한눈에 확인하세요.
        </p>
      </section>

      <SortBar
        options={EVENT_STATUS_OPTIONS}
        value={statusFilter}
        onChange={setStatusFilter}
        ariaLabel="이벤트 상태"
      />

      <section className="event-page__list" style={{ marginTop: 24 }}>
        {filtered.length === 0 ? (
          <p className="event-page__empty">해당 조건의 이벤트가 없습니다.</p>
        ) : (
          <>
            <div
              className="event-page__grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 16,
              }}
            >
              {pageItems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <PaginationBar
              page={effectivePage}
              totalPages={totalPages}
              onPageChange={setPage}
              ariaLabel="이벤트 페이지"
            />
          </>
        )}
      </section>
    </div>
  );
}

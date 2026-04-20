import { Link, useParams } from 'react-router-dom';
import { getEventById } from '../data/eventsDummy.js';

export default function EventDetail() {
  const { id } = useParams();
  const event = id ? getEventById(id) : null;

  if (!event) {
    return (
      <div className="event-detail event-detail--not-found">
        <p>이벤트를 찾을 수 없습니다.</p>
        <Link to="/event">이벤트 목록</Link>
      </div>
    );
  }

  const period = `${event.startDate} ~ ${event.endDate}`;

  return (
    <div className="event-detail">
      <p className="event-detail__breadcrumb">
        <Link to="/event">← 이벤트 목록</Link>
      </p>
      <h1 className="event-detail__title">{event.title}</h1>
      <p className="event-detail__period">{period}</p>
      <p className="event-detail__status">상태: {event.status}</p>
      <div
        className="event-detail__hero-thumb"
        style={{ maxWidth: 480, marginTop: 16 }}
      >
        {event.image ? (
          <img src={event.image} alt="" style={{ width: '100%' }} />
        ) : (
          <div
            className="event-detail__no-image"
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
      <p
        className="event-detail__placeholder"
        style={{ marginTop: 24, color: 'var(--shadow-deep)' }}
      >
        상세 내용 영역은 추후 연결 예정입니다.
      </p>
    </div>
  );
}

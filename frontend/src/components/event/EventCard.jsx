import { Link } from 'react-router-dom';

/**
 * @param {{ event: { id: string; title: string; image: string; startDate: string; endDate: string; status: string } }} props
 */
export default function EventCard({ event }) {
  const period = `${event.startDate} ~ ${event.endDate}`;

  return (
    <Link
      to={`/event/${event.id}`}
      className="event-card"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid var(--shadow-bright)',
        display: 'block',
        overflow: 'hidden',
      }}
    >
      <div
        className="event-card__thumb"
        style={{
          aspectRatio: '16 / 10',
          background: 'var(--shadow-bright)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {event.image ? (
          <img
            src={event.image}
            alt=""
            className="event-card__image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            className="event-card__no-image"
            style={{ color: 'var(--shadow-deep)' }}
          >
            No Image
          </span>
        )}
      </div>
      <div className="event-card__body" style={{ padding: 12 }}>
        <h3 className="event-card__title" style={{ margin: '0 0 8px' }}>
          {event.title}
        </h3>
        <p
          className="event-card__period"
          style={{ margin: 0, color: 'var(--shadow-deep)' }}
        >
          {period}
        </p>
      </div>
    </Link>
  );
}

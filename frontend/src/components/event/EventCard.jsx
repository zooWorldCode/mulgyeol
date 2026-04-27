import './EventCard.css';

/**
 * @param {{ event: { id: string; title: string; image: string; startDate: string; endDate: string; status: string; statusLabel?: string } }} props
 */
export default function EventCard({ event }) {
  const period = `${event.startDate} ~ ${event.endDate}`;
  const isEnded = event.status === 'ended';
  const statusLabel = event.statusLabel || event.status;

  return (
    <button type="button" className="event-card">
      <div className="event-card__thumb">
        {event.image ? (
          <img src={event.image} alt="" className="event-card__image" />
        ) : (
          <span className="event-card__no-image">No Image</span>
        )}
        {isEnded ? <span className="event-card__overlay" aria-hidden="true" /> : null}
      </div>
      <div className="event-card__body">
        <span className={`event-card__badge event-card__badge--${event.status}`}>
          {statusLabel}
        </span>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__period">{period}</p>
      </div>
    </button>
  );
}

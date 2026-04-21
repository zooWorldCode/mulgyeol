import './PageWideBand.css';

export default function PageWideBand({ text = '' }) {
  return (
    <div className="page-wide-band">
      <p className="page-wide-band__text">{text}</p>
    </div>
  );
}

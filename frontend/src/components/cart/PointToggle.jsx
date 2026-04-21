import './PointToggle.css';

/**
 * @param {{
 *   balance: number;
 *   enabled: boolean;
 *   onChange: (enabled: boolean) => void;
 * }} props
 */
export default function PointToggle({ balance, enabled, onChange }) {
  return (
    <div className="point-toggle">
      <div className="point-toggle__copy">
        <h3 className="point-toggle__title">포인트 사용</h3>
        <p className="point-toggle__balance">
          보유 포인트 {Number(balance).toLocaleString('ko-KR')} P
        </p>
      </div>
      <label className="point-toggle__switch">
        <input
          type="checkbox"
          className="point-toggle__input"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          role="switch"
          aria-checked={enabled}
          aria-label="포인트 사용"
        />
        <span className="point-toggle__track" aria-hidden />
      </label>
    </div>
  );
}

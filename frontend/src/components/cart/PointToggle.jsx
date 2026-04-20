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
      <h3 className="point-toggle__title">포인트 사용</h3>
      <div className="point-toggle__row">
        <label className="point-toggle__label">
          <input
            type="checkbox"
            className="point-toggle__checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            role="switch"
            aria-checked={enabled}
          />
          <span className="point-toggle__switch-text">
            포인트로 결제 금액에서 차감
          </span>
        </label>
      </div>
      <p className="point-toggle__balance">
        보유 포인트 {Number(balance).toLocaleString()}P
      </p>
    </div>
  );
}

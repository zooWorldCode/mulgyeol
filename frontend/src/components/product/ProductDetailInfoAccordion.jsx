import { useState } from 'react';
import './ProductDetailInfoAccordion.css';

const sections = [
  {
    id: 'shipping',
    title: '배송 안내',
    rows: [
      { label: '배송비', value: '3,000원 (30,000원 이상 무료배송)' },
      { label: '택배사', value: 'CJ대한통운' },
      { label: '출고 기준', value: '오후 2시 이전 결제 시 당일 출고' },
      { label: '배송 기간', value: '출고 후 1~3일 (평균 2일 소요)' },
      { label: '도서산간', value: '추가 배송비 3,000원 부과' },
      { label: '포장', value: '파손 방지 에어캡 이중 포장 제공' },
    ],
  },
  {
    id: 'damage',
    title: '파손 접수 안내',
    rows: [
      { label: '신고 기한', value: '수령 후 48시간 이내' },
      { label: '신고 방법', value: '파손 사진 첨부 후 고객센터 접수' },
      { label: '처리', value: '확인 후 무상 교환 또는 환불 처리' },
    ],
  },
  {
    id: 'return',
    title: '교환·반품 안내',
    rows: [
      { label: '신청 기간', value: '수령 후 7일 이내' },
      { label: '단순 변심', value: '왕복 배송비 6000원 본인 부담' },
      { label: '불량·오배송', value: '판매자 부담(무료 반품)' },
      { label: '처리기간', value: '반품 접수 후 3~5일 영업일 이내' },
      { label: '교환·반품 불가 조건', value: '사용 / 세척 / 포장 훼손 / 기한 초과' },
    ],
  },
  {
    id: 'usage',
    title: '제품 사용 안내',
    custom: true,
    items: [
      { text: '전자레인지 가능', ok: true },
      { text: '식기세척기 가능', ok: true },
      { text: '오븐 사용 불가', ok: false },
      { text: '직화 사용 불가', ok: false },
    ],
    notes: [
      '수제품 특성상 색상 형태에 미세한 차이가 있을 수 있습니다.',
      '모니터 환경에 따라 실제 색상과 다소 다르게 보일 수 있습니다.',
    ],
  },
  {
    id: 'cs',
    title: '고객센터',
    rows: [
      { label: '전화', value: '02-1234-5678' },
      { label: '운영시간', value: '평일 09:00 ~18:00 (주말·공휴일 휴무)' },
      { label: '카카오톡', value: '물결 채널 문의' },
    ],
  },
];

export default function ProductDetailInfoAccordion() {
  const [open, setOpen] = useState(() => sections.map(() => true));

  const toggle = (i) =>
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="pdi-acc">
      {sections.map((sec, i) => (
        <div key={sec.id} className="pdi-acc__card">
          <button
            type="button"
            className="pdi-acc__header"
            onClick={() => toggle(i)}
            aria-expanded={open[i]}
          >
            <span className="pdi-acc__title">{sec.title}</span>
            <span
              className={
                'pdi-acc__chevron' + (open[i] ? ' pdi-acc__chevron--open' : '')
              }
              aria-hidden
            >
              ▾
            </span>
          </button>

          <div
            className={
              'pdi-acc__body ' +
              (open[i] ? 'pdi-acc__body--open' : 'pdi-acc__body--closed')
            }
          >
            {sec.custom ? (
              <div className="pdi-acc__usage">
                <div className="pdi-acc__badge-row">
                  {sec.items.map((item, j) => (
                    <span
                      key={j}
                      className={
                        'pdi-acc__badge ' +
                        (item.ok ? 'pdi-acc__badge--ok' : 'pdi-acc__badge--no')
                      }
                    >
                      <span className="pdi-acc__badge-icon">{item.ok ? '✓' : '✕'}</span>
                      {item.text}
                    </span>
                  ))}
                </div>
                <div className="pdi-acc__notes">
                  {sec.notes.map((n, j) => (
                    <p key={j} className="pdi-acc__note">
                      ※ {n}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <table className="pdi-acc__table">
                <tbody>
                  {sec.rows.map((row, j) => (
                    <tr
                      key={row.label}
                      className={j % 2 === 0 ? 'pdi-acc__row-even' : ''}
                    >
                      <td className="pdi-acc__label">{row.label}</td>
                      <td className="pdi-acc__value">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

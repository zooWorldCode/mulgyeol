import CartItem from './CartItem.jsx';
import './CartList.css';

/**
 * @param {{
 *   lines: Array<{
 *     productId: string;
 *     name: string;
 *     price: number;
 *     image: string;
 *     quantity: number;
 *     option?: string;
 *   }>;
 *   onRemove: (line: object) => void;
 *   onQuantityChange: (line: object, nextQty: number) => void;
 * }} props
 */
export default function CartList({ lines, onRemove, onQuantityChange }) {
  return (
    <div className="cart-list">
      {lines.map((line) => (
        <CartItem
          key={`${line.productId}::${line.option ?? ''}`}
          line={line}
          onRemove={() => onRemove(line)}
          onQuantityChange={(q) => onQuantityChange(line, q)}
        />
      ))}
    </div>
  );
}

import styled from 'styled-components';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import { useUser } from './User';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import CloseButton from './styles/CloseButton';
import RemoveFromCart from './RemoveFromCart';
import Checkout from './Checkout';

const CartItemStyles = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid var(--lightGrey);
    display: grid;
    grid-template-columns: auto 1fr auto;
    img {
        margin-right: 1rem;
    }
    h3,p {
        margin: 0;
    }
`;

function CartItem({cartItem}) {
    if (!cartItem.product) {
        return null;
    }
    const {product} = cartItem;

    return (
        <CartItemStyles>
            <img
                width="100"
                src={product.photo.image.publicUrlTransformed}
                alt={product.name}
            />
            <div>
                <h3>{product.name}</h3>
                <p>
                    {formatMoney(product.price * cartItem.quantity)}
                    -
                    <em>
                        {cartItem.quantity} &times; {formatMoney(product.price)} each
                    </em>
                </p>
            </div>
            <RemoveFromCart id={cartItem.id} />
        </CartItemStyles>
    );
}


export default function Cart() {
    const user = useUser();
    const {cartOpen, closeCart} = useCart();

    if (!user) return null;
    return (
        <CartStyles open={cartOpen}>
            <header>
                <Supreme>{user.name}</Supreme>
                <CloseButton onClick={closeCart} type="button">&times;</CloseButton>
            </header>
            <ul>
                {user.cart.map(cartItem => (
                    <CartItem
                        key={cartItem.id}
                        cartItem={cartItem}
                    />))
                }
            </ul>
            <footer>
                <p>{formatMoney(calcTotalPrice(user.cart))}</p>
                <Checkout />
            </footer>
        </CartStyles>
    )
}
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useRouter } from 'next/router';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY, useUser } from './User'

const ADD_TO_CART_MUTATION = gql`
    mutation ADD_TO_CART_MUTATION($id: ID!) {
        addToCart(productId: $id) {
            id
            quantity
        }
    }
`

export default function AddToCart({id}) {
    const [addToCart, {loading}] = useMutation(ADD_TO_CART_MUTATION, {
        variables: { id },
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    });
    const {openCart} = useCart();
    const user = useUser();
    const router = useRouter();

    function handleClick() {
        if (user) {
            addToCart();
            openCart();
        } else {
            router.push('/signin');
        }
    }

    return <button
        type="button"
        disabled={loading}
        onClick={handleClick}
    >Add{loading && 'ing'} to Cart 🛒</button>
}

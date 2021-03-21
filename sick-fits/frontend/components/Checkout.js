import { useMutation } from '@apollo/client';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components'
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';


const CheckoutFormStyles = styled.form`
    box-shadow: 0 1px 2px 2px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 5px;
    padding: 1rem;
    display: grid;
    grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        checkout(token: $token) {
            id
            charge
            total
            items {
                id
                name
            }
        }
    }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const [checkout, {error: GraphQLError}] = useMutation(CREATE_ORDER_MUTATION, {
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    });
    const router = useRouter();
    const { closeCart } = useCart();

    async function handleSubmit(e) {
        // 1. Stop form from submitting and turn loader on
        e.preventDefault();
        setLoading(true);
        // 2. Start page transition
        nProgress.start();
        // 3. Create paymenet method via stripe (Token comes back if success)
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        // 4. Handle any errors from stripe
        if (error) {
            setError(error);
            return;
        }
        // 5. Send token to keystone server via custom mutation
        const order = await checkout({
            variables: { token: paymentMethod.id }
        });

        // 6. Change page to view the ordrer
        router.push({
            pathname: `/order/${order.data.checkout.id}`,
        });
        // 7. Close the cart
        closeCart();
        // 8. Turn loader off
        setLoading(false);
        nProgress.done();
    }

    return (
        <CheckoutFormStyles onSubmit={handleSubmit}>
            {error && <p style={{fontSize: 12}}>{error.message}</p>}
            <CardElement />
            <SickButton>Check Out Now</SickButton>
        </CheckoutFormStyles>
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripeLib} >
            <CheckoutForm/>
        </Elements>
    );
}

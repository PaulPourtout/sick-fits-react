import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';


const RESET_MUTATION = gql`
    mutation RESET_MUTATION($email: String!, $password: String!, $token: String!) {
        redeemUserPasswordResetToken(email: $email, password: $password, token: $token) {
            code
            message
        }
    }
`;

export default function Reset({token}) {
    const {inputs, handleChange, resetForm} = useForm({
        email: '',
        password: '',
        token
    });

    const [resetPassword, {data, loading, error}] = useMutation(RESET_MUTATION, {
        variables: inputs,
    });

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            await resetPassword(inputs);
            resetForm();
        } catch(error) {
            console.error(error);
        }
    }

    const succesfullError = data?.redeemUserPasswordResetToken?.code && data?.redeemUserPasswordResetToken;

    return (
        <Form method="POST" onSubmit={handleSubmit}>
            <h2>Reset Your Password</h2>
            <Error error={error || succesfullError} />
            <fieldset>
                { !succesfullError && <p>Success ! You can now sign in</p> }
                <label htmlFor="email">
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="john.smith@sickfits.com"
                        autoComplete="email"
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="password"
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Request Reset</button>
            </fieldset>
        </Form>
    )
}

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';


const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        sendUserPasswordResetLink(email: $email) {
            code
            message
        }
    }
`;

export default function RequestReset() {
    const {inputs, handleChange, resetForm} = useForm({
        email: '',
    });

    const [requestReset, {data, loading, error}] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs,
        // refetchQueries: [{query: CURRENT_USER_QUERY}],
    });

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            await requestReset(inputs);
            console.log({data})
            resetForm();
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <Form method="POST" onSubmit={handleSubmit}>
            <h2>Request a Password Reset</h2>
            <Error error={error} />
            <fieldset>
                { data?.sendUserPasswordResetLink === null && <p>Success ! Check your email for a link</p> }
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
                <button type="submit">Request Reset</button>
            </fieldset>
        </Form>
    )
}

import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag'
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
    query SINGLE_PRODUCT_QUERY($id: ID!) {
        Product(where: { id: $id }) {
            id
            name
            description
            price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $price: Int
    ) {
        updateProduct(
            id: $id,
            data: {
                name: $name
                description: $description
                price: $price
            }
        ) {
            id
            name
            description
            price
        }
    }
`;

export default function UpdateProduct({ id }) {
    // 1. Get existing product
    const {data, error, loading} = useQuery(SINGLE_PRODUCT_QUERY, {
        variables: {id}
    });

    // 2. Get mutation to update product
    const [updateProduct, {data: updateData, error: updateError, loading: updateLoading}] = useMutation(UPDATE_PRODUCT_MUTATION);

    // 3. Create a form to handle updates
    const {inputs, handleChange, clearForm} = useForm(data?.Product);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
         <Form onSubmit={async (e) => {
            e.preventDefault();
            try {
                const res = await updateProduct({
                    variables: {
                        id,
                        name: inputs.name,
                        price: inputs.price,
                        description: inputs.description,
                    }
                });
                console.log(res)
                // clearForm();

                // Router.push({
                //     pathname: `/product/${res.data.createProduct.id}`
                // })
            } catch(error) {
                console.log(error)
            }
        }}>
            <DisplayError error={error}/>
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        placeholder="Price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Update Product</button>
            </fieldset>

        </Form>
    )
}

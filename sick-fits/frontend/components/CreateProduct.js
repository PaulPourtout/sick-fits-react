import { useState } from 'react';
import useForm from '../lib/useForm';

export default function CreateProduct() {
    const {inputs, handleChange, resetForm, clearForm} = useForm({name: 'Paul', price: 42});

    return (
        <form>
            <label htmlFor="name">
                Name
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={inputs.name}
                    onChange={handleChange}
                />
            </label>

            <label htmlFor="price">
                Price
                <input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Price"
                    value={inputs.price}
                    onChange={handleChange}
                />
            </label>

            <button type="button" onClick={clearForm}>clear form</button>
            <button type="button" onClick={resetForm}>reset form</button>
        </form>
    )
}

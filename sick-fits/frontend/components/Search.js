import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { SearchStyles, DropDown, DropDownItem } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
    query SEARCH_PRODUCTS_QUERY($searchTerms: String!) {
        searchTerms: allProducts(
            where: {
                OR: [
                    {name_contains_i: $searchTerms}
                    {description_contains_i: $searchTerms}
                ]
            }
        ) {
            id
            name
            photo {
                image {
                    publicUrlTransformed
                }
            }
        }
    }
`;

export default function Search() {
    const router = useRouter();
    const [findItems, {loading, data, error}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
        fetchPolicy: 'no-cache',
    });

    let items = data?.searchTerms || [];
    const findItemsButChill = debounce(findItems, 350);
    resetIdCounter();

    const {
        isOpen,
        inputValue,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        getItemProps,
        highlightedIndex,
    } = useCombobox({
        items,
        onInputValueChange() {
            if (inputValue === '') {
                items = [];
            } else {
                findItemsButChill({
                    variables: {
                        searchTerms: inputValue,
                    }
                });
            }
        },
        onSelectedItemChange({ selectedItem }) {
            router.push(`/product/${selectedItem.id}`);
        },
        itemToString: item => item?.name || '',

    });

    return (
        <SearchStyles>
            <div {...getComboboxProps()} >
                <input {...getInputProps({
                    type: 'search',
                    placeholder: 'Search for an item',
                    id: 'search',
                    className: loading ? 'loading' : '',
                })} />
            </div>
            <DropDown {...getMenuProps()}>
                { isOpen && items.map((item, index) => (
                    <DropDownItem
                        key={item.id}
                        {...getItemProps({item, index})}
                        highlighted={index === highlightedIndex}
                    >
                        <img
                            src={item.photo.image.publicUrlTransformed}
                            alt={item.name}
                            width="50"
                        />
                        {item.name}
                    </DropDownItem>
                ))}
                {
                    !isOpen && inputValue.length > 0 && items.length === 0 &&
                    <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
                }
            </DropDown>
        </SearchStyles>
    );
}

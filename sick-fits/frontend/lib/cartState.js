import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CarteStateProvider({children}) {
    const [cartOpen, setCartOpen] = useState(false);

    function toggleCart() {
        setCartOpen(!cartOpen);
    }

    function closeCart() {
        setCartOpen(false);
    }

    function openCart() {
        setCartOpen(true)
    }

    return <LocalStateProvider value={{
        cartOpen,
        setCartOpen,
        toggleCart,
        closeCart,
        openCart
    }}>{children}</LocalStateProvider>
}

// Make a custom hook to access the cart
function useCart() {
    const all = useContext(LocalStateContext);
    return all;
}
export { CarteStateProvider, useCart };
import Link from 'next/link';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';
import { useUser } from './User';

export default function Product({product}) {
    const user = useUser();

    return (
        <ItemStyles>
            <img src={product?.photo?.image?.publicUrlTransformed} alt={product.name}/>
            <Title>
                <Link href={`/product/${product.id}`}>
                    {product.name}
                </Link>
            </Title>
            <PriceTag>{formatMoney(product.price)}</PriceTag>
            <p>{product.description}</p>
            <div className="buttonList">
                {user?.role?.canManageProducts && <Link href={`/update/${product.id}`}>Edit ✏️</Link>}
                <AddToCart id={product.id} />
                {/* {user?.role?.canManageProducts && <DeleteProduct id={product.id}>Delete</DeleteProduct>} */}
                <DeleteProduct id={product.id}>Delete</DeleteProduct>
            </div>
        </ItemStyles>
    )
}
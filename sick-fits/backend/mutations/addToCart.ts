/*eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import {CartItemCreateInput} from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  {productId}: {productId: string},
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log("ADDING TO CART")
  // 1. query current user
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // 2. query user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: {id: sesh.itemId},
      product: {id: productId}
    },
    resolveFields: 'id, quantity'
  });
  console.log({allCartItems})
  // 3. check current item is in the cart
  const [existingCartItem] = allCartItems;
  console.log({existingCartItem})
  if (existingCartItem) {
    console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {quantity: existingCartItem.quantity+1}
    });
  }
  // 4. if it increment by 1 else add item to cart
  return await context.lists.CartItem.createOne({
    data: {
      product: {connect: { id: productId }},
      user: {connect: { id: sesh.itemId }}
    }
  })

}
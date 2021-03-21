/*eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;
interface Arguments {
  token: string;
}

export default async function checkout(
  root: any,
  {token}: {token: string},
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure user is signed in
  const userId = context.session.itemId;

  if (!userId) {
    throw new Error('Sorry! You must be signed to create an order');
  }
  const user = await context.lists.User.findOne({
    where: {id: userId},
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          photo {
            id
            image {
              publicUrlTransformed
            }
          }
        }
      }
    `
  });

  // 2. Calculate the total price for the order
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce((tally: number, cartItem) => {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);

  // 3. create the charge with stripe lib
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });

  // 4. Convert cart items to order items
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        photo: {connect: {id: cartItem.product.photo.id}},
    };
    return orderItem;
  });

  // 5. Create Order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems},
      user: {connect: {id: userId}}
    }
  });

  // 6. Clean any old cart items
  const cartItemIds = cartItems.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });

  return order;
}
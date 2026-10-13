import { UserSafe } from "./user.interface";
import { Jewelry } from "./jewel.interface";
import { Address } from "./user.interface";

export interface DecimalMongo {
  $numberDecimal: string;
}

type OrderState = 'inCart' | 'ordered' | 'delivered';

const ORDER_STATES_MAP: Record<OrderState, { label: string; class: string }> = {
  inCart: { label: 'En el carrito', class: 'state-cart' },
  ordered: { label: 'Confirmado', class: 'state-ordered' },
  delivered: { label: 'Entregado', class: 'state-delivered' }
};

export interface Order {
  _id: string,
  orderNumber: string,
  user: UserSafe,
  state: OrderState,
  cartCreationDate: Date,
  lastUpdate: Date,
  taxableTotalPrice: DecimalMongo,
  totalPrice: DecimalMongo,
  shippingPrice: DecimalMongo,
  address: Address,
  products: Jewelry[]
}

export interface NewOrder {
  cartCreationDate: Date,
  lastUpdate: Date,
  products: string[]
}
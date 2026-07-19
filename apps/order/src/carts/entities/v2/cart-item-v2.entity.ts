import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartV2 } from "./cart-v2.entity";

@Entity("cart_items_v2")
export class CartItemV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dish_id: number;

  @Column()
  dish_name: string;

  @Column()
  dish_description: string;

  @Column()
  dish_image_url: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => CartV2, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: CartV2;
}

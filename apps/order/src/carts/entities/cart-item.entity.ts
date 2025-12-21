import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  restaurant_id: number;

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

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;
}

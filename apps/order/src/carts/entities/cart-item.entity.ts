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

  @Column({ nullable: true })
  dish_name: string;

  @Column({ nullable: true })
  dish_description: string;

  @Column({ nullable: true })
  dish_image_url: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;
}

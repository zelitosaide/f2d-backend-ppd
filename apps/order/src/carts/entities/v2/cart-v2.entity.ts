import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartItemV2 } from "./cart-item-v2.entity";
import { CartStatus } from "../../enums/cart-status.enum";
import { CartSource } from "../../enums/cart-source.enum";

@Entity("carts_v2")
export class CartV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  restaurant_id: number;

  @Column()
  restaurant_name: string;

  @Column()
  restaurant_description: string;

  @Column()
  restaurant_cover_image_url: string;

  @Column()
  restaurant_logo_url: string;

  @Column({
    type: "enum",
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({
    type: "enum",
    enum: CartSource,
    default: CartSource.NORMAL,
  })
  source: CartSource;

  @OneToMany(() => CartItemV2, (item) => item.cart, {
    cascade: true,
  })
  items: CartItemV2[];

  @Column({
    nullable: true,
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value === null ? null : parseFloat(value),
    },
  })
  subtotal: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

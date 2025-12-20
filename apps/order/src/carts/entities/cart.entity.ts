import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
  })
  items: CartItem[];

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

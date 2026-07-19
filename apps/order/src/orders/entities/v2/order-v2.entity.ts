import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderItemV2 } from "./order-item-v2.entity";
import { AddressV2 } from "./address-v2.entity";
import { PaymentV2 } from "./payment-v2.entity";
import { OrderStatus } from "@app/orders";

@Entity("orders_v2")
export class OrderV2 {
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
    enum: OrderStatus,
    default: OrderStatus.INITIATED,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => OrderItemV2, (item) => item.order, { cascade: true })
  items: OrderItemV2[];

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

  @OneToOne(() => AddressV2, { cascade: true })
  @JoinColumn()
  address: AddressV2;

  @OneToOne(() => PaymentV2, { cascade: true })
  @JoinColumn()
  payment: PaymentV2;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderV2 } from "./order-v2.entity";

@Entity("order_items_v2")
export class OrderItemV2 {
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

  @ManyToOne(() => OrderV2, (order) => order.items)
  order: OrderV2;
}

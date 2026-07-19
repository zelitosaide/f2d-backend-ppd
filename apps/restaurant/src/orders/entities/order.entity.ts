import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

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

  @Column()
  status: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: "jsonb",
  })
  items: Record<string, any>[];

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

  @Column({
    type: "jsonb",
    nullable: true,
  })
  address: Record<string, any>;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  payment: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

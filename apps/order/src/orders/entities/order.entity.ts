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
import { Item } from "./item.entity";
import { Address } from "./address.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToMany(() => Item, (item) => item.order, { cascade: true })
  items: Item[];

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
  total: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

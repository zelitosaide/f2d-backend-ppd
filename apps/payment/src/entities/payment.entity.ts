import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PaymentMethod, PaymentStatus } from "libs/common/src";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

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
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column()
  user_id: number;

  @Column()
  order_id: number;

  @Column()
  phone_number: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  mpesa_conversation_id: string;

  @Column({ nullable: true })
  mpesa_transaction_id: string;

  @Column({ nullable: true })
  mpesa_response_code: string;

  @Column({ nullable: true })
  mpesa_response_desc: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

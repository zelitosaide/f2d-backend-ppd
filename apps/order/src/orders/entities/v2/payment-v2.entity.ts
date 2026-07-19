import { PaymentMethod } from "libs/common/src";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment_v2")
export class PaymentV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: "varchar", length: 13 })
  phone_number: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("address_v2")
export class AddressV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;
}

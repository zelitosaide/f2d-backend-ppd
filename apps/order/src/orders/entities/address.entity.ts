import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  zip_code: number;

  @Column({ nullable: true })
  country: string;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;
}

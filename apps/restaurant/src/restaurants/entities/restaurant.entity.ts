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
import { Menu } from "./menu.entity";
import { Address } from "./address.entity";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cover_image_url: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone_number: string;

  @OneToMany(() => Menu, (menu) => menu.restaurant, { cascade: true })
  menus: Menu[];

  @Column({ nullable: true })
  opening_time: string;

  @Column({ nullable: true })
  closing_time: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "./menu.entity";

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: "float" })
  price: number;

  @Column({ default: true })
  is_available: boolean;

  @ManyToOne(() => Menu, (menu) => menu.dishes)
  menu: Menu;
}

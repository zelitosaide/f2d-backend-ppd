import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @Column({ nullable: true })
  opening_time: string;

  @Column({ nullable: true })
  closing_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

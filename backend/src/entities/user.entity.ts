import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { OneToMany } from 'typeorm';
// // import { Order } from './order.entity';

@Entity({ name: 'usuario', schema: 'artelas' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 12 })
  rut: string;

  @Column()
  direccion: string;

  @Column()
  password: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany('Order', (order: any) => order.user)
  orders: any[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

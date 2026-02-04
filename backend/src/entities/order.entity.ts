import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'orders', schema: 'artelas' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ default: 'PENDING' })
    status: string;

    @Column({ nullable: true })
    transactionToken: string;

    @Column('jsonb', { nullable: true })
    products: any;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    documentType: string;

    @Column({ nullable: true })
    documentNumber: string;

    @Column({ nullable: true })
    documentUrl: string;
}

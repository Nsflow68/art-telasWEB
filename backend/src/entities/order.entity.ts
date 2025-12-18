import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'orders', schema: 'artelas' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ default: 'PENDING' }) // PENDING, APPROVED, REJECTED
    status: string;

    @Column({ nullable: true })
    transactionToken: string;

    @Column('jsonb', { nullable: true })
    products: any;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    // Billing / Electronic Document fields
    @Column({ nullable: true })
    documentType: string; // 'BOLETA' | 'FACTURA'

    @Column({ nullable: true })
    documentNumber: string; // Folio number

    @Column({ nullable: true })
    documentUrl: string; // URL to the PDF
}

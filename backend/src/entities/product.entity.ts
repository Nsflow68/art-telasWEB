import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productos', schema: 'artelas' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'int' })
    precio: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ nullable: true })
    imagen: string;
}

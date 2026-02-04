import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'artelas', name: 'carousel_images' })
export class CarouselImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselImage } from '../entities/carousel-image.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CarouselService {
    constructor(
        @InjectRepository(CarouselImage)
        private carouselRepository: Repository<CarouselImage>,
    ) { }

    async findAll(): Promise<CarouselImage[]> {
        return this.carouselRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async create(file: Express.Multer.File, title?: string): Promise<CarouselImage> {
        const imageUrl = `/uploads/${file.filename}`;
        const newImage = this.carouselRepository.create({
            imageUrl,
            title,
        });
        return this.carouselRepository.save(newImage);
    }

    async remove(id: number): Promise<void> {
        const image = await this.carouselRepository.findOneBy({ id });
        if (image) {
            // Try to delete file from filesystem
            try {
                const filename = image.imageUrl.split('/uploads/')[1];
                if (filename) {
                    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (e) {
                console.error('Error deleting file:', e);
            }
            await this.carouselRepository.remove(image);
        }
    }
}

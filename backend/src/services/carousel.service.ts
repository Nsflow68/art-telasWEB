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
        if (!file) {
            throw new Error('File is required');
        }
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const newImage = this.carouselRepository.create({
            imageUrl: base64,
            title,
        });
        return this.carouselRepository.save(newImage);
    }

    async remove(id: number): Promise<void> {
        const image = await this.carouselRepository.findOneBy({ id });
        if (image) {
            await this.carouselRepository.remove(image);
        }
    }
}

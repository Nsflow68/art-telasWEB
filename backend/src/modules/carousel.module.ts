import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselController } from '../controllers/carousel.controller';
import { CarouselService } from '../services/carousel.service';
import { CarouselImage } from '../entities/carousel-image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CarouselImage])],
    controllers: [CarouselController],
    providers: [CarouselService],
})
export class CarouselModule { }

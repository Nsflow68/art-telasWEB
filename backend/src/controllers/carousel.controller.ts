import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarouselService } from '../services/carousel.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('carousel')
export class CarouselController {
    constructor(private readonly carouselService: CarouselService) { }

    @Get()
    findAll() {
        return this.carouselService.findAll();
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    create(@UploadedFile() file: Express.Multer.File, @Body('title') title: string) {
        return this.carouselService.create(file, title);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.carouselService.remove(+id);
    }
}

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
import { memoryStorage } from 'multer';
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
            storage: memoryStorage(),
        }),
    )
    create(@UploadedFile() file: Express.Multer.File, @Body('title') title: string) {
        // We will modify the service to accept the file buffer or base64 string directly
        // But the controller signature for @UploadedFile gives us the file object with buffer
        return this.carouselService.create(file, title);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.carouselService.remove(+id);
    }
}

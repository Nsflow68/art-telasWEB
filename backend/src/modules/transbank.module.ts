import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransbankController } from '../controllers/transbank.controller';
import { TransbankService } from '../services/transbank.service';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, User])],
    controllers: [TransbankController],
    providers: [TransbankService],
})
export class TransbankModule { }

import { Controller, Post, Body, Query, Res, Get } from '@nestjs/common';
import { TransbankService } from '../services/transbank.service';
import type { Response } from 'express';

@Controller('transbank')
export class TransbankController {
    constructor(private readonly transbankService: TransbankService) { }

    @Post('create')
    async create(@Body() body: { userId: number; amount: number; products: any }) {
        return this.transbankService.createTransaction(body.userId, body.amount, body.products);
    }

    @Get('commit')
    @Post('commit')
    async commit(@Query() query: any, @Body() body: any, @Res() res: Response) {
        const token = query.token_ws || body.token_ws || query.TBK_TOKEN || body.TBK_TOKEN;

        if (!token) {
            return res.redirect('http://localhost:5173/?payment_status=failure');
        }

        const result = await this.transbankService.commitTransaction(token);

        if (result.order && result.order.status === 'APPROVED') {
            return res.redirect('http://localhost:5173/?payment_status=success');
        } else {
            return res.redirect('http://localhost:5173/?payment_status=failure');
        }
    }

    @Get('transactions')
    async findAll() {
        return this.transbankService.findAll();
    }
}

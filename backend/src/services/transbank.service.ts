/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

const { WebpayPlus } = require('transbank-sdk');
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');

@Injectable()
export class TransbankService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createTransaction(userId: number, amount: number, products: any) {
        console.log(`Creating transaction for User ${userId}, Amount: ${amount}`);
        try {
            const buyOrder = 'O-' + Date.now();
            const sessionId = 'S-' + userId + '-' + Date.now();
            const returnUrl = 'http://localhost:3000/api/transbank/commit';

            const transaction = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

            const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }

            const order = new Order();
            order.total = amount;
            order.status = 'PENDING';
            order.transactionToken = response.token;
            order.user = user;
            order.products = products;

            await this.orderRepository.save(order);

            return response;
        } catch (error) {
            console.error('Error creating transaction:', error);
            return { error: error.message };
        }
    }

    async commitTransaction(token: string) {
        try {
            const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
            const response = await tx.commit(token);

            const order = await this.orderRepository.findOne({ where: { transactionToken: token } });

            if (order) {
                if (response.status === 'AUTHORIZED') {
                    order.status = 'APPROVED';
                } else {
                    order.status = 'REJECTED';
                }
                await this.orderRepository.save(order);
            }

            return {
                response,
                order
            };
        } catch (error) {
            console.error('Transbank Commit Error:', error);
            return { error: error.message };
        }
    }

    async findAll() {
        return this.orderRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
}

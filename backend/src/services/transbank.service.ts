/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

// Import Transbank sdk (using require as it might not have full TS types or to avoid import issues)
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
            // 1. Create a Buy Order ID (must be unique)
            const buyOrder = 'O-' + Date.now();
            const sessionId = 'S-' + userId + '-' + Date.now();
            const returnUrl = 'http://localhost:3000/api/transbank/commit';

            // 2. Initialize Transaction using factory method for Integration
            const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
            // Ensure we are using the correct method. Some versions might use static buildForIntegration.
            // But checking the require above, it seems we are instantiating manually. 
            // The user doc says: WebpayPlus.Transaction.buildForIntegration("commerceCode", "APIKey");
            // Let's try to follow the doc exactly if the SDK supports it.
            // If the installed SDK is older/newer it might differ. 
            // Given "transbank-sdk": "^6.1.1", let's try the factory if available, or fallback to the manual options if that's what's working for others.
            // Actually, let's look at the imports. 

            // Re-implementing based on user doc:
            const transaction = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

            // NOTE: If the user insists on `buildForIntegration`, it might be a static method. 
            // Let's stick to the instantiation we have but ensure options are correct, 
            // OR try the static method if the instance one is failing.
            // However, common 3.x+ SDKs use the `new Transaction(options)` pattern. 
            // The user's doc might be referring to a specific Java or .NET SDK style or an older/newer JS one? 
            // Actually, the JS SDK 2.x used `new`, 3.x uses `new`. 
            // Let's debug by simplifying.

            const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);

            // 3. Save Order in DB
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

            // Find order by token
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
            // Return error object so controller can see it
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

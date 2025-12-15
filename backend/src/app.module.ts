import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductsModule } from './modules/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'mirefugio.c9ie2ckqg3rt.us-east-2.rds.amazonaws.com',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'mirefugio_owner',
      password: process.env.DB_PASSWORD || 'Mirefugio2025!',
      database: process.env.DB_NAME || 'mirefugio',
      entities: [User, Product],
      // WARNING: synchronize: true should NOT be used in production - strictly for dev/prototyping as per request
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Often needed for RDS if CA not provided
      },
      // search_path in options if needed, but we handle schema 'artelas' in entity/service
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

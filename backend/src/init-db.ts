import { Client } from 'pg';

async function bootstrap() {
    const client = new Client({
        host: process.env.DB_HOST || 'mirefugio.c9ie2ckqg3rt.us-east-2.rds.amazonaws.com',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'mirefugio_owner',
        password: process.env.DB_PASSWORD || 'Mirefugio2025!',
        database: process.env.DB_NAME || 'mirefugio',
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('Connected to database');
        await client.query('CREATE SCHEMA IF NOT EXISTS "artelas"');
        console.log('Schema "artelas" created or already exists');
    } catch (err) {
        console.error('Error creating schema:', err);
    } finally {
        await client.end();
    }
}

bootstrap();

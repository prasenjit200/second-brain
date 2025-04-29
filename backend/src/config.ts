
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000');
const DB_URL: string = process.env.DB_URL || '';
const JWT_SECRET: string = process.env.JWT_SECRET || '';

export { PORT, DB_URL, JWT_SECRET };

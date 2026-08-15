import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'LinkForge API' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
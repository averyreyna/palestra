import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { codeGenerationRouter } from './routes/codeGeneration';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', codeGenerationRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
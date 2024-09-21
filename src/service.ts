import express, { Request, Response } from 'express';
import { ServiceConfig } from './types';

const app = express();
const { port, serviceName, killAfterMs, upAfterMs } = JSON.parse(process.env.SERVICE_CONFIG || '') as ServiceConfig;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send();
});

app.post('/api', (req: Request, res: Response) => {
  const requestBody = req.body;

  console.log(`${serviceName} got request at port ${port}`);

  res.status(200).json(requestBody);
});

const server = app.listen(port, () => {
  console.log(`Service ${serviceName} running on port ${port}`);
});

if (killAfterMs) {
  setTimeout(() => {
    server.close(() => {
      console.log(`Service ${serviceName} on port ${port} is down`);
    });
  }, killAfterMs)
}

if (upAfterMs) {
  setTimeout(() => {
    app.listen(port, () => {
      console.log(`Service ${serviceName} on port ${port} is up`);
    });
  }, upAfterMs)
}
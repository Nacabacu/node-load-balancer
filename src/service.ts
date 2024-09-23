import express, { Request, Response } from 'express';
import { ServiceConfig } from './types';
import chalk from 'chalk';

const app = express();
const { port, serviceName, killAtMs: killAfterMs, upAtMs: upAfterMs, delayMs, color } = JSON.parse(process.env.SERVICE_CONFIG || '') as ServiceConfig;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send();
});

app.post('/api', (req: Request, res: Response) => {
  const requestBody = req.body;

  console.log(chalk.hex(color)(`${serviceName} got request at port ${port}`));

  const response = () => {
    res.status(200).json(requestBody);
  };

  if (delayMs) {
    setTimeout(() => {
      response();
    }, delayMs)
  } else {
    response();
  }
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
import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';
import configJSON from '../config.json';
import { Config, ServiceConfig } from './types';

const config = configJSON as Config;
let healthyServiceList = [...config.serviceList];
let unHealthyServiceList: ServiceConfig[] = [];
const app = express();
const port = 3000;

const proxy = httpProxy.createProxyServer();

let currentIndex = -1;

app.post('/api', (req: Request, res: Response) => {
  forwardRequest(req, res);
});

const forwardRequest = (req: Request, res: Response) => {
  if (!healthyServiceList) {
    res
    .status(500)
    .json({ message: 'There is no healthy server' });
  }

  currentIndex = (currentIndex + 1) % healthyServiceList.length;
  const currentService = healthyServiceList[currentIndex];
  const targetUrl = `http://${currentService.host}:${currentService.port}`;

  proxy.web(req, res, { target: targetUrl }, (err) => {
    unHealthyServiceList.push(currentService);
    healthyServiceList = healthyServiceList.filter(service => service.serviceName !== currentService.serviceName);
    forwardRequest(req, res)
  });
}

const checkServiceHealth = async () => {
  unHealthyServiceList.forEach(async (serverConfig) => {
    const { host, port, serviceName } = serverConfig;
    try {
      const result = await fetch(`http://${host}:${port}/health`);
      if (result.ok) {
        console.log(`Service ${serviceName} is up`);
        healthyServiceList.push(serverConfig);
        unHealthyServiceList = unHealthyServiceList.filter(service => service.serviceName !== serverConfig.serviceName);
      }
    } catch (err) {
      console.error(`Service ${serviceName} is still down`);
    }
  });
}

setInterval(checkServiceHealth, 10000);

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});
import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';
import { Service } from './types';
import { roundRobin } from './algorithm/roundRobin';
import { leastConnection } from './algorithm/leastConnection';
import { leastTime } from './algorithm/leastTime';
import { config } from './config';

export let healthyServiceList = [...config.serviceList.map<Service>(service => {
  return {
    url: `http://${service.host}:${service.port}`,
    connection: 0,
    time: 0
  };
})];
export let unhealthyServiceList: Service[] = [];

export const proxy = httpProxy.createProxyServer();
const app = express();
const port = 3000;

app.post('/api', (req: Request, res: Response) => {
  switch (config.algorithm) {
    case 'RoundRobin':
      roundRobin(req, res);
      break;
    case 'LeastConnection':
      leastConnection(req, res);
      break;
    case 'LeastTime':
      leastTime(req, res);
      break;
    default:
      res.status(500).send('algorithm not supported');
  }
});

const checkServiceHealth = async () => {
  unhealthyServiceList.forEach(async (service) => {
    try {
      const result = await fetch(`${service.url}/health`);
      if (result.ok) {
        console.log(`Service at url ${service.url} is up`);
        healthyServiceList.push(service);
        unhealthyServiceList = unhealthyServiceList.filter(s => s.url !== service.url);
      }
    } catch (err) {
      console.error(`Service at url ${service.url} is still down`);
    }
  });
}

setInterval(checkServiceHealth, 10000);

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});

export const setHealthyServiceList = (serviceList: Service[]) => {
  healthyServiceList = serviceList;
}
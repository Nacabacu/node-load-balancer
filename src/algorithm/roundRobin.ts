import { Request, Response } from 'express';
import { healthyServiceList, proxy, setHealthyServiceList, unhealthyServiceList } from '../app';

let currentIndex = -1;

export const roundRobin = (req: Request, res: Response) => {
  if (!healthyServiceList) {
    res
    .status(500)
    .json({ message: 'There is no healthy server' });
  }

  currentIndex = (currentIndex + 1) % healthyServiceList.length;
  const service = healthyServiceList[currentIndex];

  proxy.web(req, res, { target: service.url }, (err) => {
    unhealthyServiceList.push(service);
    setHealthyServiceList(healthyServiceList.filter(s => s.url !== service.url));
    roundRobin(req, res);
  });
}
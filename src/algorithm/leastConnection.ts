import { Request, Response } from 'express';
import { healthyServiceList, proxy, setHealthyServiceList, unhealthyServiceList } from '../app';

export const leastConnection = (req: Request, res: Response) => {
  if (!healthyServiceList) {
    res
    .status(500)
    .json({ message: 'There is no healthy server' });
  }

  const service = healthyServiceList.sort((a, b) => a.connection - b.connection)[0];
  service.connection++;

  proxy.web(req, res, { target: service.url }, (err) => {
    unhealthyServiceList.push(service);
    setHealthyServiceList(healthyServiceList.filter(s => s.url !== service.url));
    leastConnection(req, res);
  });

  res.on('finish', () => {
    service.connection--;
  });
}
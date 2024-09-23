import { Request, Response } from 'express';
import { healthyServiceList, proxy, setHealthyServiceList, unhealthyServiceList } from '../app';

export const leastTime = (req: Request, res: Response) => {
  if (!healthyServiceList) {
    res
    .status(500)
    .json({ message: 'There is no healthy server' });
  }

  const service = healthyServiceList.sort((a, b) => a.time - b.time)[0];
  const startTime = performance.now();

  proxy.web(req, res, { target: service.url }, (err) => {
    unhealthyServiceList.push(service);
    setHealthyServiceList(healthyServiceList.filter(s => s.url !== service.url));
    leastTime(req, res);
  });

  res.on('finish', () => {
    const responseTime = performance.now() - startTime;
    service.time = (service.time + responseTime) / 2;
  });
}
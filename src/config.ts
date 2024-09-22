import { Config } from './types';

export const config: Config = {
  algorithm: 'RoundRobin',
  serviceList: [
    {
      serviceName: 'service-1',
      host: 'localhost',
      port: 3001
    },
    {
      serviceName: 'service-2',
      host: 'localhost',
      port: 3002,
      killAtMs: 2000,
      upAtMs: 5000
    },
    {
      serviceName: 'service-3',
      host: 'localhost',
      port: 3003
    }
  ]
}
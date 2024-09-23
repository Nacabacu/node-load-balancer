import { Config } from './types';

export const config: Config = {
  algorithm: 'RoundRobin',
  serviceList: [
    {
      serviceName: 'service-1',
      host: 'localhost',
      port: 3001,
      color: '#FF0000'
    },
    {
      serviceName: 'service-2',
      host: 'localhost',
      port: 3002,
      color: '#00FF00',
      killAtMs: 4000,
      upAtMs: 7000
    },
    {
      serviceName: 'service-3',
      host: 'localhost',
      port: 3003,
      color: '#0000FF'
    }
  ]
}
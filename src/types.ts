export type Algorithm = 'RoundRobin' | 'LeastConnection' | 'LeastTime';

export interface Config {
  algorithm: Algorithm;
  serviceList: ServiceConfig[];
}

export interface ServiceConfig {
  serviceName: string;
  host: string;
  port: number;
  killAtMs?: number;
  upAtMs?: number;
  delayMs?: number;
}

export interface Service {
  url: string;
  connection: number;
  time: number;
}
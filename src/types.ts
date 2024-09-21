export interface Config {
  serviceList: ServiceConfig[]
}

export interface ServiceConfig {
  serviceName: string;
  host: string;
  port: number;
  killAfterMs?: number;
  upAfterMs?: number;
}
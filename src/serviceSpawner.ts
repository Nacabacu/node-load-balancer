import { fork } from 'child_process';
import path from 'path';
import { config } from './config';
import { fileURLToPath } from 'url';
const serviceScriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'service.ts');

config.serviceList.forEach((serviceConfig) => {
  const child = fork(serviceScriptPath, [], {
    env: {
      ...process.env,
      SERVICE_CONFIG: JSON.stringify(serviceConfig),
    },
  });

  child.on('exit', (code) => {
    console.log(`Service ${serviceConfig.serviceName} process exited with code ${code}`);
  });
});


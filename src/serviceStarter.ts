import { fork } from 'child_process';
import config from '../config.json';
import path from 'path';
const serviceScriptPath = path.join(__dirname, 'service.ts');

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


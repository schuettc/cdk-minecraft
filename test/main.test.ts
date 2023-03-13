/* eslint-disable import/no-extraneous-dependencies */
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { config } from 'dotenv';
import { Minecraft } from '../src/minecraft';

config();

const stackProps = {
  minecraftEdition: process.env.MINECRAFT_EDITION || '',
  serverSubDomain: process.env.SERVER_SUBDOMAIN || '',
  domain: process.env.DOMAIN || '',
  hostedZoneId: process.env.HOSTED_ZONE_ID || '',
  memorySize: process.env.MEMORY_SIZE || '',
  cpuSize: process.env.CPU_SIZE || '',
  snsEmail: process.env.SNS_EMAIL || '',
  startupMin: process.env.STARTUP_MIN || '',
  shutdownMin: process.env.SHUTDOWN_MIN || '',
  debug: process.env.DEBUG || 'false',
};

test('Snapshot', () => {
  const app = new App();
  const stack = new Minecraft(app, 'test', {
    ...stackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

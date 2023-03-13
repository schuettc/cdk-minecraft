/* eslint-disable import/no-extraneous-dependencies */
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { config } from 'dotenv';
import { Minecraft } from '../src/minecraft';

config({ path: '../.sample.env' });

const javaStackProps = {
  minecraftEdition: 'java',
  serverSubDomain: 'minecraft',
  domain: 'example.com',
  hostedZoneId: 'Z00000000000000000000',
  memorySize: '8192',
  cpuSize: '4096',
  snsEmail: 'admin@example.com',
  startupMin: '10',
  shutdownMin: '20',
  debug: 'false',
};

test('Snapshot', () => {
  const app = new App();
  const stack = new Minecraft(app, 'test-java', {
    ...javaStackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

const bedrockStackProps = {
  minecraftEdition: 'bedrock',
  serverSubDomain: 'minecraft',
  domain: 'example.com',
  hostedZoneId: 'Z00000000000000000000',
  memorySize: '8192',
  cpuSize: '4096',
  snsEmail: 'admin@example.com',
  startupMin: '10',
  shutdownMin: '20',
  debug: 'false',
};
test('Snapshot', () => {
  const app = new App();
  const stack = new Minecraft(app, 'test-bedrock', {
    ...bedrockStackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

const noSNSStackProps = {
  minecraftEdition: 'java',
  serverSubDomain: 'minecraft',
  domain: 'example.com',
  hostedZoneId: 'Z00000000000000000000',
  memorySize: '8192',
  cpuSize: '4096',
  startupMin: '10',
  shutdownMin: '20',
  debug: 'true',
};

test('Snapshot', () => {
  const app = new App();
  const stack = new Minecraft(app, 'test-noSNS', {
    ...noSNSStackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

const bedrockDebugStackProps = {
  minecraftEdition: 'bedrock',
  serverSubDomain: 'minecraft',
  domain: 'example.com',
  hostedZoneId: 'Z00000000000000000000',
  memorySize: '8192',
  cpuSize: '4096',
  snsEmail: 'admin@example.com',
  startupMin: '10',
  shutdownMin: '20',
  debug: 'true',
};
test('Snapshot', () => {
  const app = new App();
  const stack = new Minecraft(app, 'test-bedrock', {
    ...bedrockDebugStackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

const envStackProps = {
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
  const stack = new Minecraft(app, 'envtest', {
    ...envStackProps,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

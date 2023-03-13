const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.63.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-minecraft',
  license: 'Apache-2.0',
  author: 'Court Schuett',
  authorAddress: 'https://subaud.io',
  copyrightOwner: 'Court Schuett',
  defaultReleaseBranch: 'main',
  appEntrypoint: 'minecraft.ts',
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['schuettc'],
  },
  autoApproveUpgrades: true,
  devDeps: ['esbuild'],
  deps: ['dotenv'],
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  defaultReleaseBranch: 'main',
});

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  '.DS_Store',
  '.env',
];

project.addTask('launch', {
  exec: 'yarn && yarn projen && yarn build && yarn cdk bootstrap && yarn cdk deploy',
});

project.gitignore.exclude(...common_exclude);
project.synth();

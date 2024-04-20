const { awscdk } = require('projen');
const { UpgradeDependenciesSchedule } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.134.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-minecraft',
  license: 'Apache-2.0',
  author: 'Court Schuett',
  projenrcTs: true,
  authorAddress: 'https://subaud.io',
  copyrightOwner: 'Court Schuett',
  appEntrypoint: 'minecraft.ts',
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
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

project.tsconfigDev.file.addOverride('include', [
  'src/**/*.ts',
  'site/src/**/*.tsx',
  './.projenrc.ts',
]);

project.eslint.addOverride({
  files: ['site/src/**/*.tsx', 'src/resources/**/*.ts'],
  rules: {
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
  },
});

project.eslint.addOverride({
  files: ['src/resources/**/*.ts', 'src/*.ts', 'site/src/**/*.tsx'],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
});

project.gitignore.exclude(...common_exclude);
project.synth();

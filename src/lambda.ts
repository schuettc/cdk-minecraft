import { Stack } from 'aws-cdk-lib';
import { Cluster, FargateService } from 'aws-cdk-lib/aws-ecs';
import {
  Role,
  ServicePrincipal,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { FilterPattern, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Construct } from 'constructs';

interface LambdaResourcesProps {
  queryLogGroup: LogGroup;
  cluster: Cluster;
  service: FargateService;
  serverSubDomain: string;
  domain: string;
}

export class LambdaResources extends Construct {
  constructor(scope: Construct, id: string, props: LambdaResourcesProps) {
    super(scope, id);

    const lambdaRole = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        ['ecsPolicy']: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: [
                `${props.service.serviceArn}/*`,
                props.service.serviceArn,
                `${props.cluster.clusterArn}/*`,
                props.cluster.clusterArn,
              ],
              actions: ['ecs:*'],
            }),
          ],
        }),
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });

    const launcherLambda = new Function(this, 'LauncherLambda', {
      code: Code.fromAsset('src/resources/lambda'),
      role: lambdaRole,
      handler: 'index.lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        REGION: Stack.of(this).region,
        CLUSTER: props.cluster.clusterName,
        SERVICE: props.service.serviceName,
      },
    });

    launcherLambda.addPermission('InvokeLambda', {
      principal: new ServicePrincipal(
        `logs.${Stack.of(this).region}.amazonaws.com`,
      ),
      action: 'lambda:InvokeFunction',
      sourceArn: props.queryLogGroup.logGroupArn,
      sourceAccount: Stack.of(this).account,
    });

    props.queryLogGroup.addSubscriptionFilter('SubscriptionFilter', {
      destination: new LambdaDestination(launcherLambda),
      filterPattern: FilterPattern.anyTerm(
        `${props.serverSubDomain}.${props.domain}`,
      ),
    });
  }
}

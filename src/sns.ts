import { Subscription, SubscriptionProtocol, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

interface SNSResourcesProps {
  snsEmail: string;
}

export class SNSResources extends Construct {
  public snsTopic: Topic;

  constructor(scope: Construct, id: string, props: SNSResourcesProps) {
    super(scope, id);

    this.snsTopic = new Topic(this, 'snsTopic', {});

    new Subscription(this, 'emailSubscription', {
      protocol: SubscriptionProtocol.EMAIL,
      topic: this.snsTopic,
      endpoint: props.snsEmail,
    });
  }
}

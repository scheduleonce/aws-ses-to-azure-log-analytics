# aws-ses-to-azure-log-analytics

> A lambda function that sends sns notifications about emails to azure-log-analytics

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## What is this for?

SES is capable of sending reports about email delivery (deliveries, bounces, rejects) to SNS. However, there's no built in way to pipe these reports into something like azure-log-analytics. This Lambda function bridges the gap and allows to send the reports to ES.

```
+-------+     +-------+     +--------+     +---------------------+
|  SES  +---> |  SNS  +---> | Lambda +---> | Azure Log Analytics |
+-------+     +-------+     +--------+     +---------------------+
```

## Deploying the function

Lambda requires you to include any npm dependencies your function needs with the bundle. Prepare the zip bundle:

```sh
$ npm install --production
$ zip -r lambda-bundle.zip *
```

Then upload the bundle directly to Lambda through the upload button

<img width="708" alt="" src="https://user-images.githubusercontent.com/717076/34253019-8ed0936c-e64e-11e7-82e5-a464bdf508ac.png">

## Usage

There are couple of steps that need to be done on AWS console to make this work:

1. [Create a topic](http://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) on SNS for the email deliveries.
2. Set up [notifications](https://docs.aws.amazon.com/console/ses/notifications) for you SES email address. Set these notifications to be sent to the topic you created.
3. Create a lambda function with a trigger for SNS. Set the topic on that trigger to the topic you created.
4. [Subscribe to the topic](http://docs.aws.amazon.com/sns/latest/dg/SubscribeTopic.html) and set Lambda as the destination for notifications.

The function expects several environment variables to be set:

- `WORKSPACEID` - WorkspaceID is the unique identifier for the Log Analytics workspace.
- `SHAREDKEY` - Primary Key ID of Log Analytics workspace.
- `APIVERSION` - The version of the API to use with this request. Currently, it's `2016-04-01`.
- `PREFIX` - The index name prefix. For example, if `PREFIX='aws_ses_emails'`
  > Note: Index name do not allow hyphen(-).

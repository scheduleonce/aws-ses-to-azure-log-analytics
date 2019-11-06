const request = require('superagent');
const crypto = require('crypto');
const prefix = process.env.PREFIX;
const workspaceId = process.env.WORKSPACEID;
const sharedKey = process.env.SHAREDKEY;
const apiVersion = process.env.APIVERSION;

exports.handler = function(event, context, callback) {
  const processingDate = new Date().toUTCString();
  const payload = event.Records[0].Sns;
  const index = `${prefix}`;
  const contentLength = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  const stringToSign = 'POST\n' + contentLength + '\napplication/json\nx-ms-date:' + processingDate + '\n/api/logs';
  const signature = crypto
    .createHmac('sha256', new Buffer.from(sharedKey, 'base64'))
    .update(stringToSign, 'utf-8')
    .digest('base64');
  const authorization = 'SharedKey ' + workspaceId + ':' + signature;
  const headers = {
    'content-type': 'application/json',
    Authorization: authorization,
    'Log-Type': index,
    'x-ms-date': processingDate
  };

  request
    .post(`https://${workspaceId}.ods.opinsights.azure.com/api/logs?api-version=${apiVersion}`)
    .send(payload)
    .set(headers)
    .end((err, res) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('success', res);
      }
    });
};

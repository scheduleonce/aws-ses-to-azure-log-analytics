const request = require('superagent');
const crypto = require('crypto');
const prefix = process.env.PREFIX;
const workspaceId = process.env.WORKSPACEID;
const sharedKey = process.env.SHAREDKEY;
const apiVersion = process.env.APIVERSION;

const processingDate = new Date().toUTCString();

exports.handler = async (event, context) => {
    const payload = event.Records[0].Sns;
    const index = `${prefix}`;
    const contentLength = Buffer.byteLength(JSON.stringify(payload), 'utf8');
    const stringToSign = 'POST\n' + contentLength + '\napplication/json\nx-ms-date:' + processingDate + '\n/api/logs';
    const signature = crypto.createHmac('sha256', new Buffer.from(sharedKey, 'base64')).update(stringToSign, 'utf-8').digest('base64');
    const authorization = 'SharedKey ' + workspaceId + ':' + signature;
    const headers = {
      "content-type": "application/json",
      "Authorization": authorization,
      "Log-Type": index,
      "x-ms-date": processingDate
    };

    try {
      let res = await request
        .post(`https://${workspaceId}.ods.opinsights.azure.com/api/logs?api-version=${apiVersion}`)
        .send(payload)
        .set(headers);
      console.log('response data :' + JSON.stringify(res));
      return {
        'statusCode': res.statusCode,
        'body': JSON.stringify({
          message: res,
        })
      };
    }
    catch (err) {
      console.log('error data :' + JSON.stringify(err));
      return {
        'statusCode': err.statusCode,
        'body': JSON.stringify({
          message: err,
        })
      };
    }
};

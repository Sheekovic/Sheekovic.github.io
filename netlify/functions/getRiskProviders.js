import fetch from 'node-fetch';

export const handler = async (event, context) => {
  const response = await fetch('https://notification.blackhawknetwork.com/riskService/v1/riskWidget/getRiskProviders', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://mygift.giftcardmall.com/',
          'Origin': 'https://mygift.giftcardmall.com',
          'requestid': '6293b3f1-c990-4aeb-affe-a87d2c273e9a',
          'unique-id': '6293b3f1-c990-4aeb-affe-a87d2c273e9a',
          'clientconfigid': 'VNTVQSWJQ54TV27KDCZ7CMH5HW',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'dnt': '1',
          'sec-gpc': '1',
          'te': 'trailers'
      },
      body: JSON.stringify({"clientConfigId": "VNTVQSWJQ54TV27KDCZ7CMH5HW"})
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
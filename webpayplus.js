const WebpayPlus = require('transbank-sdk').WebpayPlus; // ES5
import { WebpayPlus } from 'transbank-sdk'; // ES6

// Es necesario ejecutar dentro de una función async para utilizar await
const createResponse = await (new WebpayPlus.Transaction()).create(
  buyOrder, 
  sessionId, 
  amount, 
  returnUrl
);

module.exports = {
    WebpayPlus,
    createResponse
}
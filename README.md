[![npm][npm]][npm-url]

# gmail-api-parse-message typescript
## forked from https://github.com/EmilTholin/gmail-api-parse-message v2.1
Parses Gmail API's GET message method, and returns a IGmail object

 

## Run Test
tsc && node dist/test/runtests.js 

## Example usage

```ts
var rp = require('request-promise');
var parseMessage = require('gmail-api-parse-message');

rp({
  uri: 'https://www.googleapis.com/gmail/v1/users/me/messages/{MESSAGE_ID}?access_token={ACCESS_TOKEN}',
  json: true
}).then(function (response) {
  var parsedMessage = parseMessage(response);
  console.log(parsedMessage);
  / 
});

```

## API


```js
/**
 * Takes a response from the Gmail API's GET message method and extracts all the relevant data.
 * @param  {object} response - The response from the Gmail API parsed to a JavaScript object.
 * @return {object} result
 */
 parseMessage(response);
```

## Licence
MIT

[npm]: https://img.shields.io/npm/v/gmail-api-parse-message.svg
[npm-url]: https://npmjs.com/package/gmail-api-parse-message

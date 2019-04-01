const express = require('express');
const app = express();
const bodyParser = require('body-parser');
  app.get('/', function (req, res) {
    const reply = {
    "status": "ok"
  };
  res.json(reply);
});
const request = require('request');

app.use(bodyParser.json());

const listener = app.listen(process.env.PORT || '3000', function () {
  console.log('Your app is listening on port ' + listener.address().port);
})

app.post('/action-endpoint', function (req, res) {
  const challenge = req.body.challenge;
  const reply = {
    "challenge": challenge
};

  const headers = {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${process.env.TOKEN}`
  }

  if (req.body.event.subtype != 'bot_message') {
    request.get('https://api.coindesk.com/v1/bpi/currentprice/EUR.json', function(err, res, body){
    if  (err) {
        console.log(err);
      }
      else {
        const coindesk = JSON.parse(body);
        const rate = coindesk.bpi.EUR.rate;
        const reply = {
          'channel': req.body.event.channel,
          text: `Current BTC rate: ${rate} EUR per 1 BTC`
        }

        const options = {
          url: 'https://slack.com/api/chat.postMessage',
          method: 'POST',
          headers,
          body: JSON.stringify(reply)
        };

        console.log(body);

        request.post(options, function(err, res, body) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }
    if (req.body.event.channel!= 'bot_message') {
      const body = {
        'channel': req.body.event.channel,
        'text': req.body.event.text
      }
    }

    const options = {
      url: 'https://slack.com/api/chat.postMessage',
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    };

    request.post(options, function(err, res, body) {
      if (err) {
        console.log(err);
      }
    })
  }
res.json(reply);
});

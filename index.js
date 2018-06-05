'use-strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { Wit, log } = require('node-wit');

const PORT = process.env.PORT || 1337;
const PAGE_ACCESS_TOKEN = "EAAaE2cwOZAfABAH7C23UMiyxtk9aZBnfLskVqBBK04ZB5p20201b54CgBoC8UoKKoGBCFhpt5wdfvQhpp3VdqB7l8ElXS9xn8HlQIYIf0EJiT65sCQjwapjiWzfZAuWoVXn2vJIPt2VOqZCe6JLz6qt63ZAtpDgDf0ZA62F1vDDPAZDZD";
const client = new Wit({
  accessToken: "5IRZPGUBOVZK67LKPO4HTMHPITBRDJSN",
  logger: new log.Logger(log.DEBUG)
});

const texts = {
  greeting: ["Hi", "Hello", "What's up"],
  farewell: ["Good bye", "Hope to see you again", "Bye"]
};

//interactive(client);

app = express().use(bodyParser.json());
app.listen(PORT, () => console.log(`Messenger Webhook is listening on PORT ${PORT}`));

app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function (entry) {

      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      if (webhook_event.message) {
        if (webhook_event.message.text) {
          // Send message to Wit.ai
          client.message(webhook_event.message.text, {})
          .then((data) => {
            console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
            let msg = "";
            if(data.entities.intent.value === "greeting") {
              msg = texts.greeting[Math.floor(Math.random() * Math.floor(texts.greeting.length))]
            } else if(data.entities.intent.value === "farewell") {
              msg = texts.farewell[Math.floor(Math.random() * Math.floor(texts.farewell.length))]
            } else {
              msg = "Sorry, i do not understand";
            }
            //handleMessage(sender_psid, webhook_event.message);
            handleMessage(sender_psid, msg);
          })
          .catch(console.error);
        }
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {

  let VERIFY_TOKEN = "abcdefghijklmnopqrstuvwxyz0123456789";
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      res.sendStatus(403);
    }
  }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message) {
    response = {
      "text": received_message
    }
  }
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
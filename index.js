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
      const message = webhook_event.message;
      if (message) {
        if (message.text) {
          // Facebook NLP
          let msg = "";
          const greeting = firstEntities(message.nlp, 'greetings');
          const thank = firstEntities(message.nlp, 'thanks');
          const bye = firstEntities(message.nlp, 'bye');
          const datetime = firstEntities(message.nlp, 'datetime');
          const amount_of_money = firstEntities(message.nlp, 'amount_of_money');
          const phone_number = firstEntities(message.nlp, 'phone_number');
          const email = firstEntities(message.nlp, 'email');
          const quantity = firstEntities(message.nlp, 'quantity');
          const distance = firstEntities(message.nlp, 'distance');
          const temperature = firstEntities(message.nlp, 'temperature');
          const volume = firstEntities(message.nlp, 'volume');
          const location = firstEntities(message.nlp, 'location');
          const url = firstEntities(message.nlp, 'url');
          const sentiment = firstEntities(message.nlp, 'sentiment');
          const duration = firstEntities(message.nlp, 'duration');

          if (greeting && greeting.confidence > 0.8) {
            msg = "Hi, what can i help you?";
          } else if (thank && thank.confidence > 0.8) {
            msg = "You’re Welcome. :)";
          } else if (bye && bye.confidence > 0.8) { 
            msg = "Good bye.";
          } else if (datetime && datetime.confidence > 0.8) {
            msg = datetime.value;
          } else if (location && location.confidence > 0.8) {
            msg = location.value;
          } else if (email && email.confidence > 0.8) {
            msg = email.value;
          } else if (temperature && temperature.confidence > 0.8) {
            msg = temperature.value;
          } else if (url && url.confidence > 0.8) {
            msg = url.value;
          } else {
            msg = "Please contact us at contact@takemetour.com"
          }
          //handleMessage(sender_psid, webhook_event.message);
          handleMessage(sender_psid, msg);
          // Send message to Wit.ai
          client.message(message.text, {})
            .then((data) => {
              console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
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

// First entities
function firstEntities(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

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
// function handlePostback(sender_psid, received_postback) {

// }

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
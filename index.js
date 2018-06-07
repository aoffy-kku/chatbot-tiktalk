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
const logo_url = `https://lh3.googleusercontent.com/sNzOU5yocb97rUQyqKVJWs5BGGMcYwwEIi-wE3pIRL0kyBbqV8uYoMdYAzlv4mTHLz3H=w300`;
const base_url = `https://www.takemetour.com/`;
const help_url = `https://takemetoursupport.zendesk.com/hc/en-us`;
const welcome = "WELCOME";
const need_help = "NEED_HELP";
const chatting = "CHATTING";
const travelers = "TRAVELERS";
const partners = "PARTNERS";
const LX = "LX";
const tickets = "TICKETS";
const email = "contact@takemetour.com";
const needhelp_text = {
  base: "Do you need help about traveler, partner, local expert or ticket?"
};
const travelers_text = {
  base: "Do you want to ask about account setting, booking process, payment process, post-trip process or cancellation policy?"
};
const lx_text = {
  base: "Do you want to ask about account setting, booking process, payment process, post-trip process or cancellation policy?"
}
const tickets_text = {
  base: "Do you want to ask about ticket info, how to redeem, do not received e-ticket?"
};
const travelers_url = {
  base: "https://takemetoursupport.zendesk.com/hc/en-us/categories/202599547-For-Traveler",
  account: "https://takemetoursupport.zendesk.com/hc/en-us/sections/204120357-Basic-101-How-does-TakeMeTour-work-",
  booking: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203954888-Booking-a-Trip",
  payment: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203952387-Payment",
  posttrip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988868-After-Your-Trip-Day",
  cancellation: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988848-Re-schedule-Cancel-a-Trip"
};
const lx_url = {
  base: "https://takemetoursupport.zendesk.com/hc/en-us/categories/202608398-For-Local-Expert",
  account: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203919257-FAQs",
  trip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203919267-Trip-Listing",
  booking: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988688-Booking",
  posttrip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203954908-Tips",
  cancellation: "https://takemetoursupport.zendesk.com/hc/en-us/articles/217757647-Change-and-Cancellation-Policies-for-Local-Experts"
};
const tickets_url = {
  info: "",
  redeem: "",
  eticket: ""
};

//interactive(client);

app = express().use(bodyParser.json());
app.listen(PORT, () => console.log(`Messenger Webhook is listening on PORT ${PORT}`));

app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function (entry) {
      console.log("ENTRY: ", entry);
      let webhook_event = entry.messaging[0];
      console.log("WEBHOOK_EVENT: ", webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      const message = webhook_event.message;
      const postback = webhook_event.postback;
      if (message) {
        console.log("MESSAGE!!");
        if (message.text) {
          console.log("NLP: ", JSON.stringify(message.nlp));
          if (isEnglish(message.text)) {
            if(isGreeting(message.nlp)) {
              handlePostback(sender_psid, { payload: welcome });
            } else if(isThanks(message.nlp)) {
              handleMessage(sender_psid, "You're welcome");
            } else if(isBye(message.nlp)) {
              handleMessage(sender_psid, ":)");
            } else if(isTraveler(message.text)) {
              handleMessage(sender_psid, travelers_text.base);
            } else if(isPartner(message.text)) {
              handleMessage(sender_psid, `Please contact us at ${email}`);
            } else if(isLX(message.text)) {
              handleMessage(sender_psid, lx_text.base);
            } else if(isTicket(message.text)) {
              handleMessage(sender_psid, `Comming soon`);
            } else {
              handleMessage(sender_psid, "Wait a minute");
            }
            //handleMessage(sender_psid, webhook_event.message);
            // handlePostback(sender_psid, { payload: welcome });
            // Send message to Wit.ai
            // client.message(message.text, {})
            //   .then((data) => {
            //     console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
            //   })
            //   .catch(console.error);

          } else {
            handleMessage(sender_psid, "English please.");
          }
        }
      } else if (postback) {
        console.log("POSTBACK!!");
        handlePostback(sender_psid, postback);
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
function handlePostback(sender_psid, received_postback) {
  let response_message = null;
  console.log("POSTBACK: ", JSON.stringify(received_postback));
  switch (received_postback.payload) {
    case welcome:
      console.log(welcome);
      response_message = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Welcome to takemetour",
                "image_url": logo_url,
                "subtitle": `Thailand's Largest Selection of Local Experiences`,
                "default_action": {
                  "type": "web_url",
                  "url": base_url,
                  "messenger_extensions": false,
                  "webview_height_ratio": "tall"
                },
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Go Help",
                    "payload": need_help
                  },
                  {
                    "type": "postback",
                    "title": "Start Chatting",
                    "payload": chatting
                  }
                ]
              }
            ]
          }
        }
      };
      callSendAPI(sender_psid, response_message);
      break;
    case chatting:
      console.log(chatting);
      response_message = {
        "text": "Hello"
      };
      callSendAPI(sender_psid, response_message);
      break;
    case need_help:
      console.log(need_help);
      handleMessage(sender_psid, );
      break;
    case travelers:
      console.log(travelers);
      response_message = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [
              {
                "title": "Welcome to TakeMeTour's Help Center",
                "image_url": logo_url,
                "subtitle": "For Traveler",
                "default_action": {
                  "type": "web_url",
                  "url": travelers_url.base,
                  "messenger_extensions": false,
                  "webview_height_ratio": "tall"
                }
              },
              {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Account Setting",
                    "url": travelers_url.account
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Booking Process",
                    "url": travelers_url.booking
                  },
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Payment Process",
                    "url": travelers_url.payment
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Post-Trip Process",
                    "url": travelers_url.posttrip
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Cancellation Policy",
                    "url": travelers_url.cancellation
                  }
                ]
              },
              {
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Back",
                    "payload  ": need_help
                  }
                ]
              }
            ]
          }
        }
      };
      callSendAPI(sender_psid, response_message);
      break;
    case LX:
      console.log(LX);
      response_message = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [
              {
                "title": "Welcome to TakeMeTour's Help Center",
                "image_url": logo_url,
                "subtitle": "For Local Expert",
                "default_action": {
                  "type": "web_url",
                  "url": lx_url.base,
                  "messenger_extensions": false,
                  "webview_height_ratio": "tall"
                },
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Account Setting",
                    "url": lx_url.account,
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Booking Process",
                    "url": lx_url.booking,
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Trip Listing",
                    "url": lx_url.trip,
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Post-Trip Process",
                    "url": lx_url.posttrip,
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "Cancellation Policy",
                    "url": lx_url.cancellation,
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                ]
              }, {
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Back",
                    "payload": need_help
                  }
                ]
              }
            ]
          }
        }
      };
      callSendAPI(sender_psid, response_message);
      break;
    case tickets:
      callSendAPI(sender_psid, response_message);
      break;
    case partners:
      console.log(partners);
      response_message = {
        "text": email
      };
      callSendAPI(sender_psid, response_message);
      break;
    default:
      break;
  }
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log("REQUEST: ", JSON.stringify(request_body));

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

function isEnglish(message) {
  const regexp = new RegExp("^[a-zA-Z0-9$@$!%*?&#^-_. +]+$");
  return regexp.test(message.text);
}

function isGreeting(nlp) {
  const greeting = firstEntities(nlp, 'greetings');
  return (greeting && greeting.confidence > 0.8);
}

function isThanks(nlp) {
  const thanks = firstEntities(nlp, 'thanks');
  return (thanks && thanks.confidence > 0.8);
}

function isBye(nlp) {
  const bye = firstEntities(nlp, 'bye');
  return (bye && bye.confidence > 0.8);
}

function isTraveler(text) {
  text = text.toLowerCase();
  return (text === "travelers" || text === "traveler");
}

function isPartner(text) {
  text = text.toLowerCase();
  return (text === "partners" || text === "partner");
}

function isLX(text) {
  text = text.toLowerCase();
  return (text === "localexpert" || text === "local expert" || text === "lx");
}

function isTicket(text) {
  text = text.toLowerCase();
  return (text === "tickets" || text === "ticket");
}

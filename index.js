'use-strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { Wit, log } = require('node-wit');
const curl = new (require('curl-request'))();

const PORT = process.env.PORT || 1337;
const PAGE_ACCESS_TOKEN = "EAAaE2cwOZAfABAH7C23UMiyxtk9aZBnfLskVqBBK04ZB5p20201b54CgBoC8UoKKoGBCFhpt5wdfvQhpp3VdqB7l8ElXS9xn8HlQIYIf0EJiT65sCQjwapjiWzfZAuWoVXn2vJIPt2VOqZCe6JLz6qt63ZAtpDgDf0ZA62F1vDDPAZDZD";
const SECONDARY_PAGE_APP_ID = 263902037430900;
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
const travelers_account = "TRAVELERS_ACCOUNT";
const travelers_booking = "TRAVELERS_BOOKING";
const travelers_payment = "TRAVELERS_PAYMENT";
const travelers_posttrip = "TRAVELERS_POSTTRIP";
const travelers_cancellation = "TRAVELERS_CANCELLATION";
const partners = "PARTNERS";
const lx = "LOCAL_EXPERT";
const lx_account = "LX_ACCOUNT";
const lx_booking = "LX_BOOKING";
const lx_trip = "LX_TRIP";
const lx_posttrip = "LX_POSTTRIP";
const lx_cancellation = "LX_CANCELLATION";
const tickets = "TICKETS";
const email = "contact@takemetour.com";
const partner_message = {
  // "attachment": {
  //   "type": "template",
  //   "payload": {
  //     "template_type": "button",
  //     "text": "Do you want to send an email?",
  //     "buttons": [
  //       {
  //         "type": "web_url",
  //         "title": "Send",
  //         "url": `mailto:${email}`
  //       }
  //     ]
  //   }
  // }
  "text": `Please contact us at <a href="mailto:${email}">${email}</a>`
};
const welcome_message = {
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

const needhelp_message = {
  "text": "Do you want to ask about: ",
  "quick_replies": [
    {
      "content_type": "text",
      "title": "Traveler",
      "payload": travelers,
    },
    {
      "content_type": "text",
      "title": "Partner",
      "payload": partners,
    },
    {
      "content_type": "text",
      "title": "Local Expert",
      "payload": lx,
    },
    {
      "content_type": "text",
      "title": "Ticket",
      "payload": tickets,
    },
    {
      "content_type": "text",
      "title": "Start Chatting",
      "payload": chatting,
    }
  ]
};

const travelers_message = {
  "text": "Traveler topics: ",
  "quick_replies": [
    {
      "content_type": "text",
      "title": "Account Setting",
      "payload": travelers_account,
    },
    {
      "content_type": "text",
      "title": "Booking Process",
      "payload": travelers_booking,
    },
    {
      "content_type": "text",
      "title": "Payment Process",
      "payload": travelers_payment,
    },
    {
      "content_type": "text",
      "title": "Post-Trip Setting",
      "payload": travelers_posttrip,
    },
    {
      "content_type": "text",
      "title": "Calcellation Policy",
      "payload": travelers_cancellation,
    },
    {
      "content_type": "text",
      "title": "Back",
      "payload": need_help,
    }
  ]
};
const lx_message = {
  "text": "Traveler topics: ",
  "quick_replies": [
    {
      "content_type": "text",
      "title": "Account Setting",
      "payload": lx_account,
    },
    {
      "content_type": "text",
      "title": "Booking Process",
      "payload": lx_booking,
    },
    {
      "content_type": "text",
      "title": "Trip Listing",
      "payload": lx_trip,
    },
    {
      "content_type": "text",
      "title": "Post-Trip Setting",
      "payload": lx_posttrip,
    },
    {
      "content_type": "text",
      "title": "Calcellation Policy",
      "payload": lx_cancellation,
    },
    {
      "content_type": "text",
      "title": "Back",
      "payload": need_help,
    }
  ]
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
      console.log("ENTRY: ", JSON.stringify(entry));
      let webhook_event = null;
      if (entry.messaging) {
        webhook_event = entry.messaging[0];
      } else {
        webhook_event = entry.standby[0];
      }
      // console.log("WEBHOOK_EVENT: ", webhook_event);
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      const message = webhook_event.message;
      const postback = webhook_event.postback;
      if (message) {
        // console.log("MESSAGE!!");
        if (message.quick_reply) {
          handlePostback(sender_psid, message.quick_reply);
        } else if (message.text) {
          // console.log("NLP: ", JSON.stringify(message.nlp));
          if (isEnglish(message.text)) {
            if (isGreeting(message.nlp)) {
              handlePostback(sender_psid, { payload: welcome });
            } else if (isThanks(message.nlp)) {
              handleMessage(sender_psid, "You're welcome")
            } else if (isBye(message.nlp)) {
              handleMessage(sender_psid, ":)");
            } else {
              handlePostback(sender_psid, { payload: chatting });
            }
            //handleMessage(sender_psid, webhook_event.mesSECONDARY_PAGE_APP_IDage);
            // handlePostback(sender_psid, { payload: welcSECONDARY_PAGE_APP_IDme });
            // Send message to Wit.ai
            // client.message(message.text, {})
            //   .then((data) => {
            //     console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
            //   })
            //   .catch(console.error);

          } else {
            handleMessage(sender_psid, "English please.");
          }
        } else if (message.postback) {
          handlePostback(sender_psid, message.postback);
        }
      } else if (postback) {
        // console.log("POSTBACK!!");
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
  // console.log("POSTBACK: ", JSON.stringify(received_postback));
  switch (received_postback.payload) {
    case welcome:
      console.log(welcome);
      callSendAPI(sender_psid, welcome_message);
      break;
    case chatting:
      console.log(chatting);
      handleMessage(sender_psid, "Wait a minute. We are connecting to help center");
      curl
        .setHeaders([
          'Content-Type: application/json'
        ])
        .setBody({
          "recipient": {
            "id": sender_psid
          },
          "target_app_id": SECONDARY_PAGE_APP_ID,
          "metadata": "Go to page inbox",
          "message": {
            "text": "Wait a minute. We are passing to takemetour support"
          }
        })
        .post(`https://graph.facebook.com/v2.6/me/pass_thread_control?access_token=${PAGE_ACCESS_TOKEN}`)
        .then(({ statusCode, body, headers }) => {
          console.log(statusCode, body, headers)
        })
        .catch((e) => {
          console.log(e);
        });
      break;
    case need_help:
      console.log(need_help);
      callSendAPI(sender_psid, needhelp_message);
      break;
    case travelers:
      console.log(travelers);
      callSendAPI(sender_psid, travelers_message);
      break;
    case lx:
      console.log(lx);
      callSendAPI(sender_psid, lx_message);
      break;
    case tickets:
      // callSendAPI(sender_psid, response_message);
      break;
    case partners:
      console.log(partners);
      callSendAPI(sender_psid, partner_message);
      break;
    case travelers_account:
      console.log(travelers_account);
      callSendAPI(sender_psid, getTemplate(travelers_url.base, travelers_url.account));
      break;
    case travelers_booking:
      console.log(travelers_booking);
      callSendAPI(sender_psid, getTemplate(travelers_url.base, travelers_url.booking));
      break;
    case travelers_cancellation:
      console.log(travelers_cancellation);
      callSendAPI(sender_psid, getTemplate(travelers_url.base, travelers_url.cancellation));
      break;
    case travelers_payment:
      console.log(travelers_payment);
      callSendAPI(sender_psid, getTemplate(travelers_url.base, travelers_url.payment));
      break;
    case travelers_posttrip:
      console.log(travelers_posttrip);
      callSendAPI(sender_psid, getTemplate(travelers_url.base, travelers_url.posttrip));
      break;
    case lx_account:
      console.log(lx_account);
      callSendAPI(sender_psid, getTemplate(lx_url.base, lx_url.account));
      break;
    case lx_booking:
      console.log(lx_booking);
      callSendAPI(sender_psid, getTemplate(lx_url.base, lx_url.booking));
      break;
    case lx_trip:
      console.log(lx_trip);
      callSendAPI(sender_psid, getTemplate(lx_url.base, lx_url.trip));
      break;
    case lx_posttrip:
      console.log(lx_posttrip);
      callSendAPI(sender_psid, getTemplate(lx_url.base, lx_url.posttrip));
      break;
    case lx_cancellation:
      console.log(lx_cancellation);
      callSendAPI(sender_psid, getTemplate(lx_url.base, lx_url.cancellation));
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

function getTemplate(baseUrl, secUrl) {
  const template = {
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
              "url": baseUrl,
              "messenger_extensions": false,
              "webview_height_ratio": "tall"
            },
            "buttons": [
              {
                "type": "web_url",
                "title": "View Site",
                "url": secUrl
              },
              {
                "type": "postback",
                "title": "Back",
                "payload": need_help,
              }
            ]
          }
        ]
      }
    }
  };
  return template;
}

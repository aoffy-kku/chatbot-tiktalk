const {
  getStarted,
  identify,
  foreigner,
  thai,
  traveler,
  partner,
  localExpert,
  ticket,
  feedback,
  support,
  rating,
} = require('./payload');

const email = "contact@takemetour.com";
const logo_url = `https://lh3.googleusercontent.com/sNzOU5yocb97rUQyqKVJWs5BGGMcYwwEIi-wE3pIRL0kyBbqV8uYoMdYAzlv4mTHLz3H=w300`;
const travelerUrl = {
  base: "https://takemetoursupport.zendesk.com/hc/en-us/categories/202599547-For-Traveler",
  account: "https://takemetoursupport.zendesk.com/hc/en-us/sections/204120357-Basic-101-How-does-TakeMeTour-work-",
  booking: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203954888-Booking-a-Trip",
  payment: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203952387-Payment",
  posttrip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988868-After-Your-Trip-Day",
  cancellation: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988848-Re-schedule-Cancel-a-Trip"
};
const localExpertUrl = {
  base: "https://takemetoursupport.zendesk.com/hc/en-us/categories/202608398-For-Local-Expert",
  account: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203919257-FAQs",
  trip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203919267-Trip-Listing",
  booking: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203988688-Booking",
  posttrip: "https://takemetoursupport.zendesk.com/hc/en-us/sections/203954908-Tips",
  cancellation: "https://takemetoursupport.zendesk.com/hc/en-us/articles/217757647-Change-and-Cancellation-Policies-for-Local-Experts"
};
const messages = {
  identify: {
    "text": "What can I help you ? :",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Foreigner",
        "payload": foreigner,
      },
      {
        "content_type": "text",
        "title": "Thai",
        "payload": thai,
      }
    ]
  },
  foreigner: {
    "text": "Foreigner topics :",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Traveler",
        "payload": traveler.main,
      },
      {
        "content_type": "text",
        "title": "Partner",
        "payload": partner,
      },
      {
        "content_type": "text",
        "title": "Back",
        "payload": identify,
      }
    ]
  },
  thai: {
    "text": "Thai topics :",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Local Expert",
        "payload": localExpert.main,
      },
      {
        "content_type": "text",
        "title": "Partner",
        "payload": partner,
      },
      {
        "content_type": "text",
        "title": "Ticket",
        "payload": ticket.main,
      },
      {
        "content_type": "text",
        "title": "Back",
        "payload": identify,
      }
    ]
  },
  traveler: {
    main: {
      "text": "Traveler topics :",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Account Setting",
          "payload": traveler.accountSetting,
        },
        {
          "content_type": "text",
          "title": "Booking Process",
          "payload": traveler.bookingProcess,
        },
        {
          "content_type": "text",
          "title": "Payment Process",
          "payload": traveler.paymentProcess,
        },
        {
          "content_type": "text",
          "title": "Post-Trip Process",
          "payload": traveler.postTripProcess,
        },
        {
          "content_type": "text",
          "title": "Cancellation Policy",
          "payload": traveler.cancellationPolicy,
        },
        {
          "content_type": "text",
          "title": "Back",
          "payload": foreigner,
        }
      ]
    },
    accountSetting: getTemplate(travelerUrl.account),
    bookingProcess: getTemplate(travelerUrl.booking),
    paymentProcess: getTemplate(travelerUrl.payment),
    postTripProcess: getTemplate(travelerUrl.posttrip),
    cancellationPolicy: getTemplate(travelerUrl.cancellation),
  },
  partner: {
    "text": `Please contact us at <a href="mailto:${email}">${email}</a>`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Back",
        "payload": identify,
      }
    ]
  },
  localExpert: {
    main: {
      "text": "Local Expert topics :",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Account Setting",
          "payload": localExpert.accountSetting,
        },
        {
          "content_type": "text",
          "title": "Booking Process",
          "payload": localExpert.bookingProcess,
        },
        {
          "content_type": "text",
          "title": "Trip Listing",
          "payload": localExpert.tripListing,
        },
        {
          "content_type": "text",
          "title": "Post-Trip Setting",
          "payload": localExpert.postTripProcess,
        },
        {
          "content_type": "text",
          "title": "Calcellation Policy",
          "payload": localExpert.cancellationPolicy,
        },
        {
          "content_type": "text",
          "title": "Back",
          "payload": thai,
        }
      ]
    },
    accountSetting: getTemplate(localExpertUrl.account),
    bookingProcess: getTemplate(localExpertUrl.booking),
    tripListing: getTemplate(localExpertUrl.trip),
    postTripProcess: getTemplate(localExpertUrl.posttrip),
    cancellationPolicy: getTemplate(localExpertUrl.cancellation),
  },
  feedback: {
    "text": "Did you find your answer? :",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Yes",
        "payload": rating.main,
      },
      {
        "content_type": "text",
        "title": "No",
        "payload": support,
      }
    ]
  },
  rating: {
    "text": "Rate me",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "5",
        "payload": rating.five,
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": rating.four,
      },
      {
        "content_type": "text",
        "title": "3",
        "payload": rating.three,
      },
      {
        "content_type": "text",
        "title": "2",
        "payload": rating.two,
      },
      {
        "content_type": "text",
        "title": "1",
        "payload": rating.one,
      }
    ]
  }
};

function getTemplate(url) {
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
              "url": url,
              "messenger_extensions": false,
              "webview_height_ratio": "tall"
            },
            "buttons": [
              {
                "type": "web_url",
                "title": "View Site",
                "url": url
              }
            ]
          }
        ]
      }
    }
  };
  return template;
}

module.exports = {
  messages
};

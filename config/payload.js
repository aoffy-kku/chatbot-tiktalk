const getStarted = 'GET_STARTED';
const identify = 'IDENTIFY';
const foreigner = 'FOREIGNER';
const thai = 'THAI';
const traveler = {
  main: 'TRAVELER',
  accountSetting: 'TRAVELER_ACCOUNT_SETTING',
  bookingProcess: 'TRAVELER_BOOKING_PROCESS',
  paymentProcess: 'TRAVELER_PAYMENT_PROCESS',
  postTripProcess: 'TRAVELER_EXPERT_POST_TRIP_PROCESS',
  cancellationPolicy: 'TRAVELER_CANCELLATION_POLICY'
};
const partner = 'PARTNER';
const localExpert = {
  main: 'LOCAL_EXPERT',
  accountSetting: 'LOCAL_EXPERT_ACCOUNT_SETTING',
  tripListing: 'LOCAL_EXPERT_TRIP_LISTING',
  bookingProcess: 'LOCAL_EXPERT_BOOKING_PROCESS',
  postTripProcess: 'LOCAL_EXPERT_POST_TRIP_PROCESS',
  cancellationPolicy: 'LOCAL_EXPERT_CANCELLATION_POLICY'
};
const ticket = {
  main: 'TICKET',
  ticketInfo: 'TICKET_TICKET_INFO',
  howToRedeem: 'TICKET_HOW_TO_REDEEM',
  eTicket: 'TICKET_E_TICKET'
};
const feedback = 'FEED_BACK';
const support = 'SUPPORT';
const rating = {
  main: 'RATING',
  one: 'RATING_ONE',
  two: 'RATING_TWO',
  three: 'RATING_THREE',
  four: 'RATING_FOUR',
  five: 'RATING_FIVE',
};

module.exports = {
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
};

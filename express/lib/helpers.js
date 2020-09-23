module.exports = {
  formatUrl: (query, opts = '?units=auto', owmKey = process.env.DARK) =>
    `https://api.darksky.net/forecast/${owmKey}/${query}${opts}`,
  timestamp: req =>
    `${new Date().toTimeString().replace(/ GMT.*/g, '')} Response send to ${
      req.headers.origin
    } ${req.query.APPID}`,
  isExpired: miliseconds => (Date.now() - miliseconds > 300000 ? true : false),
  getId: input => {
    var hex, i;
    var result = '';
    for (i = 0; i < input.length; i++) {
      hex = input.charCodeAt(i).toString(16);
      result += ('000' + hex).slice(-4);
    }
    return result;
  },
  sanitizeInput: input =>
    isNaN(input)
      ? input.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '').trim() || ''
      : Number(input),
  formatCache: (id, location, response) => ({
    locationId: id,
    loctation: location,
    data: response,
    ts: Number(Date.now())
  })
};

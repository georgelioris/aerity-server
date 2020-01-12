module.exports = {
  formatUrl: (query, opts = '?units=auto', owmKey = process.env.DARK) =>
    `https://api.darksky.net/forecast/${owmKey}/${query}${opts}`,
  timestamp: req =>
    `${new Date().toTimeString().replace(/ GMT.*/g, '')} Response send to ${
      req.headers.origin
    } ${req.query.APPID}`,
  isExpired: miliseconds => (Date.now() - miliseconds > 300000 ? true : false)
};

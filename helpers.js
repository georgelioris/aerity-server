module.exports = (query, opts = '?units=auto', owmKey = process.env.DARK) =>
  `https://api.darksky.net/forecast/${owmKey}/${query}${opts}`;

const findNumberOfMatchesWithRegex = (text, regex) => {
  const matches = text.match(regex);
  return matches !== null ? matches.length : 0;
};

module.exports = findNumberOfMatchesWithRegex;

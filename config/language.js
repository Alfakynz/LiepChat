function getPrincipalLanguage(acceptLanguage) {
  if (acceptLanguage && acceptLanguage.length >= 2) {
    return acceptLanguage.slice(0, 2);
  }
  return 'en';
}

module.exports = { getPrincipalLanguage }
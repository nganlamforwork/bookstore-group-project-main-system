const handlebars = require("handlebars");

handlebars.registerHelper("equal", function (value1, value2, options) {
  return value1 === value2 ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper("notEqual", function (value1, value2, options) {
  return value1 !== value2 ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("hideCardNumber", function (cardNumber) {
  if (cardNumber && cardNumber.length >= 4) {
    const visibleDigits = 4; // Number of visible digits at the end
    const maskedPart = "*".repeat(cardNumber.length - visibleDigits);
    const visiblePart = cardNumber.slice(-visibleDigits);
    return maskedPart + visiblePart;
  }
  return "****"; // Return default masking if card number is not provided or too short
});

handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

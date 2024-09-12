const { generateCaptcha } = require('./index');

const simpleCaptcha = generateCaptcha('simple', { length: 6, digits: true, upperCase: true });
console.log('Simple CAPTCHA Text:', simpleCaptcha.captchaText);
console.log('Image saved at:', simpleCaptcha.imagePath);

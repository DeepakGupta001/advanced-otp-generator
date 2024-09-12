const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function generateOTP(length = 6, options = {}) {
  const {
    digits = true,
    upperCase = false,
    lowerCase = false,
    specialCase = false,
  } = options;

  const digitChars = "0123456789";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = "!@#$%^&*()_+~";

  let charSet = "";

  if (digits) charSet += digitChars;
  if (upperCase) charSet += upperCaseChars;
  if (lowerCase) charSet += lowerCaseChars;
  if (specialCase) charSet += specialCharacters;

  if (charSet.length === 0)
    throw new Error("At least one character set should be selected");

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return otp;
}

// Helper function to draw text on canvas and save it as an image
function drawTextAndSaveImage(text, fileName = "captcha.png") {
  const width = 200;
  const height = 80;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  // Add noise to the background
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(
      Math.random() * width,
      Math.random() * height,
      2, // Width of the noise dots
      2
    );
  }

  // Text styling
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Randomize text position and rotation a bit
  const x = width / 2;
  const y = height / 2;
  const angle = (Math.random() - 0.5) * 0.5; // Random angle between -0.25 to 0.25 radians
  ctx.rotate(angle);
  ctx.fillText(text, x, y);
  ctx.rotate(-angle); // Reset rotation after drawing

  // Add distortion lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = getRandomColor();
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Save the image to the root directory
  const buffer = canvas.toBuffer("image/png");
  const imagePath = path.join(__dirname, fileName); // Save in the root directory

  fs.writeFileSync(imagePath, buffer);
  console.log(`Image saved as ${fileName} in the root directory.`);

  return imagePath; // Return the image path
}

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Simple CAPTCHA generator
function generateSimpleCaptcha(length = 6, options = {}) {
  const { digits = true, upperCase = false, lowerCase = false } = options;

  const digitChars = "0123456789";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";

  let charSet = "";
  if (digits) charSet += digitChars;
  if (upperCase) charSet += upperCaseChars;
  if (lowerCase) charSet += lowerCaseChars;

  if (charSet.length === 0)
    throw new Error("At least one character set should be selected");

  let captchaText = "";
  for (let i = 0; i < length; i++) {
    captchaText += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  const imagePath = drawTextAndSaveImage(captchaText); // Generate and save the image
  return { captchaText, imagePath };
}

// Math CAPTCHA generator
function generateMathCaptcha(difficulty = "low") {
  let num1, num2, operator, answer;

  switch (difficulty) {
    case "low":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operator = ["+", "-"][Math.floor(Math.random() * 2)];
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
      break;
    case "high":
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
      break;
    default:
      throw new Error("Invalid difficulty level");
  }

  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      answer = Math.floor(num1 / num2);
      break;
  }

  const captchaText = `${num1} ${operator} ${num2} = ?`;
  const imagePath = drawTextAndSaveImage(captchaText); // Generate and save the image

  return { captchaText, answer, imagePath };
}

// Main function to generate CAPTCHA (simple or math-based)
function generateCaptcha(type = "simple", options = {}) {
  const {
    length = 6,
    difficulty = "low",
    digits = true,
    upperCase = false,
    lowerCase = false,
  } = options;

  if (type === "simple") {
    return generateSimpleCaptcha(length, { digits, upperCase, lowerCase });
  } else if (type === "math") {
    return generateMathCaptcha(difficulty);
  } else {
    throw new Error("Invalid CAPTCHA type");
  }
}

module.exports = { generateCaptcha, generateOTP };

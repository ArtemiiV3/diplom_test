//utilits.js
const axios = require("axios");
const cheerio = require("cheerio");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Логика для получения контента с GitHub
async function getPageContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении содержимого страницы:", error);
    return null;
  }
}

// Логика для извлечения текста из GitHub
function parseTextWithReactCodeLines(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const codeLines = [];

  $(".react-code-lines .react-code-text").each((index, element) => {
    codeLines.push($(element).text());
  });

  if (codeLines.length === 0) {
    console.warn("Не найдены элементы с локатором react-code-lines");
  }

  return codeLines.join("\n");
}

// Логика для сохранения текста в PDF
function saveTextToPDF(text, outputFilePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputFilePath));

  doc.fontSize(12).text(text, {
    align: "left",
  });

  doc.end();
}

// Главная логика, которая соединяет все части
async function generatePDF(url, outputFilePath) {
  const htmlContent = await getPageContent(url);
  if (htmlContent) {
    const parsedText = parseTextWithReactCodeLines(htmlContent);
    if (parsedText) {
      saveTextToPDF(parsedText, outputFilePath);
      console.log("PDF создан успешно:", outputFilePath);
    } else {
      console.error("Не удалось извлечь текст из HTML-содержимого");
    }
  }
}

module.exports = {
  getPageContent,
  parseTextWithReactCodeLines,
  saveTextToPDF,
  generatePDF,
};
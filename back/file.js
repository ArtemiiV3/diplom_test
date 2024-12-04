const express = require("express");
const path = require("path");
const cheerio = require("cheerio");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Логика для получения контента с GitHub (используем fetch вместо axios)
async function getPageContent(url) {
  try {
    const response = await fetch(url);  // Используем fetch вместо axios
    if (!response.ok) {
      throw new Error("Ошибка при получении данных с GitHub");
    }
    return await response.text();
  } catch (error) {
    console.error("Ошибка при получении содержимого страницы:", error);
    return null;
  }
}

// Логика для извлечения текста из HTML с помощью Cheerio
function parseTextWithReactCodeLines(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const codeLines = [];

  $('.react-code-lines .react-code-text').each((index, element) => {
    codeLines.push($(element).text());
  });

  if (codeLines.length === 0) {
    console.warn('Не найдены элементы с локатором react-code-lines');
  }

  return codeLines.join('\n');
}

// Логика для сохранения текста в PDF
function saveTextToPDF(text, outputFilePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputFilePath));

  doc.fontSize(12).text(text, {
    align: 'left'
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
      console.log('PDF создан успешно:', outputFilePath);
    } else {
      console.error('Не удалось извлечь текст из HTML-содержимого');
    }
  }
}

// Обработка POST-запроса для генерации PDF
app.post("/generate-pdf", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL не предоставлен." });
  }

  // Сохраняем файл во временную директорию, чтобы избежать проблем с правами на запись
  const outputPDFPath = path.join("/tmp", "output.pdf");

  try {
    await generatePDF(url, outputPDFPath);
    res.json({ success: true, pdfUrl: "/output.pdf" });  // Отправляем ссылку на файл
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Ошибка при генерации PDF." });
  }
});

// Статические файлы для скачивания
app.use(express.static(path.join(__dirname, "public")));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
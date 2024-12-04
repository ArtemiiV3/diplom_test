//server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const { generatePDF } = require("./utils");  // Импортируем функцию из utils.js

const app = express();
app.use(cors());  // Разрешаем CORS
app.use(express.json());

// Обработка POST-запроса для генерации PDF
app.post("/generate-pdf", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: "URL не предоставлен." });
  }

  const outputPDFPath = path.join(__dirname, "public", "output.pdf");

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
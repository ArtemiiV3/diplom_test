document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".document-generator input");
    const button = document.querySelector(".document-generator button");
    const message = document.createElement("p");
    const generatorSection = document.querySelector(".document-generator");

    // Создаем контейнер для сообщения и кнопки скачивания
    const resultSection = document.createElement("div"); // Новый контейнер
    generatorSection.appendChild(resultSection); // Добавляем его в `generatorSection`

    button.addEventListener("click", async () => {
        const url = input.value.trim();
        if (!url) {
            alert("Пожалуйста, введите ссылку.");
            return;
        }

        message.textContent = "Генерация документации...";
        resultSection.appendChild(message);

        try {
            const response = await fetch("http://194.87.102.125:3000/generate-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error("Ошибка при генерации документа.");
            }

            const data = await response.json();

            if (data.success && data.pdfUrl) {
                message.textContent = "Документ сгенерирован!";

                // Создание кнопки для скачивания PDF
                const downloadButton = document.createElement("a");
                downloadButton.href = `http://194.87.102.125:3000${data.pdfUrl}`; // Заменено на IP адрес
                downloadButton.textContent = "Скачать PDF";
                downloadButton.download = "documentation.pdf"; // Определяем имя файла
                downloadButton.className = "download-button";

                // Добавляем кнопку на страницу
                resultSection.appendChild(downloadButton); // Добавляем в `resultSection`
            } else {
                message.textContent = "Ошибка при обработке.";
            }
        } catch (error) {
            console.error(error);
            message.textContent = "Произошла ошибка. Попробуйте еще раз.";
        }
    });
});
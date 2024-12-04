document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".document-generator input");
    const button = document.querySelector(".document-generator button");
    const message = document.createElement("p");
    const generatorSection = document.querySelector(".document-generator");

    const resultSection = document.createElement("div");
    generatorSection.appendChild(resultSection);

    button.addEventListener("click", async () => {
        const url = input.value.trim();
        if (!url) {
            alert("Пожалуйста, введите ссылку.");
            return;
        }

        message.textContent = "Генерация документации...";
        resultSection.appendChild(message);

        try {
            const response = await fetch("https://194.87.102.125/generate-pdf", { // HTTPS для сервера
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

                const downloadButton = document.createElement("a");
                downloadButton.href = `https://194.87.102.125${data.pdfUrl}`;
                downloadButton.textContent = "Скачать PDF";
                downloadButton.download = "documentation.pdf";
                downloadButton.className = "download-button";

                resultSection.appendChild(downloadButton);
            } else {
                message.textContent = "Ошибка при обработке.";
            }
        } catch (error) {
            console.error("Ошибка:", error);
            message.textContent = "Произошла ошибка. Попробуйте еще раз.";
        }
    });
});



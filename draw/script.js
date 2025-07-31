document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");

  // 1. Найти таблицу из футера первой страницы
  const firstPageFooterTable = document.querySelector(
    ".page:first-child .footer-table"
  );

  if (!firstPageFooterTable) {
    console.error("Таблица .footer-table не найдена на первой странице.");
    return; // Прекращаем выполнение, если таблица не найдена
  }

  pages.forEach((page, index) => {
    const pageFooter = page.querySelector(".footer");

    // Для первой страницы просто обновляем номер страницы
    if (index === 0) {
      const pageNumberSpan = pageFooter.querySelector(".page-number");
      if (pageNumberSpan) {
        pageNumberSpan.textContent = `${index + 1}`; // Только номер без "Страница"
      }
      return; // Пропускаем дальнейшие действия для первой страницы
    }

    // Для второй и последующих страниц
    let descriptionText = "";
    const descriptionDiv = pageFooter.querySelector("#description");
    const pageNumberSpan = pageFooter.querySelector(".page-number"); // Находим span для номера страницы

    // 2. Взять текст из div id="description"
    if (descriptionDiv) {
      descriptionText = descriptionDiv.textContent.trim();
      // 3. Удалить div id="description" и, возможно, другие элементы в футере
      pageFooter.innerHTML = ""; // Очищаем весь футер
    } else {
      // Если div#description нет, просто очищаем футер, если есть другие элементы
      pageFooter.innerHTML = "";
    }

    // 4. Клонировать таблицу с первой страницы
    // true в cloneNode(true) означает глубокое клонирование (со всеми дочерними элементами)
    const clonedTable = firstPageFooterTable.cloneNode(true);

    // 5. Вставить клонированную таблицу в футер текущей страницы
    pageFooter.appendChild(clonedTable);

    // 6. Найти ячейку с id="description" в клонированной таблице и заменить её значение
    // Важно: ID должны быть уникальными на странице. Если вы клонируете элементы с ID,
    // то на каждой странице будет одинаковый ID. Лучше использовать классы или
    // обновить ID после клонирования, чтобы они были уникальными (например, description-page-2).
    // В данном случае, если ID используется только для JavaScript-манипуляций
    // внутри каждой таблицы, это может быть приемлемо, но потенциально опасно.
    // Ячейка "Детали О1, П1" находится в 10-й строке (index 9), 7-й ячейке (index 6)
    // Если вы изменили структуру таблицы, вам придется скорректировать эти индексы.
    // Давайте найдем её по ID, но будьте осторожны с дублированием ID.
    // Лучше было бы добавить класс к этой ячейке вместо ID, например <td class="item-description">
    const targetCellId = "description";
    const targetCell = clonedTable.querySelector(`#${targetCellId}`);

    if (targetCell) {
      targetCell.textContent = descriptionText;
    } else {
      console.warn(
        `Ячейка с ID "${targetCellId}" не найдена в клонированной таблице для страницы ${
          index + 1
        }.`
      );
    }

    // 7. Обновить номер страницы в клонированной таблице
    // Номер страницы находится в 8-й строке (индекс 7), 9-й ячейке (индекс 8),
    // если считать по структуре таблицы.
    // Или, если вы хотите использовать ваш span.page-number, то:
    const newTablePageNumberSpan = clonedTable.querySelector(".page-number");
    if (newTablePageNumberSpan) {
      newTablePageNumberSpan.textContent = `${index + 1}`; // Только номер без "Страница"
    } else {
      console.warn(
        `Элемент .page-number не найден в клонированной таблице для страницы ${
          index + 1
        }.`
      );
    }
  });
});

async function loadAndInsertSVG(containerId, svgPath, modifyCallback = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер с ID "${containerId}" не найден.`);
    return null;
  }

  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки SVG (${svgPath}): ${response.statusText}`
      );
    }
    const svgText = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgText;
    const originalSvgElement = tempDiv.querySelector("svg");

    if (originalSvgElement) {
      const clonedSvgElement = originalSvgElement.cloneNode(true); // Глубокое клонирование

      container.innerHTML = "";
      container.appendChild(clonedSvgElement);

      if (modifyCallback && typeof modifyCallback === "function") {
        // Важно: Мы ищем элементы внутри КЛОНИРОВАННОГО SVG
        modifyCallback(clonedSvgElement);
      }
      return clonedSvgElement;
    } else {
      console.error(
        `Не удалось найти SVG-элемент в загруженном содержимом для ${svgPath}.`
      );
      return null;
    }
  } catch (error) {
    console.error("Произошла ошибка при работе с SVG:", error);
    return null;
  }
}

function updateTextInHtmlByClass(className, newText) {
  const elements = document.querySelectorAll(`.${className}`);
  if (elements.length > 0) {
    elements.forEach((element) => {
      element.textContent = newText;
    });
    console.log(
      `Обновлено ${elements.length} элементов с классом "${className}".`
    );
  } else {
    console.warn(`Элементы с классом "${className}" не найдены в документе.`);
  }
}

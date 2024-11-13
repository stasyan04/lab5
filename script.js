document.addEventListener('DOMContentLoaded', () => {
    let previousVariantCell = null;
    let clickTimeout = null;

    const form = document.getElementById('infoForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        clearErrors();

        const fullname = document.getElementById('fullname').value.trim();
        const variant = document.getElementById('variant').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const faculty = document.getElementById('faculty').value.trim();
        const address = document.getElementById('address').value.trim();

        let isValid = true;

        const fullnameRegex = /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ]{1,}\s*[A-ZА-ЯІЇЄҐ]\.[A-ZА-ЯІЇЄґ]\.$/;
        if (!fullnameRegex.test(fullname)) {
            displayError('fullnameError', 'Введіть ПІБ у форматі "Прізвище І.Б."');
            isValid = false;
        }

        const variantNumber = parseInt(variant, 10);
        if (isNaN(variantNumber)) {
            displayError('variantError', 'Варіант має бути числом');
            isValid = false;
        } else if (variantNumber < 1 || variantNumber > 36) {
            displayError('variantError', 'Варіант має бути числом від 1 до 36');
            isValid = false;
        }

        const phoneRegex = /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            displayError('phoneError', 'Введіть телефон у форматі (XXX)-XXX-XX-XX');
            isValid = false;
        }

        const facultyRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s]{2,}$/;
        if (!facultyRegex.test(faculty)) {
            displayError('facultyError', 'Введіть коректний факультет (мінімум 2 літери)');
            isValid = false;
        }

        const addressRegex = /^м\.\s*[A-Za-zА-Яа-яІіЇїЄєҐґ\s]{2,}$/;
        if (!addressRegex.test(address)) {
            displayError('addressError', 'Введіть адресу у форматі "м. Назва міста"');
            isValid = false;
        }

        if (isValid) {
            const userInfo = `
                <h2>Введена інформація</h2>
                <p><strong>ПІБ:</strong> ${fullname}</p>
                <p><strong>Варіант:</strong> ${variantNumber}</p>
                <p><strong>Контактний телефон:</strong> ${phone}</p>
                <p><strong>Факультет:</strong> ${faculty}</p>
                <p><strong>Адреса:</strong> ${address}</p>
            `;
            const infoWindow = window.open("", "User Information", "width=400,height=400");
            infoWindow.document.write(userInfo);
            infoWindow.document.close();

            form.reset();

            createInteractiveTable(variantNumber);
        }
    });

    function createInteractiveTable(variantNumber) {
        const tableContainer = document.getElementById('interactiveTableContainer');
        if (!tableContainer) {
            console.error('Контейнер для таблиці не знайдено. Переконайтеся, що в HTML є елемент з id="interactiveTableContainer".');
            return;
        }

        tableContainer.innerHTML = '';

        const table = document.createElement('table');
        table.id = 'interactiveTable';
        table.classList.add('interactive-table');

        let cellNumber = 1;
        for (let i = 1; i <= 6; i++) {
            const row = table.insertRow();
            for (let j = 1; j <= 6; j++) {
                const cell = row.insertCell();
                cell.textContent = cellNumber;
                cell.id = `cell-${cellNumber}`;

                if (cellNumber === variantNumber) {
                    setupVariantCell(cell, variantNumber);
                }

                cellNumber++;
            }
        }

        tableContainer.appendChild(table);
    }

    function setupVariantCell(cell, variantNumber) {
        cell.addEventListener('mouseover', handleMouseOver);
        cell.addEventListener('mouseout', handleMouseOut);
        cell.addEventListener('click', handleClick);
        cell.addEventListener('dblclick', handleDoubleClick);
    }

    function handleMouseOver() {
        this.originalCellColor = this.style.backgroundColor;
        this.style.backgroundColor = getRandomColor();
    }

    function handleMouseOut() {
        this.style.backgroundColor = this.originalCellColor;
    }

    function handleClick(event) {
        if (clickTimeout) return;
        const cell = this;
        clickTimeout = setTimeout(() => {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = '#FF0000';

            colorInput.addEventListener('input', () => {
                cell.style.backgroundColor = colorInput.value;
                cell.originalCellColor = colorInput.value;
            });
            colorInput.click();

            clickTimeout = null;
        }, 300); 
    }

    function handleDoubleClick() {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }

        const rowIndex = this.parentElement.rowIndex;
        const table = this.closest('table');

        for (let i = rowIndex; i < table.rows.length; i += 2) {
            const rowCells = table.rows[i].cells;
            for (let cell of rowCells) {
                cell.style.backgroundColor = getRandomColor();
            }
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let k = 0; k < 6; k++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function displayError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }
});
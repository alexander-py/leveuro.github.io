document.addEventListener('DOMContentLoaded', () => {
    const bgnInput = document.getElementById('bgn-amount');
    const eurInput = document.getElementById('eur-amount');
    const examplesList = document.getElementById('examples-list');
    const currentYearSpan = document.getElementById('currentYear');
    const langEnButton = document.getElementById('lang-en');
    const langBgButton = document.getElementById('lang-bg');

    const exchangeRate = 1.95583; // 1 EUR = 1.95583 BGN
    const exampleBgnValues = [1, 10, 20, 50, 100];

    const translations = {
        en: {
            pageTitle: "BGN to EUR Converter | Official Rate",
            mainHeading: "BGN to EUR Converter",
            subHeading: "Convert Bulgarian Lev to Euro at the official fixed rate.",
            officialRateText: "Official Exchange Rate:",
            bgnLabel: "BGN Amount (лв):",
            bgnPlaceholder: "e.g., 100",
            eurLabel: "EUR Amount (€):",
            eurPlaceholder: "Result in EUR",
            examplesHeading: "Quick examples:",
            noteText: "Results are updated automatically.",
            newsText: "On 04.06.2025, the EU gave Bulgaria green light to adopt euro from start of 2026.",
            footerRights: "Alexander Stefanov. All Rights Reserved."
        },
        bg: {
            pageTitle: "BGN към EUR Конвертор | Официален курс",
            mainHeading: "BGN към EUR Конвертор",
            subHeading: "Конвертирайте Българския Лев в Евро по официалния фиксиран курс.",
            officialRateText: "Официален обменен курс:",
            bgnLabel: "Въведете сума в BGN (лв):",
            bgnPlaceholder: "напр. 100",
            eurLabel: "Равностойност в EUR (€):",
            eurPlaceholder: "Резултат в EUR",
            examplesHeading: "Бързи примери:",
            noteText: "Резултатите се обновяват автоматично.",
            newsText: "На 04.06.2025 г. ЕС даде зелена светлина на България да приеме еврото от началото на 2026 г.",
            footerRights: "Alexander Stefanov. Всички права запазени."
        }
    };

    let currentLanguage = 'bg'; // Default to Bulgarian, removed localStorage

    // Function to validate numeric input (allows numbers and single decimal point)
    function validateNumericInput(input) {
        // Remove any non-numeric characters except decimal point
        let value = input.value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Update the input value if it was changed
        if (input.value !== value) {
            input.value = value;
        }

        return value;
    }

    // Handle keypress events to prevent non-numeric input
    function handleKeyPress(event) {
        const char = String.fromCharCode(event.which);
        const currentValue = event.target.value;

        // Allow control keys (backspace, delete, tab, etc.)
        if (event.which < 32) {
            return true;
        }

        // Allow numbers
        if (/[0-9]/.test(char)) {
            return true;
        }

        // Allow decimal point only if there isn't one already
        if (char === '.' && currentValue.indexOf('.') === -1) {
            return true;
        }

        // Prevent all other characters
        event.preventDefault();
        return false;
    }

    function setLanguage(lang) {
        currentLanguage = lang;

        document.documentElement.lang = lang; // Set lang attribute on <html>

        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-translate-key-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-key-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update active state for buttons
        if (lang === 'bg') {
            langBgButton.classList.add('active');
            langEnButton.classList.remove('active');
        } else {
            langEnButton.classList.add('active');
            langBgButton.classList.remove('active');
        }

        populateExamples();
    }

    function populateExamples() {
        examplesList.innerHTML = ''; // Clear existing examples
        exampleBgnValues.forEach(bgnValue => {
            const eurValue = (bgnValue / exchangeRate).toFixed(5);
            const listItem = document.createElement('li');
            listItem.textContent = `${bgnValue} BGN = ${eurValue} EUR`;
            examplesList.appendChild(listItem);
        });
    }

    // Function to handle BGN to EUR conversion
    function convertBgnToEur() {
        const bgnAmount = parseFloat(bgnInput.value);
        if (isNaN(bgnAmount) || bgnAmount < 0) {
            eurInput.value = '';
            return;
        }
        const eurAmount = bgnAmount / exchangeRate;
        eurInput.value = eurAmount.toFixed(5);
    }

    // Function to handle EUR to BGN conversion
    function convertEurToBgn() {
        const eurAmount = parseFloat(eurInput.value);
        if (isNaN(eurAmount) || eurAmount < 0) {
            bgnInput.value = '';
            return;
        }
        const bgnAmount = eurAmount * exchangeRate;
        bgnInput.value = bgnAmount.toFixed(5);
    }

    // Add keypress event listeners to prevent non-numeric input
    bgnInput.addEventListener('keypress', handleKeyPress);
    eurInput.addEventListener('keypress', handleKeyPress);

    // Event listeners for both input fields with validation
    bgnInput.addEventListener('input', () => {
        validateNumericInput(bgnInput);
        convertBgnToEur();
        // Clear the other input if the current one is being typed into
        if (bgnInput.value === '') {
            eurInput.value = '';
        }
    });

    eurInput.addEventListener('input', () => {
        validateNumericInput(eurInput);
        convertEurToBgn();
        // Clear the other input if the current one is being typed into
        if (eurInput.value === '') {
            bgnInput.value = '';
        }
    });

    // Handle clearing the output if input is empty
    bgnInput.addEventListener('keyup', () => {
        if (bgnInput.value === '') {
            eurInput.value = '';
        }
    });

    eurInput.addEventListener('keyup', () => {
        if (eurInput.value === '') {
            bgnInput.value = '';
        }
    });

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Language toggle event listeners
    langEnButton.addEventListener('click', () => setLanguage('en'));
    langBgButton.addEventListener('click', () => setLanguage('bg'));

    // Initial setup
    if (bgnInput) {
        bgnInput.focus();
    }
    setLanguage(currentLanguage); // Apply initial language
});
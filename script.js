document.addEventListener('DOMContentLoaded', () => {
    const bgnInput = document.getElementById('bgn-amount');
    const eurInput = document.getElementById('eur-amount');
    const examplesList = document.getElementById('examples-list');
    const currentYearSpan = document.getElementById('currentYear');
    const langEnButton = document.getElementById('lang-en');
    const langBgButton = document.getElementById('lang-bg');
    const shareFacebook = document.getElementById('share-facebook');
    const shareX = document.getElementById('share-x');
    // const shareLinkedIn = document.getElementById('share-linkedin'); // Removed LinkedIn element

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
            shareHeading: "Share this converter:",
            shareFacebookLabel: "Share on Facebook",
            shareXLabel: "Share on X",
            // shareLinkedInLabel: "Share on LinkedIn", // Removed LinkedIn translation
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
            shareHeading: "Споделете този конвертор:",
            shareFacebookLabel: "Споделяне във Facebook",
            shareXLabel: "Споделяне в X",
            // shareLinkedInLabel: "Споделяне в LinkedIn", // Removed LinkedIn translation
            footerRights: "Alexander Stefanov. Всички права запазени."
        }
    };

    let currentLanguage = 'bg'; // Default to Bulgarian, removed localStorage

    function validateNumericInput(input) {
        let value = input.value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (input.value !== value) {
            input.value = value;
        }
        return value;
    }

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

    function updateShareLinks(lang) {
        const pageUrl = window.location.href;
        const shareTextEn = "Check out this BGN to EUR converter with the official fixed rate.";
        const shareTextBg = "Вижте този удобен конвертор от BGN към EUR по официалния фиксиран курс.";
        const pageTitleEn = "BGN to EUR Converter | Official Rate";
        const pageTitleBg = "BGN към EUR Конвертор | Официален курс";

        const shareText = lang === 'bg' ? shareTextBg : shareTextEn;
        const pageTitle = lang === 'bg' ? pageTitleBg : pageTitleEn;

        // Update meta tags for dynamic translation of share previews
        document.querySelector('meta[property="og:title"]').setAttribute('content', pageTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', shareText);
        document.querySelector('meta[property="twitter:title"]').setAttribute('content', pageTitle);
        document.querySelector('meta[property="twitter:description"]').setAttribute('content', shareText);

        if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        if (shareX) shareX.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
        // if (shareLinkedIn) shareLinkedIn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&summary=${encodeURIComponent(shareText)}`; // Removed LinkedIn share logic
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

        document.querySelectorAll('[data-translate-key-aria-label]').forEach(element => {
            const key = element.getAttribute('data-translate-key-aria-label');
            if (translations[lang][key]) {
                element.setAttribute('aria-label', translations[lang][key]);
            }
        });

        if (lang === 'bg') {
            langBgButton.classList.add('active');
            langEnButton.classList.remove('active');
        } else {
            langEnButton.classList.add('active');
            langBgButton.classList.remove('active');
        }

        populateExamples();
        updateShareLinks(lang);
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

    function convertBgnToEur() {
        const bgnAmount = parseFloat(bgnInput.value);
        if (isNaN(bgnAmount) || bgnAmount < 0) {
            eurInput.value = '';
            return;
        }
        eurInput.value = (bgnAmount / exchangeRate).toFixed(5);
    }

    function convertEurToBgn() {
        const eurAmount = parseFloat(eurInput.value);
        if (isNaN(eurAmount) || eurAmount < 0) {
            bgnInput.value = '';
            return;
        }
        bgnInput.value = (eurAmount * exchangeRate).toFixed(5);
    }

    bgnInput.addEventListener('keypress', handleKeyPress);
    eurInput.addEventListener('keypress', handleKeyPress);

    bgnInput.addEventListener('input', () => {
        validateNumericInput(bgnInput);
        convertBgnToEur();
    });

    eurInput.addEventListener('input', () => {
        validateNumericInput(eurInput);
        convertEurToBgn();
    });

    bgnInput.addEventListener('keyup', () => {
        if (bgnInput.value === '') eurInput.value = '';
    });

    eurInput.addEventListener('keyup', () => {
        if (eurInput.value === '') bgnInput.value = '';
    });

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    langEnButton.addEventListener('click', () => setLanguage('en'));
    langBgButton.addEventListener('click', () => setLanguage('bg'));

    if (bgnInput) {
        bgnInput.focus();
    }
    setLanguage(currentLanguage);
});
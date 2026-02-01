document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'fi';

    // UI Elements
    const langBtns = {
        fi: document.getElementById('toggle-fi'),
        en: document.getElementById('toggle-en')
    };

    const calcInputs = {
        type: document.querySelectorAll('input[name="site-type"]'),
        shop: document.getElementById('feat-shop'),
        blog: document.getElementById('feat-blog'),
        analytics: document.getElementById('feat-analytics'),
        hours: document.getElementById('content-hours')
    };

    const priceDisplays = {
        base: document.getElementById('price-base'),
        features: document.getElementById('price-features'),
        total: document.getElementById('price-total'),
        hoursDisplay: document.getElementById('hours-display')
    };

    // 1. Localization Logic
    function updateLanguage(lang) {
        currentLang = lang;

        // Update active button state
        Object.values(langBtns).forEach(btn => btn.classList.remove('active'));
        langBtns[lang].classList.add('active');

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (CONFIG.translations[lang][key]) {
                el.textContent = CONFIG.translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (CONFIG.translations[lang][key]) {
                el.setAttribute('placeholder', CONFIG.translations[lang][key]);
            }
        });

        updatePrices(); // Re-render prices with correct currency/format if needed
        renderPortfolio(); // Re-render portfolio for localized text
    }

    langBtns.fi.addEventListener('click', () => updateLanguage('fi'));
    langBtns.en.addEventListener('click', () => updateLanguage('en'));

    // 2. Calculator Logic
    function updatePrices() {
        // Find selected type
        let selectedType = 'onepager';
        calcInputs.type.forEach(input => {
            if (input.checked) selectedType = input.value;
        });

        const basePrice = CONFIG.prices[selectedType];

        let featurePrice = 0;
        if (calcInputs.shop.checked) featurePrice += CONFIG.prices.ecommerce;
        if (calcInputs.blog.checked) featurePrice += CONFIG.prices.blog;
        if (calcInputs.analytics.checked) featurePrice += CONFIG.prices.analytics;

        const hours = parseInt(calcInputs.hours.value);
        featurePrice += hours * CONFIG.prices.hourlyRate;

        // Display updates
        priceDisplays.hoursDisplay.textContent = `${hours} h`;
        priceDisplays.base.textContent = `${basePrice} €`;
        priceDisplays.features.textContent = `${featurePrice} €`;
        priceDisplays.total.textContent = `${basePrice + featurePrice} €`;
    }

    // Add listeners to all calc inputs
    calcInputs.type.forEach(input => input.addEventListener('change', updatePrices));
    calcInputs.shop.addEventListener('change', updatePrices);
    calcInputs.blog.addEventListener('change', updatePrices);
    calcInputs.analytics.addEventListener('change', updatePrices);
    calcInputs.hours.addEventListener('input', updatePrices);

    // 3. Portfolio Generation
    function renderPortfolio() {
        const grid = document.getElementById('portfolio-grid');
        grid.innerHTML = CONFIG.portfolio.map(item => `
            <div class="portfolio-card card">
                <img src="${item.image}" alt="${item[currentLang].title}" style="width:100%; border-radius: 8px; margin-bottom: 1rem;">
                <h3>${item[currentLang].title}</h3>
                <p>${item[currentLang].desc}</p>
                <a href="${item.link}" class="accent-link">${currentLang === 'fi' ? 'Katso projekti ' : 'View Project '} →</a>
            </div>
        `).join('');
    }

    // Init
    updateLanguage('fi');
    updatePrices();
    renderPortfolio();
});

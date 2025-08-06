// ===== BOOKING.JS ===== 

// ===== GLOBAL STATE ===== 
let currentStep = 1;
let bookingFlow = 'B'; // A = von index.html, B = direkter Zugriff
let maxSteps = 3; // Wird je nach Flow angepasst
let selectedDates = { start: null, end: null };
let selectedProducts = {};
let selectedShipping = { type: 'standard-de', price: 11.95 };
let selectedInsurance = {};
let selectedCategories = []; // Vorausgewählte Kategorien aus URL
let currentTheme = localStorage.getItem('swoofle-theme') || 'light';
let reservationCode = null;
let isInitialLoad = true; // Tracking für ersten Ladevorgang

// ===== PRODUCT DATA (TODO: Backend-Integration) ===== 
const productPrices = {
    'Flatcube Premium Black': 87.00,
    'Flatcube Premium White': 87.00,
    'Flatcube Premium Orange': 87.00,
    'Flatcube Premium Berry': 87.00,
    'FlowerPot': 5.95,
    'FlatDesk': 7.54,
    'ThinkTable': 13.92
};

const productAvailability = {
    'Flatcube Premium Black': 10,
    'Flatcube Premium White': 8,
    'Flatcube Premium Orange': 0,
    'Flatcube Premium Berry': 3,
    'FlowerPot': 50,
    'FlatDesk': 30,
    'ThinkTable': 25
};

const insurancePrices = {
    'cube': 5.80,
    'desk': 1.16,
    'pot': 1.16,
    'table': 13.92
};

// Demo reservations - Synchron mit index.html
const demoReservations = {
    'SWF-DEMO1': {
        dates: { start: '2025-08-15', end: '2025-08-17' },
        products: {
            'Flatcube Premium Black': 2,
            'FlowerPot': 3
        },
        shipping: { type: 'express-10', price: 24.95 },
        insurance: { cube: 5.80 }
    },
    'SWF-DEMO2': {
        dates: { start: '2025-08-20', end: '2025-08-22' },
        products: {
            'Flatcube Premium White': 1,
            'FlatDesk': 5,
            'ThinkTable': 2
        },
        shipping: { type: 'standard-de', price: 11.95 },
        insurance: {}
    },
    'SWF-TEST1': {
        dates: { start: '2025-09-10', end: '2025-09-12' },
        products: {
            'Flatcube Premium Berry': 3,
            'FlowerPot': 10
        },
        shipping: { type: 'express-9', price: 29.95 },
        insurance: { cube: 5.80, pot: 1.16 }
    }
};

// Info-Texte für Popups
const infoTexts = {
    shipping: {
        title: 'Versandoptionen',
        content: `
            <p><strong>Standardversand Deutschland:</strong> Zustellung bis 12:00 Uhr am Liefertag. Ideal für die meisten Events.</p>
            <p><strong>Express-Lieferung:</strong> Garantierte Zustellung bis zur gewählten Uhrzeit. Perfekt für zeitkritische Veranstaltungen.</p>
            <p><strong>Europa-Versand:</strong> Zuverlässige Lieferung in alle EU-Länder.</p>
            <p>Alle Preise verstehen sich pro Lieferung, unabhängig von der Anzahl der bestellten Artikel.</p>
            <div class="info-links">
                <a href="produkt.html" class="info-link">Produktdetails</a>
                <a href="customersupport.html" class="info-link">Support</a>
                <a href="kontakt.html" class="info-link">Kontakt</a>
            </div>
        `
    },
    insurance: {
        title: 'Schutzpaket',
        content: `
            <p><strong>Ohne Schutzpaket:</strong> 100% Selbstbeteiligung bei Schäden, Verlust oder Diebstahl.</p>
            <p><strong>Mit Schutzpaket:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
                <li>30% Selbstbeteiligung bei Beschädigung</li>
                <li>70% Selbstbeteiligung bei Verlust/Diebstahl</li>
            </ul>
            <p>Das Schutzpaket wird pro Artikel und Tag berechnet.</p>
            <div class="info-links">
                <a href="customersupport.html" class="info-link">Support kontaktieren</a>
                <a href="kontakt.html" class="info-link">Rückruf vereinbaren</a>
            </div>
        `
    },
    flatcubes: {
        title: 'FlatCube Information',
        content: `
            <p><strong>FlatCube Premium:</strong> Modulare Sitzwürfel in verschiedenen Farben für Events und flexible Raumgestaltung.</p>
            <p><strong>Technische Details:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Set = 5 einzelne FlatCubes</li>
                <li>Leicht, platzsparend, faltbar</li>
                <li>Für Innen- und geschützte Außenbereiche</li>
                <li>Nachhaltig produziert in Deutschland</li>
            </ul>
            <div class="info-links">
                <a href="produkt.html" class="info-link">Alle Details</a>
                <a href="customersupport.html" class="info-link">Support</a>
                <a href="kontakt.html" class="info-link">Beratung</a>
            </div>
        `
    },
    desks: {
        title: 'Desks & Tables Information',
        content: `
            <p><strong>FlatDesk & ThinkTable:</strong> Die perfekten Ergänzungen zu deinen FlatCubes.</p>
            <p><strong>Features:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Verwandelt FlatCubes in Arbeitsplätze</li>
                <li>Stabil und leicht aufbaubar</li>
                <li>Verschiedene Größen verfügbar</li>
            </ul>
            <div class="info-links">
                <a href="produkt.html" class="info-link">Produktübersicht</a>
                <a href="customersupport.html" class="info-link">Support</a>
                <a href="kontakt.html" class="info-link">Kontakt</a>
            </div>
        `
    },
    accessories: {
        title: 'Zubehör Information',
        content: `
            <p><strong>FlowerPot:</strong> Das vielseitige Deko-Element für dein Event.</p>
            <p><strong>Besonderheiten:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
                <li>3D-gedruckt in Berlin</li>
                <li>Nahezu unzerbrechlich</li>
                <li>Aus recycelbarem Filament</li>
                <li>Individuelle Gestaltung möglich</li>
            </ul>
            <div class="info-links">
                <a href="produkt.html" class="info-link">Alle Zubehör</a>
                <a href="customersupport.html" class="info-link">Support</a>
                <a href="kontakt.html" class="info-link">Kontakt</a>
            </div>
        `
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Booking-System wird initialisiert...');
    
    initializeTheme();
    determineBookingFlow();
    setupEventListeners();
    initializeBookingSystem();
    
    console.log(`📋 Booking-Flow: ${bookingFlow}, Max Steps: ${maxSteps}`);
});

// ===== BOOKING FLOW DETERMINATION =====
function determineBookingFlow() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Flow A: Von index.html mit URL-Parametern
    const hasDateParams = urlParams.get('startDate') && urlParams.get('endDate');
    const hasCodeParam = urlParams.get('code');
    const hasCategoriesParam = urlParams.get('categories');
    
    if (hasDateParams || hasCodeParam || hasCategoriesParam) {
        bookingFlow = 'A';
        maxSteps = 2; // Produktauswahl → Übersicht
        currentStep = 1; // Startet bei Schritt 1 in Flow A (= Produktauswahl)
        console.log('📱 Flow A erkannt: Weiterleitung von index.html');
    } else {
        bookingFlow = 'B';
        maxSteps = 3; // Verfügbarkeit → Produktauswahl → Übersicht  
        currentStep = 1; // Startet bei Schritt 1 in Flow B (= Verfügbarkeitsprüfung)
        console.log('🔗 Flow B erkannt: Direkter Zugriff');
    }
}

// ===== BOOKING SYSTEM INITIALIZATION =====
function initializeBookingSystem() {
    // Richtigen Stepper anzeigen und initialisieren
    document.querySelectorAll('.stepper-variant').forEach(stepper => {
        stepper.classList.remove('active');
    });
    
    if (bookingFlow === 'A') {
        document.getElementById('stepperFlowA')?.classList.add('active');
        // Flow A: Verstecke Verfügbarkeitsprüfung, springe direkt zur Produktauswahl
        hideAvailabilityStep();
        handleURLParameters();
        openRelevantAccordions();
        goToStep(1, false); // Schritt 1 in Flow A = Produktauswahl, kein Scroll beim ersten Laden
    } else {
        document.getElementById('stepperFlowB')?.classList.add('active');
        // Flow B: Zeige Verfügbarkeitsprüfung
        showAvailabilityStep();
        goToStep(1, false); // Schritt 1 in Flow B = Verfügbarkeitsprüfung, kein Scroll beim ersten Laden
    }
    
    // Grundlegende UI-Initialisierung
    updateLiveSummary();
    initializeAccordions();
    setupDateMinimums();
    
    // Flow B spezifische Initialisierung
    if (bookingFlow === 'B') {
        setupAvailabilityCheck();
    }
    
    // Nach der Initialisierung ist es kein erster Ladevorgang mehr
    setTimeout(() => {
        isInitialLoad = false;
    }, 500);
}

// ===== STEP CONTENT MANAGEMENT =====
function hideAvailabilityStep() {
    const availabilityStep = document.querySelector('[data-step="availability"]');
    if (availabilityStep) {
        availabilityStep.style.display = 'none';
        availabilityStep.classList.remove('active');
    }
    console.log('🚫 Verfügbarkeitsprüfung versteckt (Flow A)');
}

function showAvailabilityStep() {
    const availabilityStep = document.querySelector('[data-step="availability"]');
    if (availabilityStep) {
        availabilityStep.style.display = 'block';
    }
    console.log('✅ Verfügbarkeitsprüfung angezeigt (Flow B)');
}

// ===== STEP NAVIGATION mit Stepper-Visualisierung =====
function goToStep(step, shouldScroll = true) {
    console.log(`🔄 Gehe zu Schritt ${step} (Flow ${bookingFlow})`);
    
    // Verstecke alle Step Contents
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Aktualisiere Stepper-Visualisierung basierend auf Flow
    updateStepperVisualization(step);
    
    currentStep = step;
    
    // Zeige entsprechenden Content
    if (bookingFlow === 'A') {
        // Flow A: 2 Schritte - Verfügbarkeitsprüfung überspringen
        if (step === 1) {
            // Schritt 1 = Produktauswahl (in Flow A)
            const selectionStep = document.querySelector('.step-content[data-step="selection"]');
            if (selectionStep) {
                selectionStep.classList.add('active');
                // Stelle sicher, dass Datum-Änderung möglich ist in Flow A wenn Daten vorhanden
                if (selectedDates.start && selectedDates.end) {
                    showDateChangeSection();
                }
            }
        } else if (step === 2) {
            // Schritt 2 = Finale Übersicht
            document.querySelector('.step-content[data-step="summary"]')?.classList.add('active');
            generateReservationCode();
            updateFinalSummary();
            showReservationCode();
        }
    } else {
        // Flow B: 3 Schritte
        if (step === 1) {
            // Schritt 1 = Verfügbarkeitsprüfung
            document.querySelector('.step-content[data-step="availability"]')?.classList.add('active');
        } else if (step === 2) {
            // Schritt 2 = Produktauswahl  
            const selectionStep = document.querySelector('.step-content[data-step="selection"]');
            if (selectionStep) {
                selectionStep.classList.add('active');
                updateSelectedDatesDisplay();
                showDateChangeSection(); // In Flow B kann Datum immer geändert werden
            }
        } else if (step === 3) {
            // Schritt 3 = Finale Übersicht
            document.querySelector('.step-content[data-step="summary"]')?.classList.add('active');
            generateReservationCode();
            updateFinalSummary();
            showReservationCode();
        }
    }
    
    // Scroll to content nur wenn shouldScroll true ist und es nicht der erste Ladevorgang ist
    if (shouldScroll && !isInitialLoad) {
        setTimeout(() => {
            document.querySelector('.booking-content')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
    
    // Update ARIA attributes für Barrierefreiheit
    updateAriaAttributes(step);
}

// ===== DATUM ÄNDERN SEKTION =====
function showDateChangeSection() {
    const dateChangeSection = document.getElementById('dateChangeSection');
    if (dateChangeSection && selectedDates.start && selectedDates.end) {
        dateChangeSection.style.display = 'block';
        console.log('📅 Datum-Änderung Sektion angezeigt');
    }
}

// ===== NEUE FUNKTION: Stepper-Visualisierung aktualisieren =====
function updateStepperVisualization(activeStep) {
    // Wähle den aktiven Stepper basierend auf Flow
    const stepperId = bookingFlow === 'A' ? 'stepperFlowA' : 'stepperFlowB';
    const stepper = document.getElementById(stepperId);
    
    if (!stepper) return;
    
    const steps = stepper.querySelectorAll('.glass-step');
    
    steps.forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        // Entferne alle Klassen
        stepElement.classList.remove('active', 'completed');
        
        if (stepNumber < activeStep) {
            // Vorherige Schritte als abgeschlossen markieren
            stepElement.classList.add('completed');
            stepElement.setAttribute('aria-selected', 'false');
            stepElement.setAttribute('aria-current', 'false');
        } else if (stepNumber === activeStep) {
            // Aktueller Schritt
            stepElement.classList.add('active');
            stepElement.setAttribute('aria-selected', 'true');
            stepElement.setAttribute('aria-current', 'step');
        } else {
            // Zukünftige Schritte
            stepElement.setAttribute('aria-selected', 'false');
            stepElement.setAttribute('aria-current', 'false');
        }
    });
    
    console.log(`✅ Stepper aktualisiert: Schritt ${activeStep} von ${maxSteps}`);
}

// ===== NEUE FUNKTION: ARIA Attribute aktualisieren =====
function updateAriaAttributes(step) {
    // Update ARIA live region
    const liveRegion = document.querySelector('[role="status"]');
    if (liveRegion) {
        const stepNames = {
            'A': ['Produktauswahl', 'Übersicht'],
            'B': ['Verfügbarkeit prüfen', 'Produktauswahl', 'Übersicht']
        };
        
        const currentStepName = stepNames[bookingFlow][step - 1];
        liveRegion.textContent = `Schritt ${step} von ${maxSteps}: ${currentStepName}`;
    }
}

// ===== URL PARAMETER HANDLING (Flow A) =====
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const reservationCodeParam = urlParams.get('code');
    const categoriesParam = urlParams.get('categories');
    
    if (startDate && endDate) {
        selectedDates.start = startDate;
        selectedDates.end = endDate;
        updateSelectedDatesDisplay();
        console.log('📅 Daten aus URL geladen:', selectedDates);
    }
    
    if (categoriesParam) {
        selectedCategories = categoriesParam.split(',').filter(cat => 
            ['flatcubes', 'desks', 'accessories'].includes(cat)
        );
        console.log('🏷️ Kategorien aus URL:', selectedCategories);
    }
    
    if (reservationCodeParam && demoReservations[reservationCodeParam]) {
        // Reservierungscode laden  
        const codeInput = document.getElementById('reservationCode');
        if (codeInput) codeInput.value = reservationCodeParam;
        loadReservationData(reservationCodeParam);
        console.log('🎫 Reservierungscode aus URL geladen:', reservationCodeParam);
    }
}

// ===== AVAILABILITY CHECK SETUP (Flow B) =====
function setupAvailabilityCheck() {
    const checkBtn = document.getElementById('checkDirectAvailability');
    const startInput = document.getElementById('directStartDate');
    const endInput = document.getElementById('directEndDate');
    const codeInput = document.getElementById('directReservationCode');
    
    // Input validation für Availability Check
    function validateAvailabilityInputs() {
        const hasValidDates = startInput?.value && endInput?.value && 
                             new Date(startInput.value) < new Date(endInput.value);
        const hasValidCode = codeInput?.value?.trim().length >= 6;
        
        if (checkBtn) {
            checkBtn.disabled = !(hasValidDates || hasValidCode);
        }
    }
    
    // Event Listeners für Validation
    [startInput, endInput, codeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', validateAvailabilityInputs);
            input.addEventListener('change', validateAvailabilityInputs);
        }
    });
    
    // Check Availability Button
    checkBtn?.addEventListener('click', function() {
        const code = codeInput?.value?.trim()?.toUpperCase();
        
        if (code && demoReservations[code]) {
            // Reservierungscode gefunden - lade Daten und springe zu Schritt 2
            loadReservationData(code);
            openRelevantAccordions();
            goToStep(2, true); // Schritt 2 in Flow B = Produktauswahl
        } else if (startInput?.value && endInput?.value) {
            // Neue Verfügbarkeitsprüfung
            selectedDates.start = startInput.value;
            selectedDates.end = endInput.value;
            
            // Ausgewählte Kategorien sammeln
            const categoryCheckboxes = document.querySelectorAll('input[name="categories"]:checked');
            selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
            
            updateSelectedDatesDisplay();
            openRelevantAccordions();
            showAvailabilitySuccess();
            goToStep(2, true); // Schritt 2 in Flow B = Produktauswahl
        } else {
            showValidationError('Bitte geben Sie entweder einen gültigen Reservierungscode ein oder wählen Sie Start- und Enddatum aus.');
        }
    });
    
    // Initial validation
    validateAvailabilityInputs();
}

function showAvailabilitySuccess() {
    const days = calculateDays();
    const categoriesText = selectedCategories.length > 0 
        ? ` für ${selectedCategories.join(', ')}` 
        : '';
        
    showToast(`✅ Verfügbarkeit geprüft: ${days} Tag${days !== 1 ? 'e' : ''}${categoriesText} verfügbar!`, 'success');
}

// ===== WEITERE SCHRITT-NAVIGATION =====
function nextStep() {
    if (currentStep < maxSteps) {
        if (validateCurrentStep()) {
            goToStep(currentStep + 1, true); // Bei Navigation immer scrollen
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1, true); // Bei Navigation immer scrollen
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (bookingFlow === 'A') {
                // Flow A Schritt 1 = Produktauswahl
                return validateProductSelection();
            } else {
                // Flow B Schritt 1 = Verfügbarkeitsprüfung  
                return validateAvailability();
            }
        case 2:
            if (bookingFlow === 'B') {
                // Flow B Schritt 2 = Produktauswahl
                return validateProductSelection();
            }
            return true;
        default:
            return true;
    }
}

function validateProductSelection() {
    if (!selectedDates.start || !selectedDates.end) {
        showValidationError('⚠️ Bitte wählen Sie Start- und Enddatum aus.');
        return false;
    }
    if (Object.keys(selectedProducts).length === 0) {
        showValidationError('⚠️ Bitte wählen Sie mindestens ein Produkt aus.');
        return false;
    }
    return true;
}

function validateAvailability() {
    const startInput = document.getElementById('directStartDate');
    const endInput = document.getElementById('directEndDate');
    const codeInput = document.getElementById('directReservationCode');
    
    const hasValidDates = startInput?.value && endInput?.value;
    const hasValidCode = codeInput?.value?.trim();
    
    if (!hasValidDates && !hasValidCode) {
        showValidationError('⚠️ Bitte geben Sie Daten ein oder einen Reservierungscode.');
        return false;
    }
    
    return true;
}

// ===== ACCORDION FUNCTIONALITY =====
function initializeAccordions() {
    // FlatCubes Akkordeon standardmäßig geöffnet bei Flow A oder wenn FlatCubes vorausgewählt
    if (bookingFlow === 'A' || selectedCategories.includes('flatcubes')) {
        const flatcubesAccordion = document.querySelector('.accordion-item[data-category="flatcubes"]');
        flatcubesAccordion?.classList.add('active');
        console.log('📦 FlatCubes Akkordeon initial geöffnet');
    } else if (bookingFlow === 'B' && selectedCategories.length === 0) {
        // Flow B ohne Kategorien: FlatCubes standardmäßig öffnen
        const flatcubesAccordion = document.querySelector('.accordion-item[data-category="flatcubes"]');
        flatcubesAccordion?.classList.add('active');
        console.log('📦 FlatCubes Akkordeon standardmäßig geöffnet (Flow B)');
    }
}

function openRelevantAccordions() {
    console.log('🎯 Öffne relevante Akkordeons für Kategorien:', selectedCategories);
    
    const accordions = document.querySelectorAll('.accordion-item[data-category]');
    
    accordions.forEach(accordion => {
        const category = accordion.dataset.category;
        
        if (selectedCategories.includes(category)) {
            accordion.classList.add('active');
            console.log(`✅ Akkordeon geöffnet: ${category}`);
        }
    });
    
    // Wenn keine Kategorien vorausgewählt: FlatCubes öffnen
    if (selectedCategories.length === 0) {
        const flatcubesAccordion = document.querySelector('.accordion-item[data-category="flatcubes"]');
        flatcubesAccordion?.classList.add('active');
        console.log('📦 Standard-Akkordeon geöffnet: FlatCubes');
    }
}

function toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    const wasActive = item.classList.contains('active');
    
    if (wasActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
    }
    
    const category = item.dataset.category || 'Unknown';
    console.log(`📂 Akkordeon ${wasActive ? 'geschlossen' : 'geöffnet'}: ${category}`);
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('swoofle-theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('change', handleGlobalChange);
    document.addEventListener('input', handleGlobalInput);

    // Reservation code input
    const codeInput = document.getElementById('reservationCode');
    if (codeInput) {
        codeInput.addEventListener('input', debounce(checkReservationCode, 500));
    }
    
    // Date change handling für Flow A
    setupDateChangeHandlers();
}

function setupDateChangeHandlers() {
    const changeDatesBtn = document.getElementById('changeDatesBtn');
    const dateChangeForm = document.getElementById('dateChangeForm');
    const updateDatesBtn = document.getElementById('updateDatesBtn');
    const cancelDateChangeBtn = document.getElementById('cancelDateChangeBtn');
    
    changeDatesBtn?.addEventListener('click', function() {
        const isVisible = dateChangeForm.style.display === 'block';
        dateChangeForm.style.display = isVisible ? 'none' : 'block';
        changeDatesBtn.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
        
        if (!isVisible) {
            // Aktuelle Daten in die Inputs laden
            const newStartInput = document.getElementById('newStartDate');
            const newEndInput = document.getElementById('newEndDate');
            
            if (newStartInput && selectedDates.start) newStartInput.value = selectedDates.start;
            if (newEndInput && selectedDates.end) newEndInput.value = selectedDates.end;
        }
    });
    
    updateDatesBtn?.addEventListener('click', function() {
        const newStart = document.getElementById('newStartDate')?.value;
        const newEnd = document.getElementById('newEndDate')?.value;
        
        if (newStart && newEnd && new Date(newStart) < new Date(newEnd)) {
            selectedDates.start = newStart;
            selectedDates.end = newEnd;
            updateSelectedDatesDisplay();
            updateLiveSummary();
            dateChangeForm.style.display = 'none';
            changeDatesBtn.setAttribute('aria-expanded', 'false');
            showToast('📅 Datum erfolgreich aktualisiert!', 'success');
        } else {
            showValidationError('⚠️ Bitte geben Sie gültige Daten ein (Enddatum nach Startdatum).');
        }
    });
    
    cancelDateChangeBtn?.addEventListener('click', function() {
        dateChangeForm.style.display = 'none';
        changeDatesBtn.setAttribute('aria-expanded', 'false');
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleGlobalClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    // Handle close-menu for navigation links
    if (action === 'close-menu') {
        const element = e.target.closest('[data-action]');
        const href = element.getAttribute('href');
        
        if (href && href !== '#' && !href.startsWith('#')) {
            closeMobileMenu();
            return;
        } else {
            e.preventDefault();
            closeMobileMenu();
            return;
        }
    }

    e.preventDefault();

    switch (action) {
        case 'toggle-theme':
            toggleTheme();
            break;
        case 'toggle-menu':
            toggleMobileMenu();
            break;
        case 'next-step':
            nextStep();
            break;
        case 'prev-step':
            prevStep();
            break;
        case 'update-quantity':
            const delta = parseInt(e.target.dataset.delta, 10);
            const product = e.target.dataset.product;
            updateQuantity(product, delta);
            break;
        case 'toggle-accordion':
            toggleAccordion(e.target);
            break;
        case 'show-info':
            showInfoPopup(e.target.dataset.info);
            break;
        case 'close-info':
            closeInfoPopup();
            break;
        case 'complete-purchase':
            completePurchase();
            break;
        case 'generate-offer':
            generateOffer();
            break;
    }
}

function handleGlobalChange(e) {
    if (e.target.matches('input[name="shipping"]')) {
        selectedShipping = {
            type: e.target.value,
            price: parseFloat(e.target.dataset.price)
        };
        updateLiveSummary();
        console.log('🚚 Versand geändert:', selectedShipping);
    }

    if (e.target.matches('input[data-insurance]')) {
        const insurance = e.target.dataset.insurance;
        const price = parseFloat(e.target.dataset.price);
        
        if (e.target.checked) {
            selectedInsurance[insurance] = price;
        } else {
            delete selectedInsurance[insurance];
        }
        updateLiveSummary();
        console.log('🛡️ Versicherung geändert:', selectedInsurance);
    }
}

function handleGlobalInput(e) {
    if (e.target.matches('.quantity-input')) {
        const productName = e.target.dataset.product;
        const quantity = parseInt(e.target.value) || 0;
        const maxAvailable = parseInt(e.target.getAttribute('max')) || 0;
        
        if (quantity > maxAvailable) {
            e.target.value = maxAvailable;
            showToast(`⚠️ Maximal ${maxAvailable} Stück verfügbar`, 'warning');
            return;
        }
        
        if (quantity > 0) {
            selectedProducts[productName] = quantity;
        } else {
            delete selectedProducts[productName];
        }
        updateLiveSummary();
        updateProceedButton();
        console.log('📦 Produkt-Menge geändert:', productName, quantity);
    }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    
    hamburger?.classList.toggle('active');
    menu?.classList.toggle('active');
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    
    hamburger?.classList.remove('active');
    menu?.classList.remove('active');
}

// ===== DATE MANAGEMENT =====
function updateSelectedDatesDisplay() {
    const displayElements = {
        'displayStartDate': selectedDates.start ? formatDateGerman(selectedDates.start) : 'Bitte wählen',
        'displayEndDate': selectedDates.end ? formatDateGerman(selectedDates.end) : 'Bitte wählen',
        'displayDuration': selectedDates.start && selectedDates.end ? `${calculateDays()} Tag${calculateDays() !== 1 ? 'e' : ''}` : '-- Tage'
    };
    
    Object.entries(displayElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    console.log('📅 Datum-Anzeige aktualisiert:', selectedDates);
}

function setupDateMinimums() {
    const today = new Date().toISOString().split('T')[0];
    
    // Set minimum dates for all date inputs
    ['directStartDate', 'directEndDate', 'newStartDate', 'newEndDate'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.min = today;
        }
    });
}

function calculateDays() {
    if (!selectedDates.start || !selectedDates.end) return 1;
    return Math.ceil((new Date(selectedDates.end) - new Date(selectedDates.start)) / (1000 * 60 * 60 * 24)) + 1;
}

function formatDateGerman(dateString) {
    return new Date(dateString).toLocaleDateString('de-DE');
}

// ===== PRODUCT MANAGEMENT =====
function updateQuantity(productName, delta) {
    const input = document.querySelector(`input[data-product="${productName}"]`);
    if (!input) return;
    
    const currentVal = parseInt(input.value) || 0;
    const maxAvailable = parseInt(input.getAttribute('max')) || 0;
    
    let newVal = Math.max(0, currentVal + delta);
    
    if (newVal > maxAvailable) {
        newVal = maxAvailable;
        showToast(`⚠️ Maximal ${maxAvailable} Stück verfügbar`, 'warning');
    }
    
    input.value = newVal;
    
    if (newVal > 0) {
        selectedProducts[productName] = newVal;
    } else {
        delete selectedProducts[productName];
    }
    
    updateLiveSummary();
    updateProceedButton();
    console.log(`📦 ${productName}: ${newVal} Stück`);
}

// ===== RESERVIERUNGSCODE - VERBESSERTE VERSION =====
function generateReservationCode() {
    if (!reservationCode) {
        reservationCode = 'SWF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // TODO: Backend-Integration - Reservierung speichern
        // Simuliere Speicherung für Demo
        demoReservations[reservationCode] = {
            dates: { ...selectedDates },
            products: { ...selectedProducts },
            shipping: { ...selectedShipping },
            insurance: { ...selectedInsurance }
        };
        
        console.log('🎫 Reservierungscode generiert:', reservationCode);
        console.log('💾 Gespeicherte Daten:', demoReservations[reservationCode]);
    }
    
    const codeElement = document.getElementById('generatedReservationId');
    if (codeElement) {
        codeElement.textContent = reservationCode;
    }
    
    setupCopyButton();
}

function showReservationCode() {
    const display = document.getElementById('reservationCodeDisplay');
    if (display) {
        display.style.display = 'block';
        // Smooth fade-in animation
        setTimeout(() => {
            display.style.opacity = '1';
        }, 50);
    }
}

// ===== VERBESSERTE COPY-BUTTON FUNKTIONALITÄT =====
function setupCopyButton() {
    const copyBtn = document.getElementById('copyReservationId');
    if (copyBtn) {
        // Remove existing listeners
        const newBtn = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newBtn, copyBtn);
        
        newBtn.addEventListener('click', copyReservationCode);
    }
}

function copyReservationCode() {
    if (reservationCode) {
        navigator.clipboard.writeText(reservationCode).then(() => {
            const btn = document.getElementById('copyReservationId');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.classList.add('success');
                btn.innerHTML = '✓ Kopiert!';
                
                // Visual feedback
                const codeDisplay = document.querySelector('.reservation-code-display');
                if (codeDisplay) {
                    codeDisplay.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        codeDisplay.style.animation = '';
                    }, 500);
                }
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('success');
                }, 2000);
            }
            showToast('✅ Reservierungscode in Zwischenablage kopiert!', 'success');
        }).catch(() => {
            // Fallback für ältere Browser
            const textArea = document.createElement('textarea');
            textArea.value = reservationCode;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showToast('✅ Reservierungscode kopiert: ' + reservationCode, 'success');
            } catch (err) {
                showToast('❌ Kopieren fehlgeschlagen. Code: ' + reservationCode, 'error');
            }
            
            document.body.removeChild(textArea);
        });
    }
}

// ===== RESERVIERUNGSCODE LADEN =====
function checkReservationCode() {
    const input = document.getElementById('reservationCode');
    const code = input?.value?.trim()?.toUpperCase();
    
    if (!code) return;
    
    loadReservationData(code);
}

function loadReservationData(code) {
    if (demoReservations[code]) {
        const reservation = demoReservations[code];
        
        // Daten laden
        selectedDates = { ...reservation.dates };
        selectedProducts = { ...reservation.products };
        selectedShipping = { ...reservation.shipping };
        selectedInsurance = { ...reservation.insurance };
        
        updateSelectedDatesDisplay();
        updateProductQuantities();
        updateShippingSelection();
        updateInsuranceSelection();
        updateLiveSummary();
        updateProceedButton();
        
        // Visuelles Feedback
        const input = document.getElementById('reservationCode');
        if (input) {
            input.style.borderColor = '#10b981';
            input.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
            }, 3000);
        }
        
        showToast('✅ Reservierung erfolgreich geladen!', 'success');
        console.log('🎫 Reservierung geladen:', code, reservation);
        
        return true;
    } else {
        showToast('❌ Reservierungscode nicht gefunden. Bitte prüfen Sie die Eingabe.', 'error');
        console.log('❌ Reservierungscode nicht gefunden:', code);
        return false;
    }
}

function updateProductQuantities() {
    Object.entries(selectedProducts).forEach(([productName, quantity]) => {
        const input = document.querySelector(`input[data-product="${productName}"]`);
        if (input) {
            input.value = quantity;
        }
    });
}

function updateShippingSelection() {
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.checked = radio.value === selectedShipping.type;
    });
}

function updateInsuranceSelection() {
    Object.entries(selectedInsurance).forEach(([type, price]) => {
        const checkbox = document.querySelector(`input[data-insurance="${type}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// ===== LIVE SUMMARY UPDATE =====
function updateLiveSummary() {
    const days = calculateDays();
    
    // Date range
    const dateRange = selectedDates.start && selectedDates.end 
        ? `${formatDateGerman(selectedDates.start)} - ${formatDateGerman(selectedDates.end)} (${days} Tag${days !== 1 ? 'e' : ''})`
        : 'Bitte Datum wählen';
    
    const dateElement = document.getElementById('selectedDateRange');
    if (dateElement) dateElement.textContent = dateRange;
    
    // Items count
    const itemsCount = Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0);
    const countElement = document.getElementById('selectedItemsCount');
    if (countElement) countElement.textContent = itemsCount;
    
    // Calculate total
    const total = calculateTotal();
    const totalElement = document.getElementById('estimatedTotal');
    if (totalElement) totalElement.textContent = `${total.toFixed(2)}€`;
}

function updateProceedButton() {
    const btn = document.getElementById('proceedToSummary');
    if (!btn) return;
    
    const hasDateRange = Boolean(selectedDates.start && selectedDates.end);
    const hasProducts = Object.keys(selectedProducts).length > 0;
    const isEnabled = hasDateRange && hasProducts;
    
    btn.disabled = !isEnabled;
    
    if (isEnabled) {
        btn.classList.remove('btn-glass:disabled');
    }
}

// ===== FINAL SUMMARY UPDATE =====
function updateFinalSummary() {
    const days = calculateDays();
    
    // Update dates
    const finalStartEl = document.getElementById('finalStartDate');
    const finalEndEl = document.getElementById('finalEndDate');
    const finalDurationEl = document.getElementById('finalDuration');
    
    if (finalStartEl) finalStartEl.textContent = selectedDates.start ? formatDateGerman(selectedDates.start) : '--';
    if (finalEndEl) finalEndEl.textContent = selectedDates.end ? formatDateGerman(selectedDates.end) : '--';
    if (finalDurationEl) finalDurationEl.textContent = `${days} Tag${days !== 1 ? 'e' : ''}`;
    
    // Update product list
    const finalProductHTML = Object.keys(selectedProducts).length > 0
        ? Object.entries(selectedProducts).map(([name, qty]) => {
            const price = productPrices[name] || 0;
            let cost, description;
            
            if (name.includes('Flatcube')) {
                cost = qty * price * days;
                const pieces = qty * 5;
                description = `${qty} Set${qty > 1 ? 's' : ''} ${name} (${pieces} Stück) - ${cost.toFixed(2)}€`;
            } else {
                cost = qty * price * days;
                description = `${qty}x ${name} - ${cost.toFixed(2)}€`;
            }
            
            return `<li>${description}</li>`;
        }).join('')
        : '<li>Keine Produkte ausgewählt</li>';
    
    const finalProductList = document.getElementById('finalProductList');
    if (finalProductList) finalProductList.innerHTML = finalProductHTML;
    
    // Update shipping
    const deliveryNames = {
        'standard-de': 'Standardversand Deutschland',
        'express-10': 'Express bis 10 Uhr',
        'express-9': 'Express bis 9 Uhr',
        'express-8': 'Express bis 8 Uhr',
        'standard-eu': 'Standard Europa',
        'overnight-eu': 'Overnight Europa'
    };
    
    const finalShippingEl = document.getElementById('finalShippingOption');
    if (finalShippingEl) {
        finalShippingEl.textContent = deliveryNames[selectedShipping.type] || 'Standardversand Deutschland';
    }
    
    // Update insurance
    const finalInsuranceEl = document.getElementById('finalInsuranceDetails');
    const insuranceNames = Object.keys(selectedInsurance);
    if (finalInsuranceEl) {
        if (insuranceNames.length > 0) {
            const insuranceList = insuranceNames.map(type => {
                const names = {
                    'cube': 'Cube Schutzpaket',
                    'desk': 'FlatDesk Schutzpaket', 
                    'pot': 'FlowerPot Schutzpaket',
                    'table': 'ThinkTable Schutzpaket'
                };
                return names[type] || type;
            }).join(', ');
            finalInsuranceEl.textContent = insuranceList;
        } else {
            finalInsuranceEl.textContent = 'Kein Schutzpaket ausgewählt';
        }
    }
    
    // Calculate and update all costs
    const costs = calculateDetailedCosts();
    
    // Update all cost displays
    const costUpdates = {
        'finalProductCost': `${costs.productCost.toFixed(2)}€`,
        'finalShippingCost': `${costs.shippingCost.toFixed(2)}€`,
        'finalShippingCost2': `${costs.shippingCost.toFixed(2)}€`,
        'finalInsuranceCost': `${costs.insuranceCost.toFixed(2)}€`,
        'finalInsuranceCost2': `${costs.insuranceCost.toFixed(2)}€`,
        'finalSubtotal': `${costs.subtotal.toFixed(2)}€`,
        'finalVat': `${costs.vat.toFixed(2)}€`,
        'finalTotal': `${costs.total.toFixed(2)}€`
    };
    
    Object.entries(costUpdates).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
    
    console.log('💰 Finale Zusammenfassung aktualisiert:', costs);
}

// ===== CALCULATION FUNCTIONS =====
function calculateTotal() {
    const costs = calculateDetailedCosts();
    return costs.total;
}

function calculateDetailedCosts() {
    const days = calculateDays();
    
    let productCost = 0;
    Object.entries(selectedProducts).forEach(([productName, quantity]) => {
        const price = productPrices[productName] || 0;
        productCost += quantity * price * days;
    });
    
    const insuranceCost = Object.values(selectedInsurance).reduce((sum, price) => sum + price * days, 0);
    const shippingCost = selectedShipping.price;
    const subtotal = productCost + insuranceCost + shippingCost;
    const vat = subtotal * 0.19;
    const total = subtotal + vat;
    
    return {
        productCost,
        insuranceCost,
        shippingCost,
        subtotal,
        vat,
        total,
        days
    };
}

// ===== INFO POPUPS =====
function showInfoPopup(infoType) {
    const popup = document.getElementById('infoPopup');
    const title = document.getElementById('infoTitle');
    const content = document.getElementById('infoContent');
    
    if (popup && title && content && infoTexts[infoType]) {
        title.textContent = infoTexts[infoType].title;
        content.innerHTML = infoTexts[infoType].content;
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management für Barrierefreiheit
        popup.setAttribute('aria-hidden', 'false');
        title.focus();
    }
}

function closeInfoPopup() {
    const popup = document.getElementById('infoPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
        popup.setAttribute('aria-hidden', 'true');
    }
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
    const popup = document.getElementById('infoPopup');
    if (e.target === popup) {
        closeInfoPopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeInfoPopup();
    }
});

// ===== PURCHASE ACTIONS =====
function completePurchase() {
    const btn = document.querySelector('[data-action="complete-purchase"]');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Wird verarbeitet...';
        btn.classList.add('btn-loading');
        btn.disabled = true;
        
        // TODO: Backend-Integration - Bestellung abschließen
        setTimeout(() => {
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                text-align: center;
                z-index: 10001;
                min-width: 300px;
            `;
            successMsg.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <div class="success-content">
                    <h3 style="color: var(--accent-orange); margin-bottom: 1rem;">Buchung erfolgreich!</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>Bestellnummer:</strong> ${reservationCode}-ORDER</p>
                    <p style="color: var(--text-secondary);">Du wirst zur Zahlung weitergeleitet...</p>
                </div>
            `;
            
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                window.location.href = 'index.html?booking=success';
            }, 3000);
        }, 2000);
    }
}

function generateOffer() {
    const btn = document.querySelector('[data-action="generate-offer"]');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Wird erstellt...';
        btn.disabled = true;
        
        setTimeout(() => {
            createPrintableOffer();
            
            btn.textContent = originalText;
            btn.disabled = false;
            
            showToast('📄 Angebot als Textdatei heruntergeladen!', 'success');
        }, 1000);
    }
}

function createPrintableOffer() {
    // TODO: Backend-Integration - PDF-Generierung
    createTextOffer();
}

function createTextOffer() {
    const costs = calculateDetailedCosts();
    const today = new Date().toLocaleDateString('de-DE');
    
    // Produktliste für den Druck vorbereiten
    const productList = Object.entries(selectedProducts).map(([name, qty]) => {
        const price = productPrices[name] || 0;
        let cost, description;
        
        if (name.includes('Flatcube')) {
            cost = qty * price * costs.days;
            const pieces = qty * 5;
            description = `${qty} Set${qty > 1 ? 's' : ''} ${name} (${pieces} Stück) - ${cost.toFixed(2)}€`;
        } else {
            cost = qty * price * costs.days;
            description = `${qty}x ${name} - ${cost.toFixed(2)}€`;
        }
        
        return description;
    });
    
    // Einfacher Textexport als Fallback
    const offerText = `
SWOOFLE Angebot - ${reservationCode}
Datum: ${today}

Mietdauer:
Von: ${selectedDates.start ? formatDateGerman(selectedDates.start) : '--'}
Bis: ${selectedDates.end ? formatDateGerman(selectedDates.end) : '--'}
Dauer: ${costs.days} Tag${costs.days !== 1 ? 'e' : ''}

Produkte:
${productList.join('\n')}

Kosten:
Produktkosten: ${costs.productCost.toFixed(2)}€
Versand: ${costs.shippingCost.toFixed(2)}€
Schutzpaket: ${costs.insuranceCost.toFixed(2)}€
Zwischensumme: ${costs.subtotal.toFixed(2)}€
MwSt. (19%): ${costs.vat.toFixed(2)}€
GESAMT: ${costs.total.toFixed(2)}€

SWOOFLE GmbH | info@swoofle.de
    `;
    
    // Textdatei zum Download anbieten als Fallback
    const blob = new Blob([offerText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWOOFLE-Angebot-${reservationCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return offerText;
}

// ===== TOAST NOTIFICATIONS - VERBESSERTE VERSION =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const colors = {
        'success': '#10b981',
        'error': '#ef4444', 
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: toastSlideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
            announcement.remove();
        }, 300);
    }, 4000);
}

function showValidationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <span aria-hidden="true">⚠️</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'errorSlideOut 0.3s ease-out forwards';
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

// ===== STATUS REGION FÜR SCREEN READER =====
// Erstelle einen unsichtbaren Status-Bereich für Screenreader
document.addEventListener('DOMContentLoaded', function() {
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('role', 'status');
    statusRegion.setAttribute('aria-live', 'polite');
    statusRegion.className = 'sr-only';
    document.body.appendChild(statusRegion);
});

// ===== DEBUGGING & LOGGING =====
window.bookingDebug = {
    getState: () => ({
        bookingFlow,
        currentStep,
        maxSteps,
        selectedDates,
        selectedProducts,
        selectedShipping,
        selectedInsurance,
        selectedCategories,
        reservationCode
    }),
    goToStep: (step) => goToStep(step),
    loadDemo: (code) => loadReservationData(code),
    resetSystem: () => {
        selectedDates = { start: null, end: null };
        selectedProducts = {};
        selectedShipping = { type: 'standard-de', price: 11.95 };
        selectedInsurance = {};
        selectedCategories = [];
        reservationCode = null;
        updateLiveSummary();
        updateSelectedDatesDisplay();
        console.log('🔄 System zurückgesetzt');
    }
};

console.log('🎯 Booking.js vollständig geladen - Version 2.1');
console.log('🔧 Debug-Funktionen verfügbar unter: window.bookingDebug');
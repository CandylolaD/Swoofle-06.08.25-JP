// ===== SCRIPT.JS - Index-spezifische Funktionen (KORRIGIERT) ===== 

// ===== GLOBAL STATE =====
let currentTheme = localStorage.getItem('swoofle-theme') || 'light';
let testimonialIndex = 0;
let inactivityTimer;

// Demo-Reservationen für Simulation - Synchron mit booking.js
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Index.js wird initialisiert...');
    
    initializeTheme();
    setupEventListeners();
    startTestimonialRotation();
    initializeFAQ();
    startChatbotTimer();
    setupQuickBookingModal();
    
    console.log('✅ Index.js vollständig geladen');
});

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
    console.log('🎨 Theme gewechselt zu:', currentTheme);
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

    // Chatbot input
    const chatInput = document.getElementById('chatbotInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleChatInput(e);
            }
        });
    }

    // Modal backdrop click for quick booking
    const quickModal = document.getElementById('quickBookingModal');
    if (quickModal) {
        quickModal.addEventListener('click', function(e) {
            if (e.target === quickModal) {
                closeQuickBooking();
            }
        });
    }
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

    // For all other actions preventDefault
    e.preventDefault();

    switch (action) {
        case 'toggle-theme':
            toggleTheme();
            break;
        case 'toggle-menu':
            toggleMobileMenu();
            break;
        case 'open-quick-booking':
            openQuickBooking();
            closeMobileMenu();
            break;
        case 'close-quick-booking':
            closeQuickBooking();
            break;
        case 'toggle-chatbot':
            toggleChatbot();
            break;
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

// ===== QUICK BOOKING MODAL SETUP =====
function setupQuickBookingModal() {
    // Verfügbarkeit prüfen Button
    const checkBtn = document.getElementById('checkAvailability');
    if (checkBtn) {
        checkBtn.addEventListener('click', handleAvailabilityCheck);
    }

    // Reservierungscode laden Button
    const loadBtn = document.getElementById('loadReservation');
    if (loadBtn) {
        loadBtn.addEventListener('click', handleReservationCodeLoad);
    }

    // Demo Code Buttons
    document.querySelectorAll('.demo-code-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.dataset.code;
            if (code) {
                document.getElementById('quickReservationCode').value = code;
                handleReservationCodeLoad();
            }
        });
    });

    // Input validations
    setupQuickBookingValidations();
}

function setupQuickBookingValidations() {
    const startInput = document.getElementById('quickStartDate');
    const endInput = document.getElementById('quickEndDate');
    const codeInput = document.getElementById('quickReservationCode');
    const checkBtn = document.getElementById('checkAvailability');
    const loadBtn = document.getElementById('loadReservation');

    function validateDateInputs() {
        const hasValidDates = startInput?.value && endInput?.value && 
                             new Date(startInput.value) < new Date(endInput.value);
        
        if (checkBtn) {
            checkBtn.disabled = !hasValidDates;
        }
    }

    function validateCodeInput() {
        const hasValidCode = codeInput?.value?.trim().length >= 6;
        
        if (loadBtn) {
            loadBtn.disabled = !hasValidCode;
        }
    }

    // Event Listeners für Input Validation
    [startInput, endInput].forEach(input => {
        if (input) {
            input.addEventListener('input', validateDateInputs);
            input.addEventListener('change', validateDateInputs);
        }
    });

    if (codeInput) {
        codeInput.addEventListener('input', validateCodeInput);
        codeInput.addEventListener('change', validateCodeInput);
        
        // Enter key handling
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !loadBtn.disabled) {
                handleReservationCodeLoad();
            }
        });
    }

    // Date change handlers
    if (startInput) {
        startInput.addEventListener('change', function() {
            updateEndDateMin();
            clearDateErrors();
        });
    }
    
    if (endInput) {
        endInput.addEventListener('change', function() {
            clearDateErrors();
        });
    }

    // Initial validation
    validateDateInputs();
    validateCodeInput();
}

// ===== QUICK BOOKING FUNCTIONALITY =====
function handleAvailabilityCheck() {
    const startDate = document.getElementById('quickStartDate')?.value;
    const endDate = document.getElementById('quickEndDate')?.value;
    
    if (!startDate || !endDate) {
        showToast('Bitte wähle Start- und Enddatum aus.', 'error');
        return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
        showToast('Das Enddatum muss nach dem Startdatum liegen.', 'error');
        return;
    }
    
    // Get selected categories
    const selectedCategories = getSelectedCategories();
    
    // Success feedback
    showToast('Verfügbarkeit geprüft! Weiterleitung zur Buchung...', 'success');
    
    // Build URL with parameters
    let url = `booking.html?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    if (selectedCategories.length > 0) {
        url += `&categories=${encodeURIComponent(selectedCategories.join(','))}`;
    }
    
    // Redirect after short delay for UX
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
    
    console.log('🚀 Weiterleitung zu booking.html mit:', { startDate, endDate, categories: selectedCategories });
}

function handleReservationCodeLoad() {
    const code = document.getElementById('quickReservationCode')?.value?.trim()?.toUpperCase();
    
    if (!code) {
        showToast('Bitte gib einen Reservierungscode ein.', 'error');
        return;
    }
    
    // Check if reservation code exists (Demo simulation)
    if (demoReservations[code]) {
        const input = document.getElementById('quickReservationCode');
        
        // Success visual feedback
        if (input) {
            input.style.borderColor = '#10b981';
            input.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        }
        
        showToast('Reservierung gefunden! Weiterleitung...', 'success');
        
        // Redirect with reservation code
        setTimeout(() => {
            window.location.href = `booking.html?code=${encodeURIComponent(code)}`;
        }, 1000);
        
        console.log('🎫 Reservierungscode gefunden:', code, demoReservations[code]);
    } else {
        // Error feedback
        const input = document.getElementById('quickReservationCode');
        if (input) {
            input.style.borderColor = '#ef4444';
            input.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            
            // Auto-reset after 3 seconds
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
            }, 3000);
        }
        
        showToast('Reservierungscode nicht gefunden. Bitte prüfe die Eingabe.', 'error');
        console.log('❌ Reservierungscode nicht gefunden:', code);
    }
}

function getSelectedCategories() {
    const categories = [];
    document.querySelectorAll('.category-option input[type="checkbox"]:checked').forEach(checkbox => {
        categories.push(checkbox.value);
    });
    return categories;
}

function updateEndDateMin() {
    const startDate = document.getElementById('quickStartDate')?.value;
    const endDateInput = document.getElementById('quickEndDate');
    
    if (startDate && endDateInput) {
        endDateInput.min = startDate;
        if (endDateInput.value && new Date(endDateInput.value) <= new Date(startDate)) {
            endDateInput.value = '';
        }
    }
}

function clearDateErrors() {
    ['quickStartDate', 'quickEndDate'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.style.borderColor = '';
            input.style.background = '';
        }
    });
}

function openQuickBooking() {
    const modal = document.getElementById('quickBookingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        resetQuickBookingForm();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const startInput = document.getElementById('quickStartDate');
        const endInput = document.getElementById('quickEndDate');
        
        if (startInput) startInput.min = today;
        if (endInput) endInput.min = today;
        
        // Focus first input after animation
        setTimeout(() => {
            startInput?.focus();
        }, 500);
        
        console.log('📱 Quick Booking Modal geöffnet');
    }
}

function resetQuickBookingForm() {
    // Clear inputs
    const inputs = ['quickReservationCode', 'quickStartDate', 'quickEndDate'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.style.borderColor = '';
            input.style.background = '';
        }
    });
    
    // Clear category selections
    document.querySelectorAll('.category-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset button states
    const checkBtn = document.getElementById('checkAvailability');
    const loadBtn = document.getElementById('loadReservation');
    
    if (checkBtn) checkBtn.disabled = true;
    if (loadBtn) loadBtn.disabled = true;
    
    console.log('🔄 Quick Booking Form zurückgesetzt');
}

function closeQuickBooking() {
    const modal = document.getElementById('quickBookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after animation
        setTimeout(resetQuickBookingForm, 300);
        
        console.log('❌ Quick Booking Modal geschlossen');
    }
}

// ===== TESTIMONIALS =====
function startTestimonialRotation() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length <= 1) return;
    
    setInterval(() => {
        testimonials[testimonialIndex].classList.remove('active');
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        testimonials[testimonialIndex].classList.add('active');
    }, 4000);
    
    console.log('🔄 Testimonial Rotation gestartet');
}

// ===== FAQ =====
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const wasActive = item.classList.contains('active');
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Update aria-expanded
            question.setAttribute('aria-expanded', !wasActive);
            
            console.log(`❓ FAQ ${wasActive ? 'geschlossen' : 'geöffnet'}:`, question.textContent.substring(0, 50));
        });
    });
}

// ===== CHATBOT =====
function startChatbotTimer() {
    resetChatbotTimer();
    ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, resetChatbotTimer);
    });
}

function resetChatbotTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const chatWindow = document.getElementById('chatbotWindow');
        if (chatWindow && !chatWindow.classList.contains('active')) {
            toggleChatbot();
        }
    }, 120000); // 2 minutes
}

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    if (chatWindow) {
        const isActive = chatWindow.classList.toggle('active');
        console.log(`💬 Chatbot ${isActive ? 'geöffnet' : 'geschlossen'}`);
    }
}

function handleChatInput(e) {
    const message = e.target.value.trim();
    if (!message) return;
    
    addChatMessage(message, 'user');
    e.target.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            'Gerne helfe ich dir bei der Auswahl!',
            'Hast du Fragen zu unseren Produkten?',
            'Benötigst du Unterstützung beim Booking?',
            'Wie kann ich dir weiterhelfen?',
            'Möchtest du mehr über unsere FlatCubes erfahren?',
            'Brauchst du Hilfe bei der Terminwahl?'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Variable delay for realism
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'chatbot-message';
    
    if (sender === 'user') {
        div.style.background = 'var(--accent-orange)';
        div.style.color = 'white';
        div.style.marginLeft = '20px';
        div.style.textAlign = 'right';
    }
    
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    console.log(`💬 ${sender}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
}

// ===== PRODUCT CARD INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Product card click handlers
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                openQuickBooking();
                
                // Pre-select category after modal opens
                setTimeout(() => {
                    const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
                    if (categoryCheckbox) {
                        categoryCheckbox.checked = true;
                        console.log(`✅ Kategorie vorausgewählt: ${category}`);
                    }
                }, 500);
            } else {
                // Fallback: just open booking
                openQuickBooking();
            }
        });
    });
});

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                console.log('🎯 Smooth scroll zu:', targetId);
            }
        });
    });
});

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
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
        z-index: 10001;
        animation: toastSlideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after delay
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, type === 'error' ? 5000 : 3000); // Errors stay longer
    
    console.log(`🍞 Toast (${type}): ${message}`);
}

// ===== UTILITY FUNCTIONS =====
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

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    // Don't show errors to users in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        showToast('Ein Fehler ist aufgetreten. Prüfe die Konsole.', 'error');
    }
});

// ===== DEBUGGING =====
window.indexDebug = {
    getState: () => ({
        currentTheme,
        testimonialIndex,
        demoReservations: Object.keys(demoReservations)
    }),
    openBooking: () => openQuickBooking(),
    closeBooking: () => closeQuickBooking(),
    testToast: (message, type) => showToast(message, type),
    testReservation: (code) => {
        document.getElementById('quickReservationCode').value = code;
        handleReservationCodeLoad();
    }
};

console.log('🎯 Index.js vollständig geladen');
console.log('🔧 Debug-Funktionen verfügbar unter: window.indexDebug');
// ===== CUSTOMER SUPPORT PAGE FUNCTIONALITY =====
// Erweitert mit Theme-Management und Navigation

// ===== GLOBAL STATE MANAGEMENT =====
let searchTimeout;
let currentSearchQuery = '';
let isSearching = false;
let currentTheme = localStorage.getItem('swoofle-theme') || 'light';

// ===== DUMMY DATA - später durch API-Calls ersetzen =====
const helpContent = {
    // TODO: API-Integration - GET /api/faqs
    faqs: [
        {
            id: 'rental',
            question: 'Wie miete ich Eventmöbel?',
            answer: 'Um Eventmöbel zu mieten, durchstöbern Sie unsere Auswahl online, wählen Sie die gewünschten Artikel und Mengen aus, fügen Sie sie Ihrem Warenkorb hinzu und folgen Sie dem Bestellvorgang. Sie können auch unser Kundenservice-Team kontaktieren, um persönliche Unterstützung zu erhalten.',
            keywords: ['mieten', 'eventmöbel', 'bestellung', 'warenkorb', 'kundenservice'],
            category: 'rental',
            views: 1247,
            helpful_votes: 89
        },
        {
            id: 'delivery',
            question: 'Was sind die Lieferbedingungen?',
            answer: 'Wir bieten verschiedene Lieferoptionen: Standardversand (1-3 Werktage), Expressversand (24h) und Same-Day-Delivery in ausgewählten Städten. Die Lieferung erfolgt bis zur Bordsteinkante. Aufbau-Service ist gegen Aufpreis verfügbar.',
            keywords: ['lieferung', 'versand', 'express', 'same-day', 'aufbau', 'service'],
            category: 'delivery',
            views: 967,
            helpful_votes: 73
        },
        {
            id: 'modification',
            question: 'Wie kann ich meine Bestellung ändern oder stornieren?',
            answer: 'Bestellungen können bis 24 Stunden vor dem Liefertermin kostenfrei geändert oder storniert werden. Kontaktieren Sie dazu unseren Kundenservice oder nutzen Sie Ihr Online-Kundenkonto. Bei kurzfristigeren Änderungen können Gebühren anfallen.',
            keywords: ['bestellung', 'ändern', 'stornieren', 'kundenkonto', 'gebühren'],
            category: 'orders',
            views: 834,
            helpful_votes: 65
        },
        {
            id: 'payment',
            question: 'Welche Zahlungsmethoden werden akzeptiert?',
            answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden: Kreditkarte (Visa, Mastercard), PayPal, SEPA-Lastschrift, Sofortüberweisung und Rechnung (für Geschäftskunden). Alle Zahlungen werden sicher verschlüsselt übertragen.',
            keywords: ['zahlung', 'kreditkarte', 'paypal', 'lastschrift', 'rechnung', 'sicher'],
            category: 'payment',
            views: 723,
            helpful_votes: 58
        }
    ],
    
    // TODO: API-Integration - GET /api/articles
    articles: [
        {
            id: 'return-guide',
            title: 'Wie man einen Artikel zurückgibt',
            description: 'Erfahren Sie, wie Sie einen online oder im Geschäft gekauften Artikel zurückgeben können.',
            keywords: ['rückgabe', 'artikel', 'online', 'geschäft'],
            category: 'returns',
            read_time: '3 min',
            thumbnail: 'placeholder-return.svg'
        },
        {
            id: 'cancel-order',
            title: 'Wie man eine Bestellung storniert',
            description: 'Erfahren Sie, wie Sie eine online aufgegebene Bestellung stornieren können.',
            keywords: ['bestellung', 'stornieren', 'online'],
            category: 'orders',
            read_time: '2 min',
            thumbnail: 'placeholder-cancel.svg'
        },
        {
            id: 'track-order',
            title: 'Wie man eine Bestellung verfolgt',
            description: 'Erfahren Sie, wie Sie eine online aufgegebene Bestellung verfolgen können.',
            keywords: ['bestellung', 'verfolgen', 'tracking', 'online'],
            category: 'orders',
            read_time: '4 min',
            thumbnail: 'placeholder-track.svg'
        }
    ],
    
    // TODO: API-Integration - GET /api/videos
    videos: [
        {
            id: 'select-furniture',
            title: 'Wie man Eventmöbel auswählt',
            description: 'Ein kurzes Video, das Ihnen zeigt, wie Sie die perfekten Möbel für Ihre Veranstaltung auswählen.',
            keywords: ['eventmöbel', 'auswählen', 'veranstaltung', 'perfekt'],
            duration: '3:24',
            thumbnail: 'video-select-thumb.jpg',
            video_url: 'https://example.com/videos/select-furniture'
        },
        {
            id: 'place-order',
            title: 'Wie man eine Bestellung aufgibt',
            description: 'Eine Schritt-für-Schritt-Anleitung, wie Sie Ihre Bestellung online aufgeben können.',
            keywords: ['bestellung', 'aufgeben', 'online', 'anleitung'],
            duration: '2:15',
            thumbnail: 'video-order-thumb.jpg',
            video_url: 'https://example.com/videos/place-order'
        }
    ],
    
    // TODO: API-Integration - GET /api/topics
    topics: {
        payments: {
            title: 'Zahlungen',
            icon: 'credit-card',
            articles: ['Zahlungsmethoden', 'Rechnung', 'Steuern', 'Rückerstattung', 'SEPA-Lastschrift', 'PayPal-Probleme'],
            article_count: 12
        },
        orders: {
            title: 'Bestellungen',
            icon: 'shopping-bag',
            articles: ['Bestellung aufgeben', 'Bestellung ändern', 'Bestellung stornieren', 'Bestellhistorie', 'Mengenrabatte'],
            article_count: 15
        },
        shipping: {
            title: 'Versand',
            icon: 'truck',
            articles: ['Lieferzeiten', 'Versandkosten', 'Tracking', 'Lieferadresse ändern', 'Expressversand'],
            article_count: 8
        },
        Nachhaltigkeit: {
            title: 'Nachhaltigkeit',
            icon: 'user',
            articles: ['Nachhaltige Materialien', 'Recycling', 'Umweltschutz', 'CO2-Neutralität'],
            article_count: 6
        },
        Produktinformation: {
            title: 'Produktinformation',
            icon: 'info',
            articles: ['FlatCube Specs', 'Aufbauanleitung', 'Pflege', 'Garantie'],
            article_count: 8
        }
    }
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHelpPage();
});

// ===== INITIALIZATION =====
function initializeHelpPage() {
    console.log('🚀 Initializing Help Center...');
    
    try {
        // Theme initialisieren ZUERST
        initializeTheme();
        
        // Dann die anderen Funktionalitäten
        setupEventListeners();
        setupSearchFunctionality();
        setupFAQFunctionality();
        setupTopicCards();
        setupModalFunctionality();
        setupTouchEvents(); // Mobile optimization
        
        // Analytics: Page loaded
        // TODO: API-Integration - POST /api/analytics/pageview
        trackEvent('help_center_loaded', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
        
        console.log('✅ Help Center initialized successfully');
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Willkommen im Hilfebereich! 👋', 'info');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error initializing Help Center:', error);
        showNotification('Es gab ein Problem beim Laden des Hilfebereichs.', 'error');
    }
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    console.log('🎨 Initializing theme:', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('swoofle-theme', currentTheme);
    updateThemeIcon();
    
    console.log('🎨 Theme switched to:', currentTheme);
    
    // Analytics: Theme changed
    trackEvent('theme_changed', { theme: currentTheme });
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ===== MOBILE MENU MANAGEMENT =====
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    
    if (hamburger && menu) {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        
        console.log('📱 Mobile menu toggled:', menu.classList.contains('active'));
        
        // Analytics: Menu usage
        trackEvent('mobile_menu_toggled', { 
            is_open: menu.classList.contains('active')
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    
    if (hamburger && menu) {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
        
        console.log('📱 Mobile menu closed');
    }
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Global Click Handler für data-action Attribute
    document.addEventListener('click', handleGlobalClick);
    
    // Search input with improved UX
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        // Real-time search with debouncing
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            clearTimeout(searchTimeout);
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => handleSearch(query), 300);
            } else {
                hideSuggestions();
            }
        });
        
        // Enter key handling
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    handleSearch(query, true); // Force search
                }
            }
        });
        
        // Focus and blur events for better UX
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            // Hide suggestions after a delay to allow clicking
            setTimeout(hideSuggestions, 200);
        });
    }

    // FAQ items - using native details/summary for better accessibility
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                const faqId = this.dataset.faq;
                
                // Analytics: FAQ opened
                // TODO: API-Integration - POST /api/analytics/faq_opened
                trackFAQOpen(faqId);
                
                // Close other FAQs for accordion behavior
                faqItems.forEach(otherItem => {
                    if (otherItem !== this && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });

    // Topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        card.addEventListener('click', handleTopicClick);
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTopicClick.call(this, e);
            }
        });
    });

    // Article cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('click', handleArticleClick);
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleArticleClick.call(this, e);
            }
        });
    });

    // Video cards
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', handleVideoClick);
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleVideoClick.call(this, e);
            }
        });
    });

    // Modal close functionality
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.search-modal, .contact-modal, .callback-modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('search-modal') || 
            e.target.classList.contains('contact-modal') || 
            e.target.classList.contains('callback-modal')) {
            closeModal(e.target);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Contact options
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', function() {
            const contactType = this.dataset.contact;
            handleContactMethod(contactType);
        });
    });
}

// ===== GLOBAL CLICK HANDLER für data-action =====
function handleGlobalClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    console.log('🎯 Action triggered:', action);

    // Spezielle Behandlung für close-menu bei echten Links
    if (action === 'close-menu') {
        const element = e.target.closest('[data-action]');
        const href = element.getAttribute('href');
        
        // Wenn es ein echter Link ist, erlaube Navigation
        if (href && href !== '#' && !href.startsWith('#')) {
            closeMobileMenu();
            return; // Lasse den Link normal funktionieren
        } else {
            e.preventDefault();
            closeMobileMenu();
            return;
        }
    }

    // Für alle anderen Aktionen preventDefault
    e.preventDefault();

    switch (action) {
        case 'toggle-theme':
            toggleTheme();
            break;
        case 'toggle-menu':
            toggleMobileMenu();
            break;
        case 'open-booking-tool':
            // Weiterleitung zur Hauptseite mit Booking Tool
            window.location.href = 'index.html#booking';
            break;
        default:
            console.log('⚠️ Unhandled action:', action);
            break;
    }
}

// ===== TOUCH EVENTS FOR MOBILE =====
function setupTouchEvents() {
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll(
        '.topic-card, .article-card, .video-card, .contact-option, .result-item'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearchFunctionality() {
    console.log('🔍 Setting up search functionality...');
    
    // Create suggestions container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !document.getElementById('searchSuggestions')) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.id = 'searchSuggestions';
        suggestionsDiv.className = 'search-suggestions';
        searchContainer.appendChild(suggestionsDiv);
    }
}

async function handleSearch(query, forceSearch = false) {
    if (!query || query.length < 2) return;
    
    currentSearchQuery = query;
    isSearching = true;
    
    console.log('🔍 Searching for:', query);
    
    try {
        // Show loading state
        if (forceSearch) {
            showSearchLoading();
        } else {
            showSearchSuggestions(query);
        }
        
        // TODO: API-Integration - GET /api/search/help?q=${query}
        // const response = await fetch(`/api/search/help?q=${encodeURIComponent(query)}`);
        // const results = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use dummy data for now
        const results = await performSearch(query);
        
        if (forceSearch) {
            displaySearchResults(results, query);
        } else {
            updateSearchSuggestions(results, query);
        }
        
        // Analytics: Search performed
        // TODO: API-Integration - POST /api/analytics/search
        trackSearch(query, getTotalResultCount(results));
        
    } catch (error) {
        console.error('❌ Search error:', error);
        showNotification('Suchfehler aufgetreten. Bitte versuchen Sie es erneut.', 'error');
        
        // TODO: API-Integration - POST /api/errors/search
        // logError('search_error', error, { query });
        
    } finally {
        isSearching = false;
    }
}

async function performSearch(query) {
    // TODO: Replace with real API call
    const results = { faqs: [], articles: [], videos: [], topics: [] };
    const queryLower = query.toLowerCase();
    
    // Search FAQs
    helpContent.faqs.forEach(faq => {
        const searchText = (faq.question + ' ' + faq.answer + ' ' + faq.keywords.join(' ')).toLowerCase();
        if (searchText.includes(queryLower)) {
            results.faqs.push({
                ...faq,
                relevance: calculateRelevance(searchText, queryLower)
            });
        }
    });
    
    // Search Articles
    helpContent.articles.forEach(article => {
        const searchText = (article.title + ' ' + article.description + ' ' + article.keywords.join(' ')).toLowerCase();
        if (searchText.includes(queryLower)) {
            results.articles.push({
                ...article,
                relevance: calculateRelevance(searchText, queryLower)
            });
        }
    });
    
    // Search Videos
    helpContent.videos.forEach(video => {
        const searchText = (video.title + ' ' + video.description + ' ' + video.keywords.join(' ')).toLowerCase();
        if (searchText.includes(queryLower)) {
            results.videos.push({
                ...video,
                relevance: calculateRelevance(searchText, queryLower)
            });
        }
    });
    
    // Search Topics
    Object.entries(helpContent.topics).forEach(([key, topic]) => {
        const searchText = (topic.title + ' ' + topic.articles.join(' ')).toLowerCase();
        if (searchText.includes(queryLower)) {
            results.topics.push({
                ...topic, 
                key,
                relevance: calculateRelevance(searchText, queryLower)
            });
        }
    });
    
    // Sort by relevance
    Object.keys(results).forEach(category => {
        results[category].sort((a, b) => b.relevance - a.relevance);
    });
    
    return results;
}

function calculateRelevance(text, query) {
    // Simple relevance scoring - in real app, use more sophisticated algorithm
    let score = 0;
    const words = query.split(' ');
    
    words.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        if (matches) {
            score += matches.length;
        }
    });
    
    return score;
}

function getTotalResultCount(results) {
    return results.faqs.length + results.articles.length + results.videos.length + results.topics.length;
}

function showSearchLoading() {
    const modal = document.getElementById('searchModal');
    const resultsContainer = document.getElementById('searchResults');
    
    resultsContainer.innerHTML = `
        <div class="search-loading">
            <div class="loading-spinner"></div>
            <p>Suche läuft...</p>
        </div>
    `;
    
    openModal(modal);
}

function showSearchSuggestions(query) {
    // Quick suggestions based on query
    const suggestions = getQuickSuggestions(query);
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (suggestions.length > 0 && suggestionsContainer) {
        const html = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.classList.add('active');
    }
}

function getQuickSuggestions(query) {
    const suggestions = [
        'Bestellung stornieren',
        'Lieferung verfolgen', 
        'Zahlungsmethoden',
        'Rückgabe beantragen',
        'Kundenkonto erstellen',
        'Eventmöbel mieten',
        'FlatCube aufbauen',
        'Express versand',
        'Rechnung anfordern',
        'Kontakt aufnehmen'
    ];
    
    return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        searchInput.value = suggestion;
        handleSearch(suggestion, true);
    }
    hideSuggestions();
}

function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
}

function updateSearchSuggestions(results, query) {
    // Update suggestions based on search results
    const totalResults = getTotalResultCount(results);
    
    if (totalResults > 0) {
        const suggestions = [];
        
        // Add top FAQ suggestions
        results.faqs.slice(0, 2).forEach(faq => {
            suggestions.push(faq.question);
        });
        
        // Add top article suggestions  
        results.articles.slice(0, 2).forEach(article => {
            suggestions.push(article.title);
        });
        
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            const html = suggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            
            suggestionsContainer.innerHTML = html;
            suggestionsContainer.classList.add('active');
        }
    }
}

function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');
    const totalResults = getTotalResultCount(results);
    
    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h4>Keine Ergebnisse gefunden</h4>
                <p>Für "${query}" wurden keine passenden Inhalte gefunden.</p>
                <p>Versuchen Sie es mit anderen Suchbegriffen oder kontaktieren Sie uns direkt.</p>
                <button onclick="contactSupport()" class="contact-btn">Support kontaktieren</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="search-results-header">
            <h4>${totalResults} Ergebnis${totalResults !== 1 ? 'se' : ''} für "${query}"</h4>
        </div>
    `;
    
    // Display FAQ results
    if (results.faqs.length > 0) {
        html += '<div class="result-section"><h5>Häufig gestellte Fragen</h5>';
        results.faqs.forEach(faq => {
            html += `
                <div class="result-item" onclick="scrollToFAQ('${faq.id}')">
                    <h6>${highlightSearchTerm(faq.question, query)}</h6>
                    <p>${highlightSearchTerm(truncateText(faq.answer, 150), query)}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Display article results
    if (results.articles.length > 0) {
        html += '<div class="result-section"><h5>Artikel</h5>';
        results.articles.forEach(article => {
            html += `
                <div class="result-item" onclick="openArticle('${article.id}')">
                    <h6>📄 ${highlightSearchTerm(article.title, query)}</h6>
                    <p>${highlightSearchTerm(article.description, query)}</p>
                    <small>Lesezeit: ${article.read_time || '3 min'}</small>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Display video results
    if (results.videos.length > 0) {
        html += '<div class="result-section"><h5>Videos</h5>';
        results.videos.forEach(video => {
            html += `
                <div class="result-item" onclick="playVideo('${video.id}')">
                    <h6>🎥 ${highlightSearchTerm(video.title, query)}</h6>
                    <p>${highlightSearchTerm(video.description, query)}</p>
                    <small>Dauer: ${video.duration}</small>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Display topic results
    if (results.topics.length > 0) {
        html += '<div class="result-section"><h5>Themen</h5>';
        results.topics.forEach(topic => {
            html += `
                <div class="result-item" onclick="openTopic('${topic.key}')">
                    <h6>📋 ${highlightSearchTerm(topic.title, query)}</h6>
                    <p>${topic.article_count} Artikel verfügbar</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    resultsContainer.innerHTML = html;
}

// ===== FAQ FUNCTIONALITY =====
function setupFAQFunctionality() {
    console.log('❓ Setting up FAQ functionality...');
    
    // FAQ items are now using native details/summary
    // Additional setup can be done here if needed
}

function scrollToFAQ(faqId) {
    closeAllModals();
    
    setTimeout(() => {
        const faqItem = document.querySelector(`[data-faq="${faqId}"]`);
        if (faqItem) {
            // Open the FAQ
            faqItem.open = true;
            
            // Scroll to view
            faqItem.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight effect
            faqItem.style.borderColor = 'var(--help-accent)';
            faqItem.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                faqItem.style.borderColor = '';
                faqItem.style.transform = '';
            }, 1000);
            
            // Analytics: FAQ accessed via search
            // TODO: API-Integration - POST /api/analytics/faq_accessed
            trackEvent('faq_accessed_via_search', { faq_id: faqId });
        }
    }, 100);
}

// ===== TOPIC FUNCTIONALITY =====
function setupTopicCards() {
    console.log('📋 Setting up topic cards...');
    
    // Additional topic setup if needed
}

function handleTopicClick(event) {
    const topicCard = event.currentTarget;
    const topicType = topicCard.dataset.topic;
    
    // Visual feedback
    topicCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        topicCard.style.transform = '';
    }, 150);
    
    // Analytics: Topic clicked
    // TODO: API-Integration - POST /api/analytics/topic_clicked
    trackEvent('topic_clicked', { topic: topicType });
    
    openTopic(topicType);
}

function openTopic(topicKey) {
    const topic = helpContent.topics[topicKey];
    if (!topic) {
        console.warn('❌ Topic not found:', topicKey);
        showNotification('Thema nicht gefunden', 'error');
        return;
    }
    
    showNotification(`${topic.title} wird geladen...`, 'info');
    
    // TODO: API-Integration - GET /api/topics/${topicKey}
    // const topicData = await fetch(`/api/topics/${topicKey}`).then(r => r.json());
    
    // For demo: show topic content in search modal
    const modal = document.getElementById('searchModal');
    const resultsContainer = document.getElementById('searchResults');
    
    resultsContainer.innerHTML = `
        <div class="topic-detail">
            <h4>📋 ${topic.title}</h4>
            <p>Hier finden Sie alle ${topic.article_count} Artikel zum Thema ${topic.title}:</p>
            <ul class="topic-articles">
                ${topic.articles.map(article => `
                    <li onclick="openArticle('${slugify(article)}')" title="Artikel öffnen: ${article}">
                        📄 ${article}
                    </li>
                `).join('')}
            </ul>
            <div style="margin-top: 1.5rem; text-align: center;">
                <button onclick="contactSupport()" class="contact-btn">
                    Weitere Hilfe benötigt?
                </button>
            </div>
        </div>
    `;
    
    openModal(modal);
}

// ===== ARTICLE & VIDEO FUNCTIONALITY =====
function handleArticleClick(event) {
    const articleCard = event.currentTarget;
    const articleId = articleCard.dataset.article;
    
    // Visual feedback
    articleCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        articleCard.style.transform = '';
    }, 150);
    
    openArticle(articleId);
}

function handleVideoClick(event) {
    const videoCard = event.currentTarget;
    const videoId = videoCard.dataset.video;
    
    // Visual feedback
    videoCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        videoCard.style.transform = '';
    }, 150);
    
    playVideo(videoId);
}

function openArticle(articleId) {
    console.log('📄 Opening article:', articleId);
    
    showNotification(`Artikel wird geöffnet...`, 'info');
    
    // Analytics: Article opened
    // TODO: API-Integration - POST /api/analytics/article_opened
    trackEvent('article_opened', { article_id: articleId });
    
    // Simulate article opening
    setTimeout(() => {
        showNotification('In der finalen Version würde hier der vollständige Artikel angezeigt.', 'info');
    }, 1500);
}

function playVideo(videoId) {
    console.log('🎥 Playing video:', videoId);
    
    showNotification(`Video wird geladen...`, 'info');
    
    // Analytics: Video played
    // TODO: API-Integration - POST /api/analytics/video_played
    trackEvent('video_played', { video_id: videoId });
    
    // Simulate video loading
    setTimeout(() => {
        showNotification('In der finalen Version würde hier das Video im Player geöffnet.', 'info');
    }, 1500);
}

// ===== MODAL FUNCTIONALITY =====
function setupModalFunctionality() {
    console.log('🪟 Setting up modal functionality...');
    
    // Contact options handling
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        // Keyboard support
        option.setAttribute('tabindex', '0');
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const contactType = this.dataset.contact;
                handleContactMethod(contactType);
            }
        });
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, [tabindex]');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    openModal(modal);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    closeModal(modal);
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    closeModal(modal);
}

function openCallbackModal() {
    const modal = document.getElementById('callbackModal');
    openModal(modal);
}

function closeCallbackModal() {
    const modal = document.getElementById('callbackModal');
    closeModal(modal);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.search-modal, .contact-modal, .callback-modal');
    modals.forEach(closeModal);
}

function handleContactMethod(method) {
    console.log('📞 Contact method selected:', method);
    
    let message = '';
    
    switch (method) {
        case 'email':
            message = 'E-Mail Client wird geöffnet...';
            // TODO: API-Integration - Track email contact
            setTimeout(() => {
                // In real app: window.location.href = 'mailto:support@swoofle.de';
                showNotification('In der finalen Version: mailto:support@swoofle.de', 'info');
            }, 1000);
            break;
            
        case 'phone':
            message = 'Telefonnummer wird gewählt...';
            // TODO: API-Integration - Track phone contact
            setTimeout(() => {
                // In real app: window.location.href = 'tel:+4930123456789';
                showNotification('In der finalen Version: tel:+4930123456789', 'info');
            }, 1000);
            break;
            
        case 'callback':
            message = 'Rückruf-Formular wird geöffnet...';
            closeContactModal();
            setTimeout(() => {
                openCallbackModal();
            }, 300);
            break;
    }
    
    if (method !== 'callback') {
        showNotification(message, 'success');
        closeContactModal();
    }
    
    // Analytics: Contact method used
    // TODO: API-Integration - POST /api/analytics/contact_method
    trackEvent('contact_method_used', { method });
}

// ===== CALLBACK FORM FUNCTIONALITY =====
async function submitCallbackRequest() {
    console.log('📋 Submitting callback request...');
    
    const form = {
        name: document.getElementById('callbackName').value.trim(),
        phone: document.getElementById('callbackPhone').value.trim(),
        time: document.getElementById('callbackTime').value,
        message: document.getElementById('callbackMessage').value.trim()
    };
    
    // Validation
    if (!form.name || !form.phone) {
        showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(form.phone)) {
        showNotification('Bitte geben Sie eine gültige Telefonnummer ein.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        showNotification('Rückruf-Anfrage erfolgreich versendet! Wir melden uns in Kürze.', 'success');
        closeCallbackModal();
        
        // Clear form
        document.getElementById('callbackName').value = '';
        document.getElementById('callbackPhone').value = '';
        document.getElementById('callbackTime').value = 'sofort';
        document.getElementById('callbackMessage').value = '';
        
        // Analytics: Callback requested
        // TODO: API-Integration - POST /api/analytics/callback_requested
        trackEvent('callback_requested', {
            preferred_time: form.time,
            has_message: !!form.message
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('❌ Callback request error:', error);
        showNotification('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.', 'error');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.help-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `help-notification help-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.25rem;
        border-radius: var(--help-radius-lg);
        box-shadow: var(--help-shadow-strong);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1.4;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: 'var(--help-accent)'
    };
    return colors[type] || colors.info;
}

function contactSupport() {
    closeAllModals();
    setTimeout(() => {
        openContactModal();
    }, 300);
}

function highlightSearchTerm(text, term) {
    if (!term || term.length < 2) return text;
    
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--help-accent-light); color: var(--help-accent); padding: 2px 4px; border-radius: 3px;">$1</mark>');
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ===== ANALYTICS & TRACKING FUNCTIONS =====
function trackEvent(eventName, properties = {}) {
    console.log('📊 Analytics Event:', eventName, properties);
    
    // TODO: API-Integration - POST /api/analytics/events
}

function trackSearch(query, resultCount) {
    trackEvent('help_search', {
        query: query,
        result_count: resultCount,
        has_results: resultCount > 0
    });
}

function trackFAQOpen(faqId) {
    trackEvent('faq_opened', {
        faq_id: faqId
    });
}

// ===== ERROR HANDLING & LOGGING =====
function logError(errorType, error, context = {}) {
    console.error(`❌ ${errorType}:`, error, context);
    
    // TODO: API-Integration - POST /api/errors/log
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.closeSearchModal = closeSearchModal;
window.openCallbackModal = openCallbackModal;
window.closeCallbackModal = closeCallbackModal;
window.contactSupport = contactSupport;
window.scrollToFAQ = scrollToFAQ;
window.openTopic = openTopic;
window.openArticle = openArticle;
window.playVideo = playVideo;
window.selectSuggestion = selectSuggestion;
window.submitCallbackRequest = submitCallbackRequest;

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    logError('uncaught_error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    logError('unhandled_promise_rejection', event.reason);
});

console.log('🎯 Help Center JavaScript loaded successfully!');
 // Theme Toggle funktionality
        document.addEventListener('DOMContentLoaded', function() {
            
            // Theme Toggle
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle?.querySelector('.theme-icon');
            
            if (themeToggle && themeIcon) {
                // Load saved theme
                const savedTheme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', savedTheme);
                themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
                
                // Theme toggle event
                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                });
            }
            
            // Mobile Menu Toggle
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('navMenu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', (e) => {
                    e.preventDefault();
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }
            
            // CAPTCHA Logic
            function generateCaptcha() {
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                
                const captchaNum1 = document.getElementById('captchaNum1');
                const captchaNum2 = document.getElementById('captchaNum2');
                
                if (captchaNum1 && captchaNum2) {
                    captchaNum1.textContent = num1;
                    captchaNum2.textContent = num2;
                }
                
                return num1 + num2;
            }
            
            let correctAnswer = generateCaptcha();
            
            // Form Status Messages
            function showStatus(statusId, message, isSuccess) {
                const statusElement = document.getElementById(statusId);
                if (statusElement) {
                    statusElement.textContent = message;
                    statusElement.className = `status-message ${isSuccess ? 'status-success' : 'status-error'}`;
                    statusElement.style.display = 'block';
                    
                    setTimeout(() => {
                        statusElement.style.display = 'none';
                    }, 5000);
                }
            }

            // Pop-up Logic
            const callbackCheckbox = document.getElementById('callbackService');
            const callbackPopup = document.getElementById('callbackPopup');
            const popupClose = document.getElementById('popupClose');
            const callbackForm = document.getElementById('callbackForm');
            
            // Show/Hide Pop-up
            if (callbackCheckbox && callbackPopup) {
                callbackCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        callbackPopup.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
            
            // Close Pop-up
            if (popupClose && callbackPopup) {
                popupClose.addEventListener('click', function() {
                    callbackPopup.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    callbackCheckbox.checked = false;
                });
            }
            
            // Close Pop-up when clicking outside
            if (callbackPopup) {
                callbackPopup.addEventListener('click', function(e) {
                    if (e.target === callbackPopup) {
                        callbackPopup.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        callbackCheckbox.checked = false;
                    }
                });
            }
            
            // Callback Form Handling
            if (callbackForm) {
                callbackForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const phone = document.getElementById('callbackPhone').value.trim();
                    const time = document.getElementById('callbackTime').value;
                    
                    if (!phone || !time) {
                        showStatus('callbackStatus', 'Bitte füllen Sie alle Felder aus.', false);
                        return;
                    }
                    
                    // Simulate successful callback request
                    showStatus('callbackStatus', 'Rückruf-Anfrage erfolgreich übermittelt! Wir rufen Sie zur gewünschten Zeit zurück.', true);
                    
                    // Reset and close
                    setTimeout(() => {
                        callbackForm.reset();
                        callbackPopup.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        callbackCheckbox.checked = false;
                    }, 2000);
                });
            }
            
            // Contact Form Handling
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const captchaAnswer = parseInt(document.getElementById('captchaAnswer')?.value);
                    
                    if (captchaAnswer !== correctAnswer) {
                        showStatus('contactStatus', 'Die CAPTCHA-Antwort ist falsch. Bitte versuchen Sie es erneut.', false);
                        correctAnswer = generateCaptcha();
                        const captchaInput = document.getElementById('captchaAnswer');
                        if (captchaInput) captchaInput.value = '';
                        return;
                    }
                    
                    // Validate required fields
                    const requiredFields = this.querySelectorAll('[required]');
                    let allValid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            field.style.borderColor = 'var(--color-error)';
                            allValid = false;
                        } else {
                            field.style.borderColor = '';
                        }
                    });
                    
                    if (!allValid) {
                        showStatus('contactStatus', 'Bitte füllen Sie alle Pflichtfelder aus.', false);
                        return;
                    }
                    
                    // Simulate successful form submission
                    showStatus('contactStatus', 'Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt. Wir melden uns zeitnah bei Ihnen.', true);
                    
                    // Reset form
                    this.reset();
                    correctAnswer = generateCaptcha();
                });
            }
            
            // Generate new CAPTCHA when page loads
            correctAnswer = generateCaptcha();
        });
  
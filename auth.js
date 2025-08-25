// Student validation and session management
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

document.addEventListener('DOMContentLoaded', function() {
    // Check for existing session
    checkExistingSession();

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const studentId = document.getElementById('studentId').value.trim();
            const password = document.getElementById('password').value;

            // Check for empty fields
            if (!studentId || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Basic validation
            if (!validateStudentId(studentId)) {
                showToast('Please enter a valid 6-digit Student ID', 'error');
                document.getElementById('studentId').focus();
                return;
            }

            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
                submitBtn.disabled = true;

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Check credentials (in real app, this would be an API call)
                if (authenticateUser(studentId, password)) {
                    // Save session
                    const userData = {
                        studentId: studentId,
                        lastLogin: new Date().toISOString()
                    };
                    saveUserSession(userData);

                    showToast('Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = 'Dashboard.html';
                    }, 1000);
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                submitBtn.innerHTML = 'Log In';
                submitBtn.disabled = false;
                showToast(error.message, 'error');
            }
        });
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;

            // Simulate signup delay
            setTimeout(() => {
                window.location.href = 'Dashboard.html';
            }, 1500);
        });
    }

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Input focus effects with validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            if (this.id === 'studentId') {
                validateStudentId(this.value.trim());
            }
        });

        // Real-time validation
        input.addEventListener('input', function() {
            this.classList.remove('error');
            if (this.id === 'studentId') {
                this.value = this.value.replace(/[^0-9]/g, ''); // Only allow numbers
            }
        });
    });
});

// Validation functions
function validateStudentId(studentId) {
    return /^\d{6}$/.test(studentId); // 6-digit number
}

function authenticateUser(studentId, password) {
    // In a real app, this would be an API call
    return studentId === '403472' && password === 'demo123';
}

// Session management
function saveUserSession(userData) {
    const token = generateToken(userData);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
}

function checkExistingSession() {
    const isLoginPage = window.location.href.includes('login.html');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && isLoginPage) {
        // If user is logged in and tries to access login page, redirect to dashboard
        window.location.href = 'Dashboard.html';
    } else if (!isLoggedIn && !isLoginPage && !window.location.href.includes('signup.html')) {
        // If user is not logged in and tries to access any page except login/signup, redirect to login
        window.location.href = 'login.html';
    }
}

function clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('theme');
    
    // Redirect to login page if not already there
    if (!window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

function generateToken(userData) {
    // Simple token generation (in real app, use proper JWT)
    return btoa(JSON.stringify({
        ...userData,
        expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
    }));
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    // Trigger reflow to ensure animation plays
    toast.offsetHeight;
    
    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

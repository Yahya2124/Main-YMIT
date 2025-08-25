// Global variables
let currentPage = 'dashboard';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let notificationCount = 3;
let isLightTheme = false;

// Check login status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize the app
// This function sets up the initial state of the application
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        initializeApp();
    }
});

function initializeApp() {
    // Initialize calendar
    updateCalendar();

    // Initialize progress bars with animation
    setTimeout(() => {
        animateProgressBars();
    }, 500);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notification-btn') && !e.target.closest('.user-menu')) {
            closeAllDropdowns();
        }
    });

    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }

    // Add form submit handlers
    const assignmentForm = document.getElementById('assignmentForm');
    const profileForm = document.getElementById('profileForm');

    if (assignmentForm) {
        assignmentForm.addEventListener('submit', handleAssignmentSubmit);
    }

    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Load saved theme preference
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            isLightTheme = true;
            document.body.classList.add('light-theme');
        }
    } catch (e) {
        console.log('localStorage not available');
    }

    showToast('Welcome to YMIT Student Portal!', 'success');
}

// Theme Toggle Function - Improved readability
// Logout function
function logout() {
    // Clear all session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('theme');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

function toggleTheme() {
    isLightTheme = !isLightTheme;
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (isLightTheme) {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-moon';
        showToast('Switched to light theme', 'info');
    } else {
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-sun';
        showToast('Switched to dark theme', 'info');
    }

    // Save theme preference to localStorage if available
    try {
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    } catch (e) {
        console.log('localStorage not available');
    }
}

// Navigation functions
function navigateTo(page) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(p => p.classList.remove('active'));

    // Show selected page
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
    }

    // Update navigation links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.querySelector(`[onclick="navigateTo('${page}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }

    // Reinitialize progress bars for the new page
    setTimeout(() => {
        animateProgressBars();
    }, 100);

    showToast(`Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)}`, 'info');
}

// Ensure calendar is updated on page load
updateCalendar();

// Rest of JavaScript functions remain the same as original...
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const isOpen = dropdown.classList.contains('show');

    closeAllDropdowns();

    if (!isOpen) {
        dropdown.classList.add('show');
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        }
    });
}

function updateCalendar() {
    console.log('Updating calendar...');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const currentMonthElement = document.getElementById('current-month');
    const calendarDays = document.getElementById('calendar-days');
    
    console.log('Current month element:', currentMonthElement);
    console.log('Calendar days element:', calendarDays);

    // Update month and year display
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    if (calendarDays) {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

        calendarDays.innerHTML = '';

        // Add previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day other-month';
            emptyDay.textContent = prevMonthDays - i;
            calendarDays.appendChild(emptyDay);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            if (currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() &&
                day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Example events - you can customize these
            if ([5, 12, 19, 26].includes(day)) {
                dayElement.classList.add('has-event');
                dayElement.setAttribute('title', 'Event scheduled');
            }

            dayElement.addEventListener('click', () => {
                showToast(`Selected date: ${monthNames[currentMonth]} ${day}, ${currentYear}`, 'info');
            });

            calendarDays.appendChild(dayElement);
        }

        // Add next month's days to fill the remaining grid
        const totalDays = firstDay + daysInMonth;
        const remainingDays = 42 - totalDays; // 6 rows × 7 days = 42 total grid spots

        for (let i = 1; i <= remainingDays; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day other-month';
            emptyDay.textContent = i;
            calendarDays.appendChild(emptyDay);
        }
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        if (query.trim()) {
            showToast(`Searching for: "${query}"`, 'info');
        }
    }
}

function handleSearchInput(event) {
    const query = event.target.value.toLowerCase();
}

function markAsRead(element) {
    element.style.opacity = '0.6';
    element.style.transform = 'translateX(-10px)';

    setTimeout(() => {
        element.remove();
        notificationCount--;
        updateNotificationBadge();
        showToast('Notification marked as read', 'success');
    }, 300);
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = notificationCount;
        if (notificationCount === 0) {
            badge.style.display = 'none';
        }
    }
}

function handleAssignmentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<div class="loading"></div> Creating...';
    submitButton.disabled = true;

    setTimeout(() => {
        closeModal('assignmentModal');
        showToast('Assignment created successfully!', 'success');
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Create Assignment';
        submitButton.disabled = false;
        event.target.reset();
    }, 2000);
}

function handleProfileSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<div class="loading"></div> Saving...';
    submitButton.disabled = true;

    setTimeout(() => {
        closeModal('profileModal');
        showToast('Profile updated successfully!', 'success');
        submitButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        submitButton.disabled = false;
    }, 2000);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'check-circle' :
                type === 'error' ? 'exclamation-circle' : 'info-circle';

    toast.innerHTML = `
        <i class="fas fa-${icon} toast-icon"></i>
        <span>${message}</span>
    `;

    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function downloadReport() {
    showToast('Downloading report...', 'info');
    setTimeout(() => {
        showToast('Report downloaded successfully!', 'success');
    }, 2000);
}

function logout() {
    showToast('Logging out...', 'info');
    
    // Clear all session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('theme');
    
    // Small delay to show the logout message
    setTimeout(() => {
        // Redirect to login page
        window.location.href = 'login.html';
    }, 1000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
        closeAllDropdowns();
    }
});

// Responsive sidebar handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('open');
    }
});
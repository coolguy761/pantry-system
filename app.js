// Common utility functions and event handlers

// Modal handling
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Check if user is admin
function isAdmin() {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'admin';
}

// Handle logout
function handleLogout() {
    auth.signOut()
        .then(() => {
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
        })
        .catch(error => {
            showAlert('Logout failed: ' + error.message, 'danger');
        });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Add form validation listeners
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this.id)) {
                e.preventDefault();
                showAlert('Please fill in all required fields', 'danger');
            }
        });
    });

    // Show/hide admin elements based on role
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        element.style.display = isAdmin() ? 'block' : 'none';
    });

    checkAuth();
});

// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Check if user is logged in
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Get user role from Firestore
            db.collection('users').doc(userCredential.user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        localStorage.setItem('userRole', userData.role);
                        window.location.href = 'dashboard.html';
                    }
                })
                .catch(error => {
                    showAlert('Error getting user data: ' + error.message, 'danger');
                });
        })
        .catch(error => {
            showAlert('Login failed: ' + error.message, 'danger');
        });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
} 
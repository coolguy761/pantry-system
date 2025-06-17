// app.js
// Common utility functions and event handlers

// 1) Logging helper
export async function logActivity(type, details = '') {
  const { data: { session } = {} } = await supabase.auth.getSession();
  if (!session) return;
  const uid = session.user.id;
  supabase
    .from('logs')
    .insert([{ uid, activity_type: type, details }])
    .catch(err => console.error('Logging error:', err.message));
}

// Modal handling
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside any modal
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  return valid;
}

// Show alert message in page
function showAlert(message, type = 'success') {
  const container = document.querySelector('.container') || document.body;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.insertBefore(alertDiv, container.firstChild);
  setTimeout(() => alertDiv.remove(), 3000);
}

// Format date for display
function formatDate(dateString) {
  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, opts);
}

// Check if current user is admin
function isAdmin() {
  return sessionStorage.getItem('userRole') === 'admin';
}

// Handle logout via Supabase
async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showAlert('Logout failed: ' + error.message, 'danger');
  } else {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
}

// Guard protected pages: redirect if no active session
async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.href = 'index.html';
  }
}

// Initialize page behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Attach form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form.id)) {
        e.preventDefault();
        showAlert('Please fill in all required fields', 'danger');
      }
    });
  });

  // Show/hide admin-only elements
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin() ? 'block' : 'none';
  });

  // Run auth guard on all but public pages
  const publicPages = ['index.html', 'signup.html', 'reset-password.html', 'confirm-reset.html'];
  const current = window.location.pathname.split('/').pop();
  if (!publicPages.includes(current)) {
    checkAuth();
  }

  // Wire logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });
});

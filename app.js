// app.js
// Supabase must already be initialized on window.supabase

// 1) Logging helper
window.logActivity = async function(type, details = '') {
  const { data: { session } = {} } = await supabase.auth.getSession();
  if (!session) return;
  const uid = session.user.id;
  try {
    const { error } = await supabase
      .from('logs')
      .insert([{ uid, activity_type: type, details }]);
    if (error) console.error('Logging error:', error.message);
  } catch (err) {
    console.error('Unexpected logging failure:', err);
  }
};

// 2) Modal handling
window.showModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.style.display = 'block';
};
window.hideModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.style.display = 'none';
};

// 3) Simple form validation
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  return valid;
}

// 4) showAlert
window.showAlert = function(message, type = 'success') {
  const container = document.querySelector('.container') || document.body;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.insertBefore(alertDiv, container.firstChild);
  setTimeout(() => alertDiv.remove(), 3000);
};

// 5) formatDate
window.formatDate = function(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
};

// 6) checkAuth
window.checkAuth = async function() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.href = 'index.html';
  }
};

// 7) isAdmin
window.isAdmin = function() {
  return sessionStorage.getItem('userRole') === 'admin';
};

// 8) handleLogout
window.handleLogout = async function() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    window.showAlert('Logout failed: ' + error.message, 'danger');
  } else {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
};

// 9) Global DOMContentLoaded to wire up forms/modals
document.addEventListener('DOMContentLoaded', () => {
  // form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      if (!validateForm(form)) {
        e.preventDefault();
        showAlert('Please fill in all required fields', 'danger');
      }
    });
  });

  // wire logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });

  // show/hide admin‐only
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin() ? 'block' : 'none';
  });

  // guard pages
  const publicPages = ['index.html','signup.html','reset-password.html','confirm-reset.html'];
  const cur = window.location.pathname.split('/').pop();
  if (!publicPages.includes(cur)) {
    checkAuth();
  }
});

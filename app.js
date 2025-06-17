// app.js
// Assumes window.supabase is already set up via your supabase-config.js

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

// 2) showAlert
window.showAlert = function(message, type = 'success') {
  const container = document.querySelector('.container') || document.body;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.insertBefore(alertDiv, container.firstChild);
  setTimeout(() => alertDiv.remove(), 3000);
};

// 3) formatDate
window.formatDate = function(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
};

// 4) Authentication guard
window.checkAuth = async function() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.href = 'index.html';
  }
};

// 5) isAdmin guard
window.isAdmin = function() {
  return sessionStorage.getItem('userRole') === 'admin';
};

// 6) Logout
window.handleLogout = async function() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showAlert('Logout failed: ' + error.message, 'danger');
  } else {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
};

// 7) Modal helpers
window.showModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'block';
};
window.hideModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
};

// 8) Form validation
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

// 9) Global setup
document.addEventListener('DOMContentLoaded', () => {
  // a) Attach form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
        showAlert('Please fill in all required fields', 'danger');
      }
    });
  });

  // b) Wire logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });

  // c) Show/hide admin-only elements
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin() ? 'block' : 'none';
  });

  // d) Redirect non-public pages if not logged in
  const publicPages = ['index.html','signup.html','reset-password.html','confirm-reset.html'];
  const page = window.location.pathname.split('/').pop();
  if (!publicPages.includes(page)) {
    checkAuth();
  }

  // e) Close modals on outside click
  window.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('modal')) {
      ev.target.style.display = 'none';
    }
  });
});


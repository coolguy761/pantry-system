// app.js - Shared utilities and auth guard for Supabase-powered pages

// MUST be loaded after supabase-config.js

// Show styled alerts
export function showAlert(message, type = 'info') {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.innerHTML = '';
  container.appendChild(alertDiv);
}

// Hide any open modals by id
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Check authentication on protected pages
(async function checkAuth() {
  // Only run on pages beyond login/signup/reset
  const protected = [
    'dashboard.html', 'admin-dashboard.html',
    'pantry.html', 'shopping-list.html',
    'manage-users.html', 'user-logs.html', 'user-management.html'
  ];
  const current = window.location.pathname.split('/').pop();
  if (!protected.includes(current)) return;

  // Get current session
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    // Not logged in, redirect to login
    return window.location = 'index.html';
  }
  // Optionally, you can refresh the page or set global user
  window.currentUser = session.user;
})();

// Example display helper (override per-page)
export function displayItems(items) {
  // Placeholder: implement per-page UI rendering
  console.warn('displayItems not implemented', items);
}

// Sign out utility
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      window.location = 'index.html';
    };
  }
});

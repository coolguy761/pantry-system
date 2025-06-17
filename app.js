// app.js - Shared utilities and auth guard for Supabase-powered pages

// MUST be loaded after supabase-config.js

// Show styled alerts
function showAlert(message, type = 'info') {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.innerHTML = '';
  container.appendChild(alertDiv);
}

// Hide any open modal by id
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Check authentication on protected pages
(async function checkAuth() {
  const protectedPages = [
    'dashboard.html', 'admin-dashboard.html',
    'pantry.html', 'shopping-list.html',
    'manage-users.html', 'user-logs.html', 'user-management.html'
  ];
  const current = window.location.pathname.split('/').pop();
  if (!protectedPages.includes(current)) return;

  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.href = 'index.html';
    return;
  }
  window.currentUser = session.user;
})();

// Placeholder for item rendering (override per-page)
function displayItems(items) {
  console.warn('displayItems not implemented', items);
}

// Attach logout handler and auth state change redirect
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      window.location.href = 'index.html';
    };
  }
});

// Redirect to login on any auth change that ends session
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) window.location.href = 'index.html';
});

// app.js
// ───────────────────────────────────────────────────────────────────────────────
// Import your Supabase client (from supabase-config.js)
import { supabase } from './supabase-config.js';

// ─── Modal handling ─────────────────────────────────────────────────────────────
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ─── Form validation ────────────────────────────────────────────────────────────
export function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('input[required], select[required], textarea[required]')
      .forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
  return valid;
}

// ─── Styled alerts ─────────────────────────────────────────────────────────────
export function showAlert(message, type = 'success') {
  const container = document.querySelector('.container') || document.body;
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  container.insertBefore(alertDiv, container.firstChild);
  setTimeout(() => alertDiv.remove(), 3000);
}

// ─── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(dateString) {
  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, opts);
}

// ─── Role checking ──────────────────────────────────────────────────────────────
export function isAdmin() {
  return sessionStorage.getItem('userRole') === 'admin';
}

// ─── Logout handler ────────────────────────────────────────────────────────────
export async function handleLogout() {
  await supabase.auth.signOut();
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// ─── Auth guard ────────────────────────────────────────────────────────────────
export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}

// ─── Page init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1) Run RLS guard on protected pages
  if (!['index.html','signup.html','reset-password.html','confirm-reset.html']
        .some(p => location.pathname.endsWith(p))) {
    checkAuth();
  }

  // 2) Wire up modal close buttons
  document.querySelectorAll('.close').forEach(btn =>
    btn.addEventListener('click', () => {
      const m = btn.closest('.modal');
      if (m) m.style.display = 'none';
    })
  );

  // 3) Simple form-validation hook
  document.querySelectorAll('form').forEach(f =>
    f.addEventListener('submit', e => {
      if (!validateForm(f.id)) {
        e.preventDefault();
        showAlert('Please fill in all required fields', 'danger');
      }
    })
  );

  // 4) Show/hide admin-only UI
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin() ? 'block' : 'none';
  });
});

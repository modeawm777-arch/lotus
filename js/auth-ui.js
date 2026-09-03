// ==========================================
// College Market — Auth UI Handler (auth-ui.js)
// Handles user profile display and logout in the main app
// ==========================================

const AUTH_KEY = 'college_market_auth_v1';

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.replace('login.html');
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

function initAuthUI() {
  const user = getCurrentUser();
  if (!user) { window.location.replace('login.html'); return; }

  // Set avatar mini
  const miniAvatar = document.getElementById('userAvatarMini');
  if (miniAvatar) {
    miniAvatar.textContent = getInitials(user.name);
  }

  // Profile modal content
  const profileAvatar = document.getElementById('userProfileAvatar');
  const profileName = document.getElementById('userProfileName');
  const profileRoleText = document.getElementById('userProfileRoleText');
  const profileRoleBadge = document.getElementById('userProfileRoleBadge');
  const profileUsername = document.getElementById('userProfileUsername');
  const profileDept = document.getElementById('userProfileDept');
  const profilePhone = document.getElementById('userProfilePhone');

  if (profileAvatar) profileAvatar.textContent = getInitials(user.name);
  if (profileName) profileName.textContent = user.name || user.username;
  if (profileRoleText) profileRoleText.textContent = user.role === 'teacher' ? 'ครู / บุคลากร' : 'นักเรียน';
  if (profileRoleBadge) {
    const icon = profileRoleBadge.querySelector('i');
    if (icon) icon.className = user.role === 'teacher' ? 'fa-solid fa-chalkboard-teacher' : 'fa-solid fa-user-graduate';
    profileRoleBadge.style.background = user.role === 'teacher' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)';
  }
  if (profileUsername) profileUsername.textContent = user.username || '—';
  if (profileDept) profileDept.textContent = user.dept || '—';
  if (profilePhone) profilePhone.textContent = user.phone || '—';

  // Open profile modal
  const openProfileBtn = document.getElementById('openUserProfileBtn');
  const profileModal = document.getElementById('userProfileModal');
  const closeProfileBtn = document.getElementById('closeUserProfileBtn');

  if (openProfileBtn && profileModal) {
    openProfileBtn.addEventListener('click', () => {
      // Update live stats
      const orderCount = document.getElementById('profileOrderCount');
      const wishlistCount = document.getElementById('profileWishlistCount');
      const cartCount = document.getElementById('profileCartCount');
      if (orderCount && window.state) orderCount.textContent = state.orders.length;
      if (wishlistCount && window.state) wishlistCount.textContent = state.wishlist.length;
      if (cartCount && window.state) cartCount.textContent = state.cart.reduce((s, i) => s + i.quantity, 0);

      profileModal.classList.add('open'); // ใช้ 'open' ให้ตรงกับ app.js
    });
  }

  if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', () => profileModal.classList.remove('open'));
  }

  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) profileModal.classList.remove('open');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('ต้องการออกจากระบบใช่ไหม?')) logout();
    });
  }

  // Greet user via toast (once)
  const greetKey = 'college_market_greeted_' + user.username;
  if (!sessionStorage.getItem(greetKey)) {
    sessionStorage.setItem(greetKey, '1');
    setTimeout(() => {
      if (typeof showToast === 'function') {
        showToast(`ยินดีต้อนรับ ${user.name || user.username}! 🎓`, 'success');
      }
    }, 800);
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem('college_market_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

document.addEventListener('DOMContentLoaded', initAuthUI);

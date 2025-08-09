// profile.js
// Loads user information and handles logout on the profile page.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const profileData = JSON.parse(localStorage.getItem('lawuTennisProfile')) || {};
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  nameEl.textContent = profileData.fullName || currentUser;
  emailEl.textContent = profileData.email || currentUser;

  const logoutBtn = document.getElementById('logoutButton');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
      alert('You have been logged out.');
      window.location.href = 'login.html';
    });
  }
});
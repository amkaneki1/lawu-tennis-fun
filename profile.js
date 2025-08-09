// profile.js
// Loads user information and handles logout on the profile page.

document.addEventListener('DOMContentLoaded', () => {
  const profileData = JSON.parse(localStorage.getItem('lawuTennisProfile')) || {};
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  nameEl.textContent = profileData.fullName || 'Guest User';
  emailEl.textContent = profileData.email || 'guest@example.com';

  const logoutBtn = document.getElementById('logoutButton');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Clear profile, bookings, waiting list and packages from storage
      localStorage.removeItem('lawuTennisProfile');
      localStorage.removeItem('lawuTennisBookings');
      localStorage.removeItem('lawuTennisWaitingList');
      localStorage.removeItem('lawuTennisPurchasedPackages');
      alert('You have been logged out.');
      window.location.href = 'index.html';
    });
  }
});
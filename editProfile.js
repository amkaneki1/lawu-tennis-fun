// editProfile.js
// Loads existing profile data into the form and saves updates to localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  if (!form) return;
  // Load existing profile from localStorage
  const profileData = JSON.parse(localStorage.getItem('lawuTennisProfile')) || {};
  // Populate fields
  document.getElementById('fullName').value = profileData.fullName || '';
  document.getElementById('email').value = profileData.email || '';
  document.getElementById('phone').value = profileData.phone || '';
  document.getElementById('instagram').value = profileData.instagram || '';
  if (profileData.birthDate) {
    document.getElementById('birthDate').value = profileData.birthDate;
  }
  if (profileData.gender) {
    const radio = form.querySelector(`input[name="gender"][value="${profileData.gender}"]`);
    if (radio) radio.checked = true;
  }
  document.getElementById('notes').value = profileData.notes || '';

  form.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      instagram: document.getElementById('instagram').value,
      birthDate: document.getElementById('birthDate').value,
      gender: form.querySelector('input[name="gender"]:checked')?.value || '',
      notes: document.getElementById('notes').value
    };
    localStorage.setItem('lawuTennisProfile', JSON.stringify(updated));
    alert('Profile updated successfully!');
    window.location.href = 'profile.html';
  });
});
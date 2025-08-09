// admin_users.js
// Handles user listing for the admin panel

document.addEventListener('DOMContentLoaded', () => {
  // Ensure only admin can access this page
  const adminUser = requireAdmin();
  if (!adminUser) return;
  const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
  const tbody = document.getElementById('usersBody');
  // Clear existing rows
  tbody.innerHTML = '';
  // Iterate over profiles and insert table rows
  Object.keys(profiles).forEach(email => {
    const prof = profiles[email];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="border:1px solid #ddd;padding:8px;">${prof.fullName || ''}</td>
      <td style="border:1px solid #ddd;padding:8px;">${prof.email}</td>
      <td style="border:1px solid #ddd;padding:8px;">${prof.phone || ''}</td>
      <td style="border:1px solid #ddd;padding:8px;">${prof.isAdmin ? 'Admin' : 'User'}</td>
    `;
    tbody.appendChild(tr);
  });
});
// signup.js
// Handles user registration on the signup page.

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to home
  const currentUser = localStorage.getItem('lawuTennisCurrentUser');
  if (currentUser) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!name || !email || !password) {
      alert('Please complete all fields.');
      return;
    }
    const err = registerUser(email, password, { fullName: name });
    if (err) {
      alert(err);
      return;
    }
    // Automatically log in the user
    loginUser(email, password);
    alert('Registration successful! Welcome to Lawu Tennis Fun.');
    window.location.href = 'index.html';
  });
});
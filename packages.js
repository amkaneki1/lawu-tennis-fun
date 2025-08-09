// packages.js
// Handles purchasing of membership packages. Packages are stored in localStorage under 'lawuTennisPurchasedPackages'.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const links = document.querySelectorAll('.package-link');
  const packagesData = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
  // Determine names of packages purchased by current user
  const purchasedNames = packagesData
    .filter(pkg => !pkg.userEmail || pkg.userEmail === currentUser)
    .map(pkg => pkg.name);
  links.forEach(link => {
    const name = link.dataset.name;
    if (purchasedNames.includes(name)) {
      link.textContent = 'Purchased';
      link.classList.add('disabled');
      link.style.pointerEvents = 'none';
    }
  });
});
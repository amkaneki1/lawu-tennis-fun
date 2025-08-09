// packages.js
// Handles purchasing of membership packages. Packages are stored in localStorage under 'lawuTennisPurchasedPackages'.

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.package-link');
  const packagesData = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
  const purchasedNames = packagesData.map(pkg => pkg.name);
  links.forEach(link => {
    const name = link.dataset.name;
    if (purchasedNames.includes(name)) {
      link.textContent = 'Purchased';
      link.classList.add('disabled');
      link.style.pointerEvents = 'none';
    }
  });
});
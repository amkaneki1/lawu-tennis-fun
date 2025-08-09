// packageDetail.js
// Displays the details of a selected package and handles checkout/purchase.

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const name = decodeURIComponent(getQueryParam('name') || '');
  const titleEl = document.getElementById('packageTitle');
  const contentEl = document.getElementById('packageContent');
  const checkoutSection = document.getElementById('checkoutSection');
  const messageSection = document.getElementById('messageSection');
  const messageEl = document.getElementById('purchaseMessage');
  const checkoutBtn = document.getElementById('checkoutBtn');
  // Define available packages
  const packageDetails = {
    'Single Session': {
      price: 'Rp100.000',
      expiry: 'Valid for 1 session',
      description: 'One practice session whenever you need a quick workout.'
    },
    'Weekly Plan': {
      price: 'Rp250.000',
      expiry: 'Valid for 1 week (up to 3 sessions)',
      description: 'Up to 3 practice sessions per week to keep you fit and sharp.'
    },
    'Monthly Membership': {
      price: 'Rp900.000',
      expiry: 'Valid for 1 month (unlimited sessions)',
      description: 'Unlimited sessions for a month—perfect for serious players.'
    }
  };
  // If the package name is invalid, show an error
  const details = packageDetails[name];
  if (!details) {
    titleEl.textContent = 'Package Not Found';
    contentEl.innerHTML = '<p>The requested package could not be found.</p>';
    checkoutSection.style.display = 'none';
    return;
  }
  // Display package info
  titleEl.textContent = name;
  contentEl.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Price:</strong> ${details.price}</p>
    <p><strong>Expiry:</strong> ${details.expiry}</p>
    <p>${details.description}</p>
  `;
  // Check if already purchased
  const purchased = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
  // Check if current user already purchased this package
  const alreadyPurchased = purchased.some(pkg => pkg.name === name && (!pkg.userEmail || pkg.userEmail === currentUser));
  if (alreadyPurchased) {
    messageEl.textContent = 'You have already purchased this package.';
    messageSection.style.display = 'block';
    checkoutSection.style.display = 'none';
  } else {
    checkoutSection.style.display = 'block';
    messageSection.style.display = 'none';
    checkoutBtn.addEventListener('click', () => {
      // Purchase the package for the current user
      const current = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
      current.push({ name, expiry: details.expiry, userEmail: currentUser });
      localStorage.setItem('lawuTennisPurchasedPackages', JSON.stringify(current));
      // Create a transaction entry to simulate pending payment
      const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
      const transactionId = 'TX' + Date.now();
      const now = new Date();
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // due in 24 hours
      transactions.push({
        id: transactionId,
        date: now.toISOString().slice(0, 10),
        item: name,
        price: details.price,
        status: 'Pending Payment',
        due: dueDate.toISOString(),
        type: 'package',
        userEmail: currentUser
      });
      localStorage.setItem('lawuTennisTransactions', JSON.stringify(transactions));
      // Show message and hide checkout button
      messageEl.textContent = 'Package purchased successfully! Transaction added to My Transactions.';
      messageSection.style.display = 'block';
      checkoutSection.style.display = 'none';
    });
  }
});
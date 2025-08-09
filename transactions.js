// transactions.js
// Handles display of user transactions and tab switching between Pending and Completed.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const pendingTab = document.getElementById('pendingTab');
  const completedTab = document.getElementById('completedTab');
  const listEl = document.getElementById('transactionList');
  let currentTab = 'Pending';

  function renderTransactions() {
    listEl.innerHTML = '';
    const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
    // Filter by status and by user
    // Determine if current user is admin
    const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
    const profile = profiles[currentUser] || {};
    const isAdmin = !!profile.isAdmin;
    const filtered = transactions.filter(tx => {
      // If not admin, show only transactions belonging to current user
      if (!isAdmin && tx.userEmail && tx.userEmail !== currentUser) {
        return false;
      }
      if (currentTab === 'Pending') return tx.status === 'Pending Payment';
      return tx.status !== 'Pending Payment';
    });
    if (filtered.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'message';
      msg.textContent = 'There are no transactions in this category.';
      listEl.appendChild(msg);
      return;
    }
    filtered.forEach(tx => {
      const card = document.createElement('div');
      card.className = 'transaction-card';
      card.innerHTML = `
        <p><strong>ID:</strong> ${tx.id}</p>
        <p><strong>Date:</strong> ${tx.date}</p>
        <p><strong>Item:</strong> ${tx.item}</p>
        <p><strong>Status:</strong> ${tx.status}</p>
        <p><strong>Price:</strong> ${tx.price}</p>
      `;
      const detailLink = document.createElement('a');
      detailLink.href = 'transaction_detail.html?id=' + encodeURIComponent(tx.id);
      detailLink.className = 'btn';
      detailLink.textContent = 'Detail';
      card.appendChild(detailLink);
      listEl.appendChild(card);
    });
  }

  pendingTab.addEventListener('click', () => {
    currentTab = 'Pending';
    pendingTab.classList.add('active');
    completedTab.classList.remove('active');
    renderTransactions();
  });
  completedTab.addEventListener('click', () => {
    currentTab = 'Completed';
    completedTab.classList.add('active');
    pendingTab.classList.remove('active');
    renderTransactions();
  });
  // Initial render
  renderTransactions();
});
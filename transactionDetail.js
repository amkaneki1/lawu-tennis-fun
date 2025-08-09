// transactionDetail.js
// Displays details of a single transaction including due date countdown and payment info.

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const detailEl = document.getElementById('transactionDetail');
  const id = decodeURIComponent(getQueryParam('id') || '');
  const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
  const tx = transactions.find(t => t.id === id);
  // Ensure the transaction belongs to current user (or no user specified)
  if (!tx || (tx.userEmail && tx.userEmail !== currentUser)) {
    detailEl.innerHTML = '<p class="message">Transaction not found.</p>';
    return;
  }
  // Build detail HTML
  const dueDate = new Date(tx.due);
  const now = new Date();
  const remainingMs = dueDate - now;
  let countdownStr = '';
  if (remainingMs > 0) {
    const hours = Math.floor(remainingMs / 3600000);
    const minutes = Math.floor((remainingMs % 3600000) / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    countdownStr = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    countdownStr = 'Expired';
  }

  const html = document.createElement('div');
  html.className = 'transaction-detail-card';
  // Retrieve user profile for displaying name
  const profileData = JSON.parse(localStorage.getItem('lawuTennisProfile')) || {};
  const userName = profileData.fullName || 'Guest User';
  html.innerHTML = `
    <p><strong>Name:</strong> ${userName}</p>
    <p><strong>Invoice ID:</strong> ${tx.id}</p>
    <p><strong>Date:</strong> ${tx.date}</p>
    <p><strong>Item:</strong> ${tx.item}</p>
    <p><strong>Price:</strong> ${tx.price}</p>
    <p><strong>Status:</strong> ${tx.status}</p>
    <p><strong>Payment Due:</strong> ${dueDate.toLocaleString()}</p>
    <p><strong>Time Remaining:</strong> ${countdownStr}</p>
    <h3>Payment Method</h3>
    <p>Bank Transfer (Mandiri) a/n Lawu Tennis Fun</p>
    <p>Account Number: 1234567890</p>
  `;
  // Upload button for payment proof
  const uploadLabel = document.createElement('label');
  uploadLabel.textContent = 'Upload Payment Proof:';
  uploadLabel.style.display = 'block';
  uploadLabel.style.marginTop = '12px';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*,application/pdf';
  fileInput.style.marginBottom = '8px';
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'btn';
  uploadBtn.textContent = 'Submit Proof';
  uploadBtn.addEventListener('click', () => {
    if (fileInput.files.length === 0) {
      alert('Please select a file to upload as proof of payment.');
      return;
    }
    // In this demo we simply mark the transaction as completed
    const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
    const index = transactions.findIndex(t => t.id === tx.id);
    if (index >= 0) {
      transactions[index].status = 'Completed';
      localStorage.setItem('lawuTennisTransactions', JSON.stringify(transactions));
    }
    alert('Payment proof submitted successfully! Thank you.');
    // After uploading, redirect back to transactions page
    window.location.href = 'transactions.html';
  });
  html.appendChild(uploadLabel);
  html.appendChild(fileInput);
  html.appendChild(uploadBtn);
  detailEl.appendChild(html);

  // Payment proof form
  const paymentSection = document.getElementById('paymentSection');
  // Only show the upload form if the transaction is pending
  if (tx.status === 'Pending Payment') {
    const form = document.createElement('div');
    form.className = 'payment-form';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    nameLabel.htmlFor = 'payerName';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'payerName';
    nameInput.placeholder = 'Your full name';
    const fileLabel = document.createElement('label');
    fileLabel.textContent = 'Payment Proof:';
    fileLabel.htmlFor = 'paymentFile';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'paymentFile';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit Payment';
    submitBtn.addEventListener('click', () => {
      // Simple validation: require name and a file selected
      if (!nameInput.value) {
        alert('Please enter your name.');
        return;
      }
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a payment proof file.');
        return;
      }
      // Update transaction status to completed
      const updatedTransactions = transactions.map(item => {
        if (item.id === tx.id) {
          return { ...item, status: 'Completed', payerName: nameInput.value, proofFile: fileInput.files[0].name };
        }
        return item;
      });
      localStorage.setItem('lawuTennisTransactions', JSON.stringify(updatedTransactions));
      alert('Thank you! Your payment proof has been submitted.');
      // Redirect back to transactions list
      window.location.href = 'transactions.html';
    });
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(fileLabel);
    form.appendChild(fileInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitBtn);
    paymentSection.appendChild(form);
  }
});
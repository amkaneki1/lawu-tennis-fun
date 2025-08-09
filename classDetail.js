// classDetail.js
// Handles display of a single class and booking/waitlist actions.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const classInfoEl = document.getElementById('classInfo');
  const classActionsEl = document.getElementById('classActions');
  const titleEl = document.getElementById('classTitle');

  // Retrieve the selected class from sessionStorage; this is set by schedule.js when the user
  // clicks a "Detail" or "Waiting List" button.
  const selectedClassStr = sessionStorage.getItem('selectedClass');
  if (!selectedClassStr) {
    classInfoEl.innerHTML = '<p class="message">No class information available.</p>';
    return;
  }
  const session = JSON.parse(selectedClassStr);
  // Set header title
  titleEl.textContent = session.title;

  // Build class information markup similar to floupilates detail page
  const infoList = document.createElement('div');
  infoList.className = 'detail-list';
  infoList.innerHTML = `
    <p><strong>Date:</strong> ${session.date}</p>
    <p><strong>Time:</strong> ${session.time}</p>
    <p><strong>Duration:</strong> ${session.duration}</p>
    <p><strong>Location:</strong> ${session.location}</p>
    <p><strong>Instructor:</strong> ${session.instructor}</p>
    <p><strong>Price:</strong> ${session.price}</p>
    <p><strong>Description:</strong> ${session.description || 'No description provided.'}</p>
  `;
  classInfoEl.appendChild(infoList);

  // Determine booking status from localStorage for current user
  const bookingsData = JSON.parse(localStorage.getItem('lawuTennisBookings')) || {};
  let isBooked = false;
  if (bookingsData[session.date]) {
    isBooked = bookingsData[session.date].some(b => {
      if (typeof b === 'string') {
        return b === session.time && !currentUser;
      }
      return b.time === session.time && b.title === session.title && (b.userEmail ? b.userEmail === currentUser : true);
    });
  }

  // Input for promo code
  const promoContainer = document.createElement('div');
  promoContainer.className = 'promo-container';
  const promoLabel = document.createElement('label');
  promoLabel.textContent = 'Promo Code:';
  promoLabel.setAttribute('for', 'promoCode');
  const promoInput = document.createElement('input');
  promoInput.type = 'text';
  promoInput.id = 'promoCode';
  promoInput.placeholder = 'Enter code';
  const promoCheckBtn = document.createElement('button');
  promoCheckBtn.className = 'btn';
  promoCheckBtn.textContent = 'Check';
  promoCheckBtn.addEventListener('click', () => {
    alert('Promo code validation is not implemented in this demo.');
  });
  promoContainer.appendChild(promoLabel);
  promoContainer.appendChild(promoInput);
  promoContainer.appendChild(promoCheckBtn);
  classActionsEl.appendChild(promoContainer);

  // Button to perform booking or waiting list
  const actionBtn = document.createElement('button');
  actionBtn.className = 'btn';
  let actionText = '';
  if (isBooked) {
    actionBtn.disabled = true;
    actionText = 'Booked';
  } else {
    actionText = 'Checkout';
  }
  actionBtn.textContent = actionText;
  actionBtn.addEventListener('click', () => {
    // If not booked, perform booking and create transaction, then redirect
    if (!isBooked) {
      // Add booking for current user
      const date = session.date;
      const bookingObj = { time: session.time, title: session.title, userEmail: currentUser };
      const data = JSON.parse(localStorage.getItem('lawuTennisBookings')) || {};
      if (!data[date]) data[date] = [];
      // Avoid duplicates for this user
      if (!data[date].some(b => b.time === bookingObj.time && b.title === bookingObj.title && (b.userEmail ? b.userEmail === currentUser : true))) {
        data[date].push(bookingObj);
        localStorage.setItem('lawuTennisBookings', JSON.stringify(data));
      }
      // Create a transaction for this booking for current user
      const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
      const transactionId = 'TX' + Date.now();
      const now = new Date();
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      transactions.push({
        id: transactionId,
        date: now.toISOString().slice(0, 10),
        item: session.title,
        price: session.price,
        status: 'Pending Payment',
        due: dueDate.toISOString(),
        type: 'class',
        userEmail: currentUser
      });
      localStorage.setItem('lawuTennisTransactions', JSON.stringify(transactions));
      // Redirect to transaction detail page
      window.location.href = 'transaction_detail.html?id=' + encodeURIComponent(transactionId);
    }
  });
  classActionsEl.appendChild(actionBtn);
});
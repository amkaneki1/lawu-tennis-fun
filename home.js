// home.js
// This script populates the summary information on the home page for bookings and waiting list.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const bookingsSummaryEl = document.getElementById('bookingsSummary');
  const promosSummaryEl = document.getElementById('promosSummary');
  // Retrieve bookings from localStorage; stored as an object keyed by date with array of session objects
  const bookingsData = JSON.parse(localStorage.getItem('lawuTennisBookings')) || {};
  let bookingCount = 0;
  Object.keys(bookingsData).forEach(date => {
    const arr = bookingsData[date];
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (typeof item === 'string') {
          bookingCount++;
        } else {
          if (!item.userEmail || item.userEmail === currentUser) bookingCount++;
        }
      });
    }
  });
  if (bookingCount > 0) {
    bookingsSummaryEl.textContent = `You have ${bookingCount} upcoming booking${bookingCount > 1 ? 's' : ''}.`;
  } else {
    bookingsSummaryEl.textContent = 'No booking data available right now…';
  }
  // Retrieve promotions; for now promotions are static or stored under lawuTennisPromos.
  const promosData = JSON.parse(localStorage.getItem('lawuTennisPromos')) || [];
  if (promosData.length > 0) {
    promosSummaryEl.textContent = `We have ${promosData.length} promotion${promosData.length > 1 ? 's' : ''} available.`;
  } else {
    promosSummaryEl.textContent = 'There are currently no promotions.';
  }
});
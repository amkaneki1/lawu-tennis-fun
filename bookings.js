// Script to display a list of booked sessions stored in localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const bookingsList = document.getElementById('bookingsList');
  if (!bookingsList) return;
  // Retrieve stored bookings from localStorage; keys are dates and values are arrays of time strings.
  const stored = JSON.parse(localStorage.getItem('lawuTennisBookings')) || {};
  const items = [];
  // Flatten the booking data into an array of objects for sorting and display.
  Object.keys(stored).forEach(date => {
    (stored[date] || []).forEach(time => {
      items.push({ date, time });
    });
  });
  // If no bookings exist, show a friendly message.
  if (items.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'message';
    msg.textContent = 'You have no bookings yet.';
    bookingsList.appendChild(msg);
    return;
  }
  // Sort bookings by date/time for better readability.
  items.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA - dateB;
  });
  // Create a list item for each booking.
  items.forEach(({ date, time }) => {
    const li = document.createElement('li');
    li.className = 'booking-item';
    li.textContent = `${date} at ${time}`;
    bookingsList.appendChild(li);
  });
});
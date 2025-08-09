// Schedule functionality for Lawu Tennis Fun
// This script manages the booking table, date navigation and persistence via localStorage.

// Define time slots for the day (hourly from 07:00 to 21:00)
const timeSlots = [];
for (let hour = 7; hour <= 20; hour++) {
  const nextHour = hour + 1;
  const start = hour.toString().padStart(2, '0') + ':00';
  const end = nextHour.toString().padStart(2, '0') + ':00';
  timeSlots.push(`${start} - ${end}`);
}

// Storage key to separate from other demos
const STORAGE_KEY = 'lawuTennisBookings';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadBookings() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function renderSchedule(dateStr) {
  const scheduleContainer = document.getElementById('scheduleContainer');
  const bookings = loadBookings();
  const bookedSlots = bookings[dateStr] || [];
  let html = `<h2>Schedule for ${dateStr}</h2>`;
  html += '<table><thead><tr><th>Time Slot</th><th>Status</th></tr></thead><tbody>';
  timeSlots.forEach(slot => {
    const isBooked = bookedSlots.includes(slot);
    const cellClass = isBooked ? 'booked' : 'available';
    const status = isBooked ? 'Booked' : 'Available';
    html += `<tr><td>${slot}</td><td class="${cellClass}" data-slot="${slot}">${status}</td></tr>`;
  });
  html += '</tbody></table>';
  scheduleContainer.innerHTML = html;
  // Add listeners to available cells
  scheduleContainer.querySelectorAll('td.available').forEach(cell => {
    cell.addEventListener('click', () => {
      let slot = cell.getAttribute('data-slot') || cell.parentElement.children[0].textContent.trim();
      if (!bookedSlots.includes(slot)) {
        bookedSlots.push(slot);
        bookings[dateStr] = bookedSlots;
        saveBookings(bookings);
        renderSchedule(dateStr);
      }
    });
  });
  // Listeners to cancel booked cells
  scheduleContainer.querySelectorAll('td.booked').forEach(cell => {
    cell.addEventListener('click', () => {
      let slot = cell.getAttribute('data-slot') || cell.parentElement.children[0].textContent.trim();
      const index = bookedSlots.indexOf(slot);
      if (index > -1) {
        if (confirm(`Cancel booking for ${slot}?`)) {
          bookedSlots.splice(index, 1);
          if (bookedSlots.length === 0) {
            delete bookings[dateStr];
          } else {
            bookings[dateStr] = bookedSlots;
          }
          saveBookings(bookings);
          renderSchedule(dateStr);
        }
      }
    });
  });
}

function init() {
  const datePicker = document.getElementById('datePicker');
  const prevDayBtn = document.getElementById('prevDay');
  const nextDayBtn = document.getElementById('nextDay');
  const resetBtn = document.getElementById('resetBtn');
  const today = new Date();
  const todayStr = formatDate(today);
  datePicker.value = todayStr;
  renderSchedule(todayStr);
  datePicker.addEventListener('change', () => {
    const selectedDate = datePicker.value;
    if (selectedDate) renderSchedule(selectedDate);
  });
  prevDayBtn.addEventListener('click', () => {
    let currentDate = new Date(datePicker.value);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDateStr = formatDate(currentDate);
    datePicker.value = newDateStr;
    renderSchedule(newDateStr);
  });
  nextDayBtn.addEventListener('click', () => {
    let currentDate = new Date(datePicker.value);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDateStr = formatDate(currentDate);
    datePicker.value = newDateStr;
    renderSchedule(newDateStr);
  });
  resetBtn.addEventListener('click', () => {
    if (confirm('This will delete all bookings. Are you sure?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderSchedule(datePicker.value);
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
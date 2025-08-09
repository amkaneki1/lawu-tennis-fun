// schedule.js
// This file implements a more flexible class schedule similar to the Flou Pilates site.
// It shows a list of tennis sessions per date, allows booking available sessions,
// and joining a waiting list for full sessions. All data is stored in localStorage.

// Utility to format dates as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate sample sessions for demonstration purposes. In a real application this
// data would come from a server.
function getSessionsForDate(dateStr) {
  // We'll return the same sessions regardless of date for simplicity.
  return [
    {
      time: '07:00 - 08:00',
      duration: '1h',
      title: 'Morning Tennis Drills',
      coach: 'Coach Andi',
      instructor: 'Coach Andi',
      location: 'Court 1',
      spots: 4,
      price: 'Rp 150.000',
      description: 'Start your day with energizing drills focusing on footwork and consistency.'
    },
    {
      time: '09:00 - 10:30',
      duration: '1.5h',
      title: 'Doubles Practice',
      coach: 'Coach Budi',
      instructor: 'Coach Budi',
      location: 'Court 2',
      spots: 0,
      price: 'Rp 200.000',
      description: 'Sharpen your teamwork and court strategies in this doubles-focused session.'
    },
    {
      time: '11:00 - 12:00',
      duration: '1h',
      title: 'Serve & Return Workshop',
      coach: 'Coach Citra',
      instructor: 'Coach Citra',
      location: 'Court 3',
      spots: 2,
      price: 'Rp 180.000',
      description: 'Improve your serve accuracy and perfect your returns with targeted drills.'
    },
    {
      time: '14:00 - 15:30',
      duration: '1.5h',
      title: 'Singles Strategy',
      coach: 'Coach Dani',
      instructor: 'Coach Dani',
      location: 'Court 1',
      spots: 0,
      price: 'Rp 200.000',
      description: 'Learn tactics and positioning to outsmart your opponent in singles play.'
    },
    {
      time: '16:00 - 17:00',
      duration: '1h',
      title: 'Junior Tennis Fun',
      coach: 'Coach Eka',
      instructor: 'Coach Eka',
      location: 'Court 2',
      spots: 3,
      price: 'Rp 120.000',
      description: 'A fun, engaging class for young players to learn the basics of tennis.'
    }
  ];
}

function renderSchedule(dateStr) {
  const container = document.getElementById('scheduleContainer');
  const sessions = getSessionsForDate(dateStr);
  let html = `<h2>Classes on ${dateStr}</h2>`;
  html += '<div class="session-list">';
  // Retrieve existing bookings to determine initial button states
  const bookingsData = JSON.parse(localStorage.getItem('lawuTennisBookings')) || {};
  sessions.forEach((sess, index) => {
    const isBooked = (bookingsData[dateStr] || []).some(item => item.time === sess.time && item.title === sess.title);
    // Regardless of the number of spots, from customer perspective all sessions are available to book
    const spotsLabel = 'Available';
    let buttonHTML = '';
    if (isBooked) {
      buttonHTML = `<button class="btn detail-btn" data-index="${index}" disabled>Booked</button>`;
    } else {
      buttonHTML = `<button class="btn detail-btn" data-index="${index}">Book</button>`;
    }
    html += `<div class="session-item" data-index="${index}">
        <div class="session-time">${sess.time}</div>
        <div class="session-details">
          <h3>${sess.title}</h3>
          <p>${sess.coach} — ${sess.location}</p>
        </div>
        <div class="session-actions">
          <span class="spots">${spotsLabel}</span>
          ${buttonHTML}
        </div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
  // Attach listeners for detail buttons
  container.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const sess = sessions[idx];
      // Build session object for class detail page
      const detailObj = {
        date: dateStr,
        time: sess.time,
        duration: sess.duration || '',
        title: sess.title,
        instructor: sess.coach,
        location: sess.location,
        spots: sess.spots,
        price: sess.price || 'Free',
        description: sess.description || ''
      };
      sessionStorage.setItem('selectedClass', JSON.stringify(detailObj));
      window.location.href = 'class_detail.html';
    });
  });
}

function initSchedule() {
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
    if (confirm('This will delete all bookings and waiting list entries. Are you sure?')) {
      localStorage.removeItem('lawuTennisBookings');
      localStorage.removeItem('lawuTennisWaitingList');
      renderSchedule(datePicker.value);
    }
  });
}

document.addEventListener('DOMContentLoaded', initSchedule);
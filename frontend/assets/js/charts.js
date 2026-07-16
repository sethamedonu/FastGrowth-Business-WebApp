// Chart defaults
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#6b7280';

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
const gridColor = () => isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

// Revenue Chart
const revenueCtx = document.getElementById('revenueChart');
if (revenueCtx) {
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue',
        data: [32000,38000,35000,42000,48000,52000,49000,58000,62000,59000,68000,74000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: gridColor() }, ticks: { callback: v => '$' + (v/1000) + 'k' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Traffic Doughnut
const trafficCtx = document.getElementById('trafficChart');
if (trafficCtx) {
  new Chart(trafficCtx, {
    type: 'doughnut',
    data: {
      labels: ['Organic','Direct','Social','Referral'],
      datasets: [{ data: [45, 25, 20, 10], backgroundColor: ['#2563eb','#7c3aed','#10b981','#f59e0b'], borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      cutout: '70%'
    }
  });
}

// Analytics Bar
const analyticsCtx = document.getElementById('analyticsChart');
if (analyticsCtx) {
  new Chart(analyticsCtx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [
        { label: 'Visitors', data: [1200,1900,1500,2100,1800,900,700], backgroundColor: 'rgba(37,99,235,0.8)', borderRadius: 6 },
        { label: 'Conversions', data: [80,120,95,140,110,60,45], backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { grid: { color: gridColor() } }, x: { grid: { display: false } } }
    }
  });
}

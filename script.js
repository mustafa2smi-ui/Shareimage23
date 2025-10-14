// Theme Toggle
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️';
}

// Share as image (with color option)
function shareQuote(btn) {
  const card = btn.closest('.qa-card');
  const color = prompt("Choose background color: (e.g. white, green, black)\nOr leave blank for default");
  if (color) card.style.background = color;

  html2canvas(card).then(canvas => {
    const link = document.createElement('a');
    link.download = 'darulmasail-answer.png';
    link.href = canvas.toDataURL();
    link.click();
    if (color) card.style.background = ''; // reset color
  });
}

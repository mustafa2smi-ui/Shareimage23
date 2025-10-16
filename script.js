// 🔹 Question Data
const questions = [
  {
    id: 1,
    title: "Namaz ke waqt mobile use karna kaisa hai?",
    short: "Namaz me kisi bhi duniawi amal ka istemal...",
    answer: "Namaz ke dauran mobile chalana ya duniawi kaam me lagna namaz tod deta hai. Zarurat ke waqt ijtinaab behtar hai.",
    ref: "Fatawa Alamgiri, Vol.1, Pg.234",
    scholar: "Mufti Saeed Ahmed"
  },
  {
    id: 2,
    title: "Roze ke dauran toothpaste lagana jaiz hai?",
    short: "Toothpaste agar munh ke andar chala jaye...",
    answer: "Agar toothpaste ka koi hissa andar chala gaya to roza toot jata hai. Behtar hai miswak ya brush bina paste ke karein.",
    ref: "Bahishti Zewar, Part 2",
    scholar: "Mufti Anas Qasmi"
  },
  {
    id: 3,
    title: "Zakat kab wajib hoti hai?",
    short: "Jab maal ek saal tak nisaab barabar ya zyada rahe...",
    answer: "Jab maal nisaab ke barabar ya zyada ho aur ek saal guzre, tab zakat wajib hoti hai.",
    ref: "Fatawa Alamgiri, Vol. 2",
    scholar: "Mufti Khalid Ansari"
  },
  {
    id: 2,
    title: "Roze ke dauran toothpaste lagana jaiz hai?",
    short: "Toothpaste agar munh ke andar chala jaye...",
    answer: "Agar toothpaste ka koi hissa andar chala gaya to roza toot jata hai. Behtar hai miswak ya brush bina paste ke karein.",
    ref: "Bahishti Zewar, Part 2",
    scholar: "Mufti Anas Qasmi"
  }
];

// 🔹 Elements
const qaList = document.getElementById('qaList');
const singleView = document.getElementById('singleView');
const qaCard = document.getElementById('qaCard');
const highlighted = document.getElementById('highlighted');

// 🔹 Display All Questions
function loadQuestions() {
  qaList.innerHTML = questions.map(q => `
    <div class="qa-card" onclick="openQuestion(${q.id})">
      <h3>${q.title}</h3>
      <p>${q.short}</p>
    </div>
  `).join('');

  highlighted.innerHTML = questions.slice(0,3).map(q => `
    <div class="slide">
      <h3>${q.title}</h3>
      <a href="javascript:void(0)" onclick="openQuestion(${q.id})">Read More →</a>
    </div>
  `).join('');
}
loadQuestions();

// 🔹 Open Question inside same page
function openQuestion(id) {
  const q = questions.find(q => q.id === id);
  qaList.style.display = "none";
  document.querySelector(".slider").style.display = "none";
  singleView.classList.remove("hidden");
  qaCard.innerHTML = `
    <div class="qa-card" id="shareArea" style="background:linear-gradient(135deg,#198754,#1e1e1e);color:white;">
      <h2>${q.title}</h2>
      <p>${q.answer}</p>
      <em>${q.ref}</em><br>
      <small>Answered by: ${q.scholar}</small>
    </div>
  `;
}

// 🔹 Back to homepage
document.getElementById('backBtn').addEventListener('click', () => {
  singleView.classList.add('hidden');
  qaList.style.display = "block";
  document.querySelector(".slider").style.display = "block";
});

// 🔹 Theme toggle
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️';
}

// 🔹 Share Feature (Direct Mobile Share)
document.getElementById('shareBtn').addEventListener('click', async () => {
  const area = document.getElementById('shareArea');
  const canvas = await html2canvas(area);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], 'darulmasail.png', { type: 'image/png' });

  if (navigator.share) {
    await navigator.share({
      title: 'DarulMasail Islamic Q&A',
      text: 'Check this Islamic answer from DarulMasail:',
      files: [file]
    }).catch(console.error);
  } else {
    // fallback download for desktop
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'darulmasail.png';
    link.click();
  }
});
/*
// 🕌 Get user's location and fetch Namaz times
navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  fetchPrayerTimes(lat, lng);
});
*/
// 🌙 Load Salah Times with Default Delhi + "Use My Location" option
async function fetchPrayerTimes(lat, lng, cityName = "Delhi") {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
    const data = await res.json();
    const t = data.data.timings;

    const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let listHTML = `
      <h3>🕌 Salah Times - ${cityName}</h3>
      <ul style="list-style:none;padding:0;margin:5px 0;">
    `;

    prayerNames.forEach(name => {
      const time12 = convertTo12Hour(t[name]);
      listHTML += `<li><b>${name}:</b> ${time12}</li>`;
    });

    listHTML += `
      </ul>
      <button onclick="useMyLocation()" 
        style="background:#198754;color:#fff;border:none;padding:6px 12px;
        border-radius:6px;cursor:pointer;">📍 Use My Location</button>
    `;

    document.getElementById("namazTimes").innerHTML = listHTML;

    // Show human readable address
    showAddress(lat, lng);
  } catch (e) {
    console.error(e);
    document.getElementById("namazTimes").textContent = "Error fetching Salah times.";
  }
}

// 🧭 Convert 24-hour → 12-hour format
function convertTo12Hour(time24) {
  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// 🗺 Show human readable location (OpenStreetMap)
async function showAddress(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    document.getElementById("location").innerText = `📍 ${data.display_name}`;
  } catch {
    document.getElementById("location").innerText = `📍 Latitude: ${lat.toFixed(2)}, Longitude: ${lng.toFixed(2)}`;
  }
}

// 📍 Detect user location or fallback to Delhi
function useMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        fetchPrayerTimes(lat, lng, "Your Location");
      },
      () => {
        alert("Location permission denied! Using Delhi as default.");
        fetchPrayerTimes(28.6139, 77.2090, "Delhi");
      }
    );
  } else {
    alert("Geolocation not supported on this device.");
    fetchPrayerTimes(28.6139, 77.2090, "Delhi");
  }
}

// 🔹 On Page Load → Default Delhi
window.addEventListener("load", () => {
  fetchPrayerTimes(28.6139, 77.2090, "Delhi");
});
function filterCategory(cat) {
  document.querySelectorAll('.qa-card').forEach(c=>{
    c.style.display = (cat==='all' || c.dataset.cat===cat) ? 'block' : 'none';
  });
}
/*
let currentTheme = 'dark';
function setTheme(theme){
  currentTheme = theme;
  const area = document.getElementById('qaCard'); // 🔹 पहले 'shareArea' था
  if(area) {
    area.className = `qa-card answer-card ${theme}`;
  }
}
*/
let currentTheme = 'dark';

function setTheme(theme) {
  currentTheme = theme;

  // 🎯 सिर्फ पूरे Q&A area का background बदले
  const qaArea = document.getElementById('qaArea');
  if (qaArea) qaArea.className = `qa-area ${theme}`;

  // 🎯 और अंदर वाले card का color भी बदले
  const qaCard = document.getElementById('qaCard');
  if (qaCard) qaCard.className = `qa-card answer-card ${theme}`;
}
/*
function toggleMenu() {
  document.getElementById('sideMenu').classList.toggle('show');
}
*/

function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  menu.classList.toggle('show');
}
// 🟥 Close button action
document.getElementById('closeMenu').addEventListener('click', () => {
  document.getElementById('sideMenu').classList.remove('show');
});
// Hide menu on outside click
window.addEventListener('click', function(e) {
  const menu = document.getElementById('sideMenu');
  const btn = document.getElementById('menuBtn');
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('show');
  }
});

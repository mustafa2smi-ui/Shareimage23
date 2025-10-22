// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Prayer Times (Mock data - in a real app, you'd use an API)
function updatePrayerTimes() {
    // This is mock data - in production, you would fetch from an API based on user location
    const times = {
        fajr: '5:30 AM',
        dhuhr: '12:30 PM',
        asr: '4:00 PM',
        maghrib: '6:45 PM',
        isha: '8:15 PM'
    };
    
    document.getElementById('fajr-time').textContent = times.fajr;
    document.getElementById('dhuhr-time').textContent = times.dhuhr;
    document.getElementById('asr-time').textContent = times.asr;
    document.getElementById('maghrib-time').textContent = times.maghrib;
    document.getElementById('isha-time').textContent = times.isha;
}

// Auto-Sliding Questions
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    // Wrap around if at the end
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    currentSlide = index;
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active class
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
}

// Next/Previous buttons
document.querySelector('.next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

document.querySelector('.prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

// Auto-advance slides
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Share functionality (for question pages)
function initializeShare() {
    const shareBtn = document.getElementById('share-btn');
    const colorPicker = document.getElementById('color-picker');
    const colorOptions = document.querySelectorAll('.color-option');
    let selectedColor = '#ffffff';
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            colorPicker.style.display = colorPicker.style.display === 'flex' ? 'none' : 'flex';
        });
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
                selectedColor = option.getAttribute('data-color');
                
                // Generate and share the image
                generateShareImage(selectedColor);
            });
        });
    }
}

function generateShareImage(bgColor) {
    // In a real implementation, you would use html2canvas library
    // This is a simplified version that just opens a share dialog
    
    const questionTitle = document.querySelector('.question-page h1').textContent;
    const siteUrl = window.location.origin;
    
    // For mobile devices, try to use the Web Share API
    if (navigator.share) {
        navigator.share({
            title: questionTitle,
            text: 'Check out this Islamic question and answer',
            url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for desktop - copy to clipboard
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                prompt('Copy this link to share:', shareUrl);
            });
    }
    
    // Hide color picker after selection
    document.getElementById('color-picker').style.display = 'none';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updatePrayerTimes();
    initializeShare();
});

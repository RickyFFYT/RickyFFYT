// Dracaryn Studio - Main JavaScript File
console.log("mainScript.js loaded");

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let moonIcon, sunIcon; // Declare them here

if (themeToggle) {
    moonIcon = themeToggle.querySelector('.moon');
    sunIcon = themeToggle.querySelector('.sun');
} else {
    console.error("Theme toggle button not found! Icons cannot be selected.");
}

// Function to update icon visibility based on current theme
function updateIconVisibility() {
    if (!moonIcon || !sunIcon) return; // Guard clause if icons aren't found

    if (body.classList.contains('dark-mode')) {
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
    } else {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
    }
}

// Function to apply the saved theme or default to dark
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no theme is saved, or if saved theme is 'dark'
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    } else { // This covers savedTheme === 'dark' or savedTheme === null
        body.classList.add('dark-mode');
    }
    if (themeToggle) updateIconVisibility(); // Update icons after setting theme
}

// Function to toggle theme
function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    if (themeToggle) updateIconVisibility(); // Update icons after toggling theme
}

// Event listener for the toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
} else {
    // Error already logged above if button not found
}

// Apply theme on initial load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure DOM is fully loaded before trying to access button for icons
    if (!themeToggle) { // Re-check in case it wasn't found initially by script order
        const button = document.getElementById('theme-toggle');
        if (button) {
            moonIcon = button.querySelector('.moon');
            sunIcon = button.querySelector('.sun');
        } else {
            console.error("Theme toggle button still not found on DOMContentLoaded!");
            return; // Exit if button isn't there
        }
    }
    applyInitialTheme();
});

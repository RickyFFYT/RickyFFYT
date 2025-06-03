// Dracaryn Studio - Main JavaScript File
console.log("mainScript.js loaded");

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply the saved theme or default to dark
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no theme is saved, or if saved theme is 'dark'
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        themeToggle.textContent = 'Dark Mode';
    } else { // This covers savedTheme === 'dark' or savedTheme === null
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Light Mode';
    }
}

// Function to toggle theme
function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Dark Mode';
    }
}

// Event listener for the toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
} else {
    console.error("Theme toggle button not found!");
}

// Apply theme on initial load
document.addEventListener('DOMContentLoaded', applyInitialTheme);

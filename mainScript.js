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

// === Animated Background Lines ===
(function() {
    const canvas = document.getElementById('bg-lines');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let points = [];
    const POINTS = 32;
    const LINE_DIST = 180;
    const MOUSE_DIST = 110;
    let mouse = { x: -1000, y: -1000 };
    let animationId;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Re-generate points
        points = [];
        for (let i = 0; i < POINTS; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        // Draw lines
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    // If mouse is near the line, fade it out
                    const mx = mouse.x;
                    const my = mouse.y;
                    // Distance from mouse to line segment
                    const t = ((mx - p1.x) * (p2.x - p1.x) + (my - p1.y) * (p2.y - p1.y)) / (dist * dist);
                    const closestX = p1.x + t * (p2.x - p1.x);
                    const closestY = p1.y + t * (p2.y - p1.y);
                    const dMouse = Math.sqrt((mx - closestX) ** 2 + (my - closestY) ** 2);
                    let alpha = 0.22;
                    if (dMouse < MOUSE_DIST) {
                        alpha *= 1 - (MOUSE_DIST - dMouse) / MOUSE_DIST;
                    }
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    // Gradient color
                    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    grad.addColorStop(0, '#7f8cfa');
                    grad.addColorStop(1, '#764ba2');
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        // Draw points
        for (const p of points) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(102,126,234,0.55)';
            ctx.shadowColor = '#764ba2';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
        }
    }

    function update() {
        for (const p of points) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }
    }

    function animate() {
        update();
        draw();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Theme adaptation
    function updateTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            canvas.style.background = 'linear-gradient(120deg, #23243a 0%, #3a2c4a 100%)';
        } else {
            canvas.style.background = 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)';
        }
    }
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateTheme();

    resize();
    animate();
})();

// === Sidebar Menu Interactivity ===
(function() {
    const menuIcon = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar-menu');
    if (!menuIcon || !sidebar) return;
    function toggleSidebar() {
        menuIcon.classList.toggle('active');
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            sidebar.setAttribute('aria-hidden', 'false');
            menuIcon.setAttribute('aria-label', 'Close navigation');
        } else {
            sidebar.setAttribute('aria-hidden', 'true');
            menuIcon.setAttribute('aria-label', 'Open navigation');
        }
    }
    menuIcon.addEventListener('click', toggleSidebar);
    menuIcon.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
        }
    });
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
            sidebar.classList.remove('open');
            menuIcon.classList.remove('active');
            sidebar.setAttribute('aria-hidden', 'true');
            menuIcon.setAttribute('aria-label', 'Open navigation');
        }
    });
})();

// === Card Entrance Animation on Scroll ===
(function() {
    function animateCards() {
        const cards = document.querySelectorAll('.portfolio-card');
        const trigger = window.innerHeight * 0.92;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < trigger) {
                card.classList.add('animated-card');
            }
        });
    }
    window.addEventListener('scroll', animateCards);
    window.addEventListener('resize', animateCards);
    document.addEventListener('DOMContentLoaded', animateCards);
})();

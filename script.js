// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '0px', threshold: 0.1 });

document.head.insertAdjacentHTML('beforeend', `
    <style>
        .timeline-item,
        .expertise-card,
        .stat,
        .contact-link {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .timeline-item.visible,
        .expertise-card.visible,
        .stat.visible,
        .contact-link.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .nav-links a.active::after {
            transform: scaleX(1) !important;
        }
        .code-cursor {
            display: inline-block;
            width: 2px;
            height: 1.1em;
            background: #0079bf;
            animation: blink 1s step-end infinite;
            vertical-align: text-bottom;
            margin-left: 1px;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
    </style>
`);

document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(item);
});

document.querySelectorAll('.expertise-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
    observer.observe(card);
});

document.querySelectorAll('.stat').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
});

document.querySelectorAll('.contact-link').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
    observer.observe(el);
});

// Nav transparency on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.style.background = window.pageYOffset > 50
        ? 'rgba(13, 13, 13, 0.97)'
        : 'rgba(13, 13, 13, 0.92)';
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}, { passive: true });

// Typing effect for code block
const codeElement = document.querySelector('.code-block code');
if (codeElement) {
    const originalHTML = codeElement.innerHTML;
    codeElement.innerHTML = '<span class="code-cursor"></span>';

    const parseHTML = (html) => {
        const tokens = [];
        const regex = /(<[^>]+>)|([^<]+)/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            if (match[1]) tokens.push({ type: 'tag', value: match[1] });
            else if (match[2]) tokens.push({ type: 'text', value: match[2] });
        }
        return tokens;
    };

    const tokens = parseHTML(originalHTML);
    let currentHTML = '';
    let tokenIndex = 0;
    let charIndex = 0;

    const typeNextChar = () => {
        if (tokenIndex >= tokens.length) {
            codeElement.innerHTML = currentHTML + '<span class="code-cursor"></span>';
            return;
        }

        const token = tokens[tokenIndex];

        if (token.type === 'tag') {
            currentHTML += token.value;
            tokenIndex++;
            typeNextChar();
        } else {
            if (charIndex < token.value.length) {
                currentHTML += token.value[charIndex];
                charIndex++;
                codeElement.innerHTML = currentHTML + '<span class="code-cursor"></span>';

                const char = token.value[charIndex - 1];
                let delay = 32;
                if (char === '\n') delay = 90;
                else if (char === ' ') delay = 18;
                else if (Math.random() > 0.88) delay = 70;

                setTimeout(typeNextChar, delay);
            } else {
                charIndex = 0;
                tokenIndex++;
                typeNextChar();
            }
        }
    };

    setTimeout(typeNextChar, 700);
}

// Console easter egg
console.log('%c~/blake', 'font-family: monospace; font-size: 18px; font-weight: bold; color: #3dc9a0;');
console.log('%c$ whoami', 'font-family: monospace; font-size: 13px; color: #3dc9a0;');
console.log('%cprincipal backend engineer. curious about the source? view-source is your friend.', 'font-family: monospace; font-size: 12px; color: #808080;');

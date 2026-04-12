const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

[
    ['.timeline-item', 0.08],
    ['.expertise-card', 0.06],
    ['.contact-link', 0.07],
].forEach(([selector, delay]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.style.transitionDelay = `${i * delay}s`;
        observer.observe(el);
    });
});

const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
    if (atBottom) {
        current = sections[sections.length - 1].getAttribute('id');
    } else {
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', new URL(link.href).hash === `#${current}`);
    });
}, { passive: true });

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

const codeElement = document.querySelector('.code-block code');
if (codeElement) {
    const doc = new DOMParser().parseFromString(`<code>${codeElement.innerHTML}</code>`, 'text/html');
    const sourceNodes = Array.from(doc.querySelector('code').childNodes);

    const cursor = document.createElement('span');
    cursor.className = 'code-cursor';
    codeElement.innerHTML = '';
    codeElement.appendChild(cursor);

    let nodeIndex = 0;
    let charIndex = 0;
    let currentEl = null;

    const typeNextChar = () => {
        if (nodeIndex >= sourceNodes.length) return;

        const node = sourceNodes[nodeIndex];
        const text = node.textContent;

        if (charIndex === 0) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                currentEl = document.createElement(node.tagName.toLowerCase());
                currentEl.className = node.className;
            } else {
                currentEl = document.createTextNode('');
            }
            codeElement.insertBefore(currentEl, cursor);
        }

        currentEl.textContent += text[charIndex];
        const char = text[charIndex];
        charIndex++;

        if (charIndex >= text.length) {
            charIndex = 0;
            nodeIndex++;
            currentEl = null;
        }

        let delay = 32;
        if (char === '\n') delay = 90;
        else if (char === ' ') delay = 18;
        else if (Math.random() > 0.88) delay = 70;

        setTimeout(typeNextChar, delay);
    };

    setTimeout(typeNextChar, 700);
}

console.log('%c~/blake', 'font-family: monospace; font-size: 18px; font-weight: bold; color: #3dc9a0;');
console.log('%c$ whoami', 'font-family: monospace; font-size: 13px; color: #3dc9a0;');
console.log('%cprincipal backend engineer. curious about the source? view-source is your friend.', 'font-family: monospace; font-size: 12px; color: #808080;');

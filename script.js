/* ─────────────────────────────────────────────
   AKHIL PALAVARAPU — Portfolio JS
   - Nav scroll state
   - Mobile menu
   - Scroll-reveal animations
   - ARIA: real AI chatbot via Anthropic API
   - Copy email
───────────────────────────────────────────── */

'use strict';

// ── NAV SCROLL STATE ──────────────────────
const nav = document.getElementById('nav');
function onScroll() {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── MOBILE MENU ───────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !mobileMenu.hidden) {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileMenu.hidden) {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

// ── SCROLL REVEAL ─────────────────────────
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...revealEls].filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight;
    });
    const delay = Math.max(0, siblings.indexOf(entry.target)) * 80;
    setTimeout(() => entry.target.classList.add('is-visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── SMOOTH SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.getBoundingClientRect().height - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── COPY EMAIL ────────────────────────────
const copyBtn = document.getElementById('copy-btn');
const copyLabel = document.getElementById('copy-label');
const EMAIL = 'akhilpalavarapu08@gmail.com';
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: EMAIL });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    copyLabel.textContent = '✓ Copied!';
    copyBtn.style.cssText = 'border-color:rgba(34,197,94,0.4);color:#4ade80';
    setTimeout(() => { copyLabel.textContent = 'Copy Email'; copyBtn.style.cssText = ''; }, 2000);
  });
}

// ── STAGGER SKILL CARDS ───────────────────
const skillCards = document.querySelectorAll('.skill-card');
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    skillCards.forEach((card, i) => setTimeout(() => card.classList.add('is-visible'), i * 90));
  }, { threshold: 0.15 }).observe(skillsSection);
}

// ── NAV ACTIVE LINK ───────────────────────
const navLinks = document.querySelectorAll('.nav-link');
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${entry.target.id}`
        ? 'var(--c-violet-lt)' : '';
    });
  });
}, { threshold: 0.4, rootMargin: '-60px 0px 0px 0px' })
  .observe(...document.querySelectorAll('section[id]'));

// ── ARIA — REAL AI CHATBOT ────────────────
const ARIA_SYSTEM = `You are ARIA, an AI assistant embedded in Akhil Palavarapu's design portfolio.
Akhil is a UI/UX Designer with 3+ years of experience. His skills include UI Design, UX Research, Wireframing, Prototyping, Figma, and Design Systems.
His featured project is ARIA — an AI Chat Interface focused on accessibility-first design, conversational UI patterns, motion language, and cross-platform responsive layout.
Contact: akhilpalavarapu08@gmail.com

Be helpful, warm, and concise. Answer questions about Akhil's work, skills, design philosophy, and how to hire or collaborate with him.
Keep responses short — 1-3 sentences max. You're living inside a small chat widget so brevity matters.
If someone asks something unrelated to Akhil or design, gently steer back.`;

const ariaMessages = document.getElementById('aria-messages');
const ariaInput = document.getElementById('aria-input');
const ariaSend = document.getElementById('aria-send');

// Conversation history for context
const conversationHistory = [];

function appendMsg(text, role) {
  const div = document.createElement('div');
  div.className = `aria-msg aria-msg--${role === 'user' ? 'user' : 'bot'}`;
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(p);
  div.style.opacity = '0';
  div.style.transform = 'translateY(8px)';
  div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  ariaMessages.appendChild(div);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateY(0)';
  }));
  ariaMessages.scrollTop = ariaMessages.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'aria-msg aria-msg--bot aria-msg--typing';
  div.id = 'aria-typing';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  ariaMessages.appendChild(div);
  ariaMessages.scrollTop = ariaMessages.scrollHeight;
  return div;
}

function setLoading(loading) {
  ariaInput.disabled = loading;
  ariaSend.disabled = loading;
  ariaSend.style.opacity = loading ? '0.5' : '';
}

async function sendMessage() {
  const text = ariaInput.value.trim();
  if (!text) return;

  ariaInput.value = '';
  appendMsg(text, 'user');
  conversationHistory.push({ role: 'user', content: text });

  setLoading(true);
  const typingEl = showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: ARIA_SYSTEM,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.find(b => b.type === 'text')?.text || "I'm not sure how to answer that right now.";

    typingEl.remove();
    appendMsg(reply, 'bot');
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    appendMsg("Sorry, I couldn't connect right now. Try emailing Akhil directly at akhilpalavarapu08@gmail.com.", 'bot');
    console.error('ARIA error:', err);
  } finally {
    setLoading(false);
    ariaInput.focus();
  }
}

ariaSend.addEventListener('click', sendMessage);
ariaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

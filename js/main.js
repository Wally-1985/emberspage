// ============================================================
// EMBERS AND ASH — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initEmbers();
  initFooterYear();
  initInquiryForm();
});

/* Header background on scroll */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile nav toggle */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const header = document.getElementById('siteHeader');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  header.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
}

/* Rising ember particles in hero */
function initEmbers() {
  const field = document.getElementById('emberField');
  if (!field) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'ember-particle';
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 5 + Math.random() * 5;
    const drift = (Math.random() * 80 - 40) + 'px';
    const size = 3 + Math.random() * 4;

    p.style.left = left + '%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDelay = delay + 's';
    p.style.animationDuration = duration + 's';
    p.style.setProperty('--drift', drift);

    field.appendChild(p);
  }
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   Inquiry form
   ------------------------------------------------------------
   This is wired to submit as a simple POST. Out of the box it
   has no backend, so it just validates and shows a status
   message. To make it actually deliver enquiries, pick ONE of:

   1. Formspree / Web3Forms / Basin (no server needed):
      - Sign up, get an endpoint URL
      - Set FORM_ENDPOINT below to that URL
      - Uncomment the fetch() call in handleSubmit()

   2. Your own backend (e.g. a small PHP/Node script on the
      Binary Lane server) that emails the form contents.

   3. A "mailto:" fallback (already included below as a basic
      no-backend option) — opens the user's email client
      pre-filled with their enquiry.
   ============================================================ */

const FORM_ENDPOINT = ''; // <-- paste your Formspree/Web3Forms endpoint here when ready

function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.removeAttribute('data-state');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    if (FORM_ENDPOINT) {
      try {
        status.textContent = 'Sending…';
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          status.textContent = "Thanks! We'll be in touch soon.";
          status.setAttribute('data-state', 'success');
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        status.textContent = "Something went wrong sending that — please email hello@embersandash.com.au directly.";
        status.setAttribute('data-state', 'error');
      }
      return;
    }

    // Fallback: no endpoint configured yet — open a pre-filled email.
    const subject = encodeURIComponent(`Event enquiry — ${data.eventType || 'New booking'} (${data.eventDate || 'date TBC'})`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || '-'}\n` +
      `Event type: ${data.eventType}\nDate: ${data.eventDate}\nGuests: ${data.guests || '-'}\n` +
      `Location: ${data.location || '-'}\n\nMessage:\n${data.message || '-'}`
    );
    window.location.href = `mailto:hello@embersandash.com.au?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email client to send this through…";
    status.setAttribute('data-state', 'success');
  });
}

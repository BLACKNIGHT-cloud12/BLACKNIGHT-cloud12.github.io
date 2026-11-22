/**
 * Main Portfolio UI Logic & Interactions
 */

(function () {
  'use strict';

  // 1. Theme Toggle (Dark / Light)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      // Default to Dark Mode for high-tech aesthetic
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    updateThemeIcons();
  }

  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.sun-icon').forEach(el => el.classList.toggle('hidden', isDark));
    document.querySelectorAll('.moon-icon').forEach(el => el.classList.toggle('hidden', !isDark));
  }

  themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
  initTheme();

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Dynamic Data Population from config.js
  function populateProfile() {
    const config = window.SITE_CONFIG;
    if (!config) return;

    // Profile Details
    const nameEls = document.querySelectorAll('.profile-name');
    nameEls.forEach(el => el.textContent = config.profile.name);

    const titleEls = document.querySelectorAll('.profile-title');
    titleEls.forEach(el => el.textContent = config.profile.title);

    const statusEl = document.querySelector('.profile-status');
    if (statusEl && config.profile.statusBadge) statusEl.textContent = config.profile.statusBadge;

    const shortBioEl = document.querySelector('.profile-short-bio');
    if (shortBioEl) shortBioEl.textContent = config.profile.shortBio;

    const aboutTextEl = document.querySelector('.profile-about-text');
    if (aboutTextEl && config.profile.about) {
      aboutTextEl.textContent = config.profile.about.trim();
    }

    const avatarEl = document.getElementById('profile-avatar-img');
    if (avatarEl && config.profile.avatar) {
      avatarEl.src = config.profile.avatar;
    }

    // Social links
    if (config.profile.socials) {
      const gitLinks = document.querySelectorAll('.link-github');
      gitLinks.forEach(el => el.href = config.profile.socials.github);

      const inLinks = document.querySelectorAll('.link-linkedin');
      inLinks.forEach(el => el.href = config.profile.socials.linkedin);

      const twLinks = document.querySelectorAll('.link-twitter');
      twLinks.forEach(el => el.href = config.profile.socials.twitter);

      const mailLinks = document.querySelectorAll('.link-email');
      mailLinks.forEach(el => el.href = config.profile.socials.email);
    }

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && config.skills) {
      skillsContainer.innerHTML = config.skills.map(cat => `
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/50">
          <h3 class="text-lg font-bold mb-4 text-indigo-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            ${cat.category}
          </h3>
          <div class="flex flex-wrap gap-2">
            ${cat.items.map(skill => `
              <span class="px-3 py-1.5 rounded-lg text-sm bg-slate-800/80 light:bg-slate-200/80 text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300 font-medium hover:border-indigo-500/50 transition-colors">
                ${skill.name}
              </span>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // Render Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer && config.projects) {
      projectsContainer.innerHTML = config.projects.map(proj => `
        <div class="glass-panel spotlight-card card-hover-effect rounded-2xl p-7 flex flex-col justify-between border border-slate-800 light:border-slate-200">
          <div>
            <div class="flex items-center justify-between mb-4">
              ${proj.badge ? `
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-mono">
                  ${proj.badge}
                </span>
              ` : '<span></span>'}
              <div class="flex items-center gap-3">
                ${proj.github ? `
                  <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="View Source">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </a>
                ` : ''}
              </div>
            </div>
            <h4 class="text-xl font-bold mb-3 text-slate-100 light:text-slate-900 tracking-tight">${proj.title}</h4>
            <p class="text-slate-400 light:text-slate-600 text-sm mb-6 leading-relaxed">${proj.description}</p>
          </div>
          <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200">
            ${proj.tags.map(t => `<span class="text-xs px-2.5 py-1 rounded-md bg-slate-900 light:bg-slate-200 text-slate-300 light:text-slate-700 font-mono border border-slate-800">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Render Experience Timeline
    const expContainer = document.getElementById('experience-container');
    if (expContainer && config.experience) {
      expContainer.innerHTML = config.experience.map(item => `
        <div class="relative pl-8 pb-8 border-l-2 border-indigo-500/30 last:pb-0">
          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900 light:border-white"></div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
            <h4 class="text-lg font-bold text-slate-100 light:text-slate-900">${item.role}</h4>
            <span class="text-xs font-mono text-indigo-400">${item.period}</span>
          </div>
          <div class="text-sm font-medium text-slate-400 mb-2">${item.company}</div>
          <p class="text-slate-400 light:text-slate-600 text-sm leading-relaxed">${item.description}</p>
        </div>
      `).join('');
    }

    // Render Featured Blog Posts on Homepage
    const featuredPostsContainer = document.getElementById('featured-posts-container');
    if (featuredPostsContainer && config.posts) {
      featuredPostsContainer.innerHTML = config.posts.slice(0, 3).map(post => `
        <a href="post.html?slug=${post.slug}" class="glass-panel card-hover-effect rounded-2xl p-6 block border border-slate-800 light:border-slate-200">
          <div class="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span>${post.date}</span>
            <span>•</span>
            <span>${post.readingTime}</span>
          </div>
          <h4 class="text-lg font-bold mb-2 text-slate-100 light:text-slate-900 group-hover:text-indigo-400 transition-colors">
            ${post.title}
          </h4>
          <p class="text-slate-400 light:text-slate-600 text-sm mb-4 line-clamp-2">
            ${post.excerpt}
          </p>
          <div class="flex flex-wrap gap-2">
            ${post.tags.map(tag => `<span class="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">${tag}</span>`).join('')}
          </div>
        </a>
      `).join('');
    }
  }

  // 4. Spotlight Card Hover Effect (ai-website-aesthetics)
  function initSpotlightCards() {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  // 5. Magnetic DOM Elements (3d-hero-interactions)
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover)').matches) return; // Skip on touch per 3d-hero-interactions

    document.querySelectorAll('.magnetic-target').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < 80) {
          const pullX = Math.max(-8, Math.min(8, dx * 0.18));
          const pullY = Math.max(-8, Math.min(8, dy * 0.18));
          btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
        }
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 6. Copy Email Interactions (Personal & College)
  function setupCopyButton(btnId, emailAddress, label) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailAddress).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span class="text-emerald-400 font-medium">Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2200);
      });
    });
  }

  const personalEmail = window.SITE_CONFIG?.profile?.emails?.personal || 'soumikghosh30.03.07@gmail.com';
  const collegeEmail = window.SITE_CONFIG?.profile?.emails?.college || 'soumikg.civil.ug@jadavpuruniversity.in';

  setupCopyButton('copy-personal-email-btn', personalEmail, 'Personal');
  setupCopyButton('copy-college-email-btn', collegeEmail, 'College');
  setupCopyButton('copy-email-btn', personalEmail, 'Email');

  // Initialize
  function initAll() {
    populateProfile();
    initSpotlightCards();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

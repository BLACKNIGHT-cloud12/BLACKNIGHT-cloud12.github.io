/**
 * Blog Listing & Markdown Post Renderer
 */

(function () {
  'use strict';

  const config = window.SITE_CONFIG;

  // 1. Blog Index Page Logic
  function initBlogList() {
    const blogListContainer = document.getElementById('blog-posts-list');
    const searchInput = document.getElementById('blog-search');
    const tagsContainer = document.getElementById('blog-tags-filter');

    if (!blogListContainer || !config || !config.posts) return;

    let activeTag = 'all';
    let searchQuery = '';

    // Collect all unique tags
    const allTags = new Set(['all']);
    config.posts.forEach(post => post.tags.forEach(t => allTags.add(t)));

    // Render tag filter buttons
    if (tagsContainer) {
      tagsContainer.innerHTML = Array.from(allTags).map(tag => `
        <button data-tag="${tag}" class="tag-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
          tag === 'all'
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
        }">
          ${tag === 'all' ? 'All Articles' : '#' + tag}
        </button>
      `).join('');

      tagsContainer.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          activeTag = e.target.dataset.tag;
          tagsContainer.querySelectorAll('.tag-filter-btn').forEach(b => {
            b.className = `tag-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              b.dataset.tag === activeTag
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`;
          });
          renderFilteredPosts();
        });
      });
    }

    // Filter and render posts
    function renderFilteredPosts() {
      const filtered = config.posts.filter(post => {
        const matchesTag = activeTag === 'all' || post.tags.includes(activeTag);
        const matchesSearch = !searchQuery || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTag && matchesSearch;
      });

      if (filtered.length === 0) {
        blogListContainer.innerHTML = `
          <div class="text-center py-16 glass-panel rounded-2xl">
            <svg class="w-12 h-12 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-lg font-bold text-slate-300 mb-1">No articles found</h3>
            <p class="text-sm text-slate-500">Try adjusting your search query or tag filter.</p>
          </div>
        `;
        return;
      }

      blogListContainer.innerHTML = filtered.map(post => `
        <article class="glass-panel card-hover-effect rounded-2xl p-6 md:p-8 border border-slate-800 light:border-slate-200">
          <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
            <span class="font-mono text-violet-400">${post.date}</span>
            <span>•</span>
            <span>${post.readingTime}</span>
          </div>
          <h2 class="text-xl md:text-2xl font-bold mb-3 text-slate-100 light:text-slate-900">
            <a href="post.html?slug=${post.slug}" class="hover:text-violet-400 transition-colors">
              ${post.title}
            </a>
          </h2>
          <p class="text-slate-400 light:text-slate-600 mb-5 leading-relaxed text-sm md:text-base">
            ${post.excerpt}
          </p>
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 light:border-slate-200">
            <div class="flex flex-wrap gap-2">
              ${post.tags.map(t => `<span class="text-xs px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">#${t}</span>`).join('')}
            </div>
            <a href="post.html?slug=${post.slug}" class="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group">
              Read article
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </article>
      `).join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderFilteredPosts();
      });
    }

    renderFilteredPosts();
  }

  // 2. Single Post Reader Page Logic
  async function initPostReader() {
    const postContainer = document.getElementById('post-article-content');
    if (!postContainer || !config) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      showPostError('No article specified. Please return to the blog list.');
      return;
    }

    const postMeta = config.posts.find(p => p.slug === slug);
    if (!postMeta) {
      showPostError(`Article "${slug}" could not be found.`);
      return;
    }

    // Update document title and metadata
    document.title = `${postMeta.title} | ${config.profile.name}`;
    const titleEl = document.getElementById('post-title');
    const dateEl = document.getElementById('post-date');
    const readTimeEl = document.getElementById('post-reading-time');
    const tagsEl = document.getElementById('post-tags');

    if (titleEl) titleEl.textContent = postMeta.title;
    if (dateEl) dateEl.textContent = postMeta.date;
    if (readTimeEl) readTimeEl.textContent = postMeta.readingTime;
    if (tagsEl) {
      tagsEl.innerHTML = postMeta.tags.map(t => `<span class="px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-mono">#${t}</span>`).join('');
    }

    // Fetch and render markdown
    try {
      const response = await fetch(postMeta.file);
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.statusText}`);
      }
      const rawMarkdown = await response.text();

      // Configure marked with highlight.js
      if (window.marked) {
        marked.setOptions({
          highlight: function (code, lang) {
            if (window.hljs) {
              const language = hljs.getLanguage(lang) ? lang : 'plaintext';
              return hljs.highlight(code, { language }).value;
            }
            return code;
          },
          gfm: true,
          breaks: true
        });

        postContainer.innerHTML = marked.parse(rawMarkdown);
      } else {
        postContainer.innerHTML = `<pre class="p-4 bg-slate-900 text-slate-200">${rawMarkdown}</pre>`;
      }

      // Add copy button to code blocks
      addCopyButtons(postContainer);

      // Render Next & Prev post navigation
      renderPostNavigation(postMeta);

    } catch (err) {
      console.error(err);
      showPostError(`Unable to render markdown file: ${err.message}`);
    }
  }

  function addCopyButtons(container) {
    const preBlocks = container.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.textContent = 'Copy';

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          btn.style.color = '#34d399';
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.style.color = '';
          }, 2000);
        });
      });

      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }

  function renderPostNavigation(currentPost) {
    const navContainer = document.getElementById('post-pagination-nav');
    if (!navContainer || !config || !config.posts) return;

    const currentIndex = config.posts.findIndex(p => p.slug === currentPost.slug);
    const prevPost = currentIndex > 0 ? config.posts[currentIndex - 1] : null;
    const nextPost = currentIndex < config.posts.length - 1 ? config.posts[currentIndex + 1] : null;

    navContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-800">
        ${prevPost ? `
          <a href="post.html?slug=${prevPost.slug}" class="glass-panel p-5 rounded-xl block hover:border-violet-500/50 transition-colors">
            <span class="text-xs text-violet-400 font-mono flex items-center gap-1 mb-1">
              ← Previous Article
            </span>
            <span class="font-bold text-slate-200 line-clamp-1">${prevPost.title}</span>
          </a>
        ` : '<div></div>'}
        ${nextPost ? `
          <a href="post.html?slug=${nextPost.slug}" class="glass-panel p-5 rounded-xl block text-right hover:border-violet-500/50 transition-colors">
            <span class="text-xs text-violet-400 font-mono flex items-center justify-end gap-1 mb-1">
              Next Article →
            </span>
            <span class="font-bold text-slate-200 line-clamp-1">${nextPost.title}</span>
          </a>
        ` : '<div></div>'}
      </div>
    `;
  }

  function showPostError(msg) {
    const postContainer = document.getElementById('post-article-content');
    if (postContainer) {
      postContainer.innerHTML = `
        <div class="text-center py-16 glass-panel rounded-2xl">
          <svg class="w-12 h-12 mx-auto text-rose-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h3 class="text-xl font-bold text-slate-200 mb-2">Error Loading Article</h3>
          <p class="text-slate-400 mb-6 max-w-md mx-auto text-sm">${msg}</p>
          <a href="blog.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors">
            Back to Articles
          </a>
        </div>
      `;
    }
  }

  // Auto-run according to current page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBlogList();
      initPostReader();
    });
  } else {
    initBlogList();
    initPostReader();
  }
})();

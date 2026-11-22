# Modern Developer Portfolio & Blog with Three.js Background

A sleek, responsive, and high-performance personal portfolio and technical blog designed specifically for instant deployment on **GitHub Pages** (`<your-username>.github.io`).

## ✨ Features

- **Interactive 3D Three.js Background**: High-performance particle constellation with floating wireframe geometry that smoothly responds to cursor movement and touches.
- **Dark / Light Mode**: Seamless theme switching with local storage persistence and dynamic Three.js color palette adaptation.
- **Dynamic Content Configuration**: Edit your name, bio, skills, socials, and projects in a single file (`assets/js/config.js`).
- **Markdown Blog Engine**: Render `.md` articles on the fly with syntax highlighting (`highlight.js`), automated "Copy Code" buttons, reading time estimates, and tag filtering.
- **Zero Build Step**: No `npm install`, no `webpack`, no build tool friction. Pushes directly to GitHub Pages and runs instantly.
- **Mobile Responsive**: Full mobile support with a clean hamburger navigation and optimized particle count.

---

## 🚀 Quick Start (Local Preview)

To preview your website locally:

```bash
# Navigate to the portfolio folder
cd portfolio-website

# Start a local static file server using Python 3
python3 -m http.server 8000
```

Open your browser and navigate to:
**`http://localhost:8000`**

---

## 🌐 Deploy to GitHub Pages (`<username>.github.io`)

Follow these simple steps to deploy your site live for free:

### 1. Create a Repository on GitHub
1. Go to [GitHub: New Repository](https://github.com/new).
2. Set the repository name to:
   ```text
   <your-github-username>.github.io
   ```
   *(For example, if your username is `octocat`, name it `octocat.github.io`)*.
3. Make sure the repository is **Public**.
4. Do not initialize with a README, .gitignore, or license (we already have them).

### 2. Push Your Code to GitHub

In your terminal inside this folder:

```bash
git init
git add .
git commit -m "feat: initial release of portfolio and blog with Three.js"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-github-username>.github.io.git
git push -u origin main
```

### 3. Verify GitHub Pages Settings
1. Go to your repo on GitHub -> **Settings** -> **Pages**.
2. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` and folder `/ (root)`
3. Save if prompted.

Your portfolio and blog will be live within 1–2 minutes at:
👉 **`https://<your-github-username>.github.io`**

---

## 🛠️ How to Customize

### 1. Update Profile & Projects
Open `assets/js/config.js` and modify:
- `profile`: Your name, titles, bio, social links (GitHub, LinkedIn, Twitter, Email).
- `skills`: Categorized skill tags (Frontend, Backend, Cloud, etc.).
- `projects`: Featured projects with links to GitHub repos and live demos.
- `experience`: Career milestones and previous roles.

### 2. Add a New Blog Post
1. Create a new markdown file in `assets/posts/your-article-slug.md`.
2. Add an entry to the `posts` array in `assets/js/config.js`:
   ```javascript
   {
     slug: "your-article-slug",
     title: "Your Article Title",
     date: "Nov 25, 2026",
     readingTime: "4 min read",
     tags: ["JavaScript", "Tutorial"],
     excerpt: "A quick summary of the article.",
     file: "assets/posts/your-article-slug.md"
   }
   ```
3. Commit and push. Your article is automatically listed, searchable, and rendered!

### 3. Adjust 3D Background Settings
Open `assets/js/three-bg.js` to tweak:
- `particleCount`: Increase or decrease particle density.
- `THEMES.dark` and `THEMES.light`: Customize particle, line, and fog colors.
- `mouseSensitivity`: Sensitivity to mouse movement.

# Everything You Need to Know to Host Your Portfolio on GitHub Pages

GitHub Pages is one of the greatest gifts to the developer community: free, high-performance static hosting directly backed by GitHub's global CDN, automatic SSL certificates, and custom domain support.

In this guide, we'll walk through the exact steps to publish your portfolio to `https://<username>.github.io` in under 3 minutes.

---

## Step 1: Create Your Repository

GitHub Pages reserves a special repository name format for user landing sites:

```bash
# Naming rule:
<your-github-username>.github.io
```

For example, if your GitHub handle is `octocat`, name your repository:
`octocat.github.io`

> **Note:** The repository must be **Public** on free GitHub accounts to enable GitHub Pages without paid plans.

---

## Step 2: Push Your Code

Initialize git in your website folder and push directly to your default branch (`main`):

```bash
# Initialize git
git init

# Add all files
git add .

# Commit your changes
git commit -m "feat: initial portfolio release with Three.js & blog"

# Set branch to main
git branch -M main

# Link remote and push
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. Navigate to your repository on GitHub.
2. Click **Settings** (gear icon) -> **Pages** (under the "Code and automation" sidebar section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Choose `main` and folder `/ (root)`.
4. Click **Save**.

Within 30–60 seconds, your site will be live at:
`https://<your-username>.github.io`!

---

## Step 4 (Optional): Custom Domain

If you own a custom domain (e.g., `yourname.dev`):
1. Add a file named `CNAME` in the root of your repository containing just your domain:
   ```txt
   yourname.dev
   ```
2. In your DNS provider (Cloudflare, Namecheap, Google Domains, etc.), add an `ALIAS` or `ANAME` record pointing `@` to `<your-username>.github.io`, or `CNAME` pointing `www` to `<your-username>.github.io`.
3. Check the **Enforce HTTPS** checkbox in GitHub Settings -> Pages.

You now have a production-grade personal website with global CDN caching and free SSL!

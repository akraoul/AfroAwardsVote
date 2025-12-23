# Deployment Guide: Afro Awards

## 1. Push to GitHub
I have already initialized the local Git repository for you. Now you need to push it to GitHub.

1.  **Log in to your GitHub account** in your browser.
2.  **Create a New Repository**:
    *   Click the "+" icon -> "New repository".
    *   Name it `AfroAwards` (or similar).
    *   Make it **Public** (required for free GitHub Pages).
    *   **Do NOT** check "Add a README", .gitignore, or license (we already have them).
    *   Click "Create repository".
3.  **Link and Push** (Run these commands in your terminal):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/AfroAwards.git
    git branch -M main
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

## 2. Enable GitHub Pages
Once the code is on GitHub:
1.  Go to the repository **Settings**.
2.  Click **Pages** (in the left sidebar).
3.  Under **Build and deployment** > **Source**, select **"Deploy from a branch"**.
4.  Under **Branch**, select `main` and `/ (root)`.
5.  Click **Save**.
6.  Wait a minute, then refresh. You will see your live URL (e.g., `https://your-username.github.io/AfroAwards/`).

## 3. Connect Database (Supabase)
Your application is **already connected**.
The file `js/supabase-config.js` contains the API details that the frontend uses to talk to the database directly.

**Important Check:**
1.  Go to your **Supabase Dashboard**.
2.  Go to **Authentication** > **URL Configuration**.
3.  Add your new GitHub Pages URL (e.g., `https://your-username.github.io/AfroAwards/`) to the **Site URL** and **Redirect URLs**.
4.  (Optional but recommended) Go to **API Settings** if you need to restrict domains, but by default, it usually works open or you can restrict CORS to your new domain.

## 4. Manager Access
The manager panel will be available at:
`https://your-username.github.io/AfroAwards/manager.html`

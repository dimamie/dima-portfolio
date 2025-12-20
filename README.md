# Dima Portfolio

A clean, responsive single-page portfolio website.

## Tech Stack

- **HTML/CSS/JavaScript** - Static site
- **GSAP** - Animations (via CDN)
- **Vercel Analytics** - Analytics
- **Vercel Serverless Functions** - API endpoints (Spotify integration)
- **Google Fonts** - Inter font family

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Serve locally:
```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173` in your browser.

## Setup Instructions

### GitHub Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name your repository (e.g., `dima-portfolio`)
   - Choose public or private
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

2. **Initialize Git and push to GitHub:**
   ```bash
   cd /Users/dimamiedzianowski/Documents/dima-portfolio
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Vercel Deployment

1. **Connect GitHub to Vercel:**
   - Go to https://vercel.com and sign in (or create an account)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the project settings

2. **Configure Project Settings:**
   - **Framework Preset:** Other (or leave as auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** Leave empty (static site)
   - **Output Directory:** Leave empty (root is output)
   - Click "Deploy"

3. **Environment Variables (Optional - for Spotify integration):**
   If you want to use the Spotify "last played" feature:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add:
     - `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
     - `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
     - `SPOTIFY_REFRESH_TOKEN` - Your Spotify refresh token (obtained via `/api/spotify-callback`)
   - Redeploy after adding variables

4. **Custom Domain (Optional):**
   - In Vercel project settings, go to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Customization

- **Update content:** Edit `index.html` to change text, links, and project information
- **Update styling:** Modify `styles.css` for colors, spacing, and typography
- **Update animations:** Adjust animation settings in `script.js` and `codepen-animation.js`
- **Add assets:** Place images in the `assets/` folder and update references in HTML
- **Favicon:** Replace `assets/Favicon.svg` and `assets/Current-Location-Marker.png` with your own

## Project Structure

```
dima-portfolio/
├── index.html              # Main HTML file
├── styles.css              # Stylesheet
├── script.js               # Main JavaScript
├── codepen-animation.js    # GSAP animations
├── package.json            # Dependencies
├── api/                    # Vercel serverless functions
│   ├── spotify-last-played.js
│   └── spotify-callback.js
└── assets/                 # Images and static assets
```

## Features

- Responsive design (mobile and desktop)
- GSAP animations for hero and contact sections
- Smooth scrolling navigation
- Spotify integration (optional)
- Vercel Analytics integration

## Deploy

The site will automatically deploy to Vercel when you push changes to your main branch on GitHub.


# 🐦 Vireo Loop

Your soft reset button for focus and sobriety.

## 🚀 Deploy to GitHub Pages (3 minutes)

### Step 1: Create Repository
1. Go to [github.com](https://github.com) and click **New Repository**
2. Name it whatever you want (e.g., `vireo-loop`)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we have these files)

### Step 2: Upload Files
You have two options:

**Option A: Drag & Drop (Easiest)**
1. Click **uploading an existing file** on the GitHub page
2. Drag all these files into the upload area:
   - `index.html`
   - `app.js`
   - `icons.js`
   - `styles.css`
   - `README.md` (optional)
3. Click **Commit changes**

**Option B: Git Command Line**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings**
2. Click **Pages** in the left sidebar
3. Under **Source**, select **main** branch
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

That's it! 🎉

---

## 📁 File Structure

```
vireo-loop/
├── index.html      # Main HTML file
├── app.js          # React application logic
├── icons.js        # SVG icon components
├── styles.css      # Custom styles & animations
└── README.md       # This file
```

---

## ✨ Features

- **Daily Loop**: Mood tracking, sleep logging, checkboxes, 7-day timeline
- **Focus Timers**: Stretch (10min), Read (45min), Deep Work (90min), Quick Break (5min)
- **Urge Surf**: 3-minute guided flow for cravings/urges
- **Music Scratchpad**: 20-minute timer with journal export
- **100% Local**: All data stored in browser localStorage
- **No Build Required**: Just upload and go!

---

## 🎨 Customization

### Change Colors
Edit `app.js` line 50 to change the gradient:
```javascript
// Current: Purple theme
className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"

// Teal theme:
className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900"

// Amber theme:
className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900"
```

### Add Timer Presets
Edit `app.js` line 233:
```javascript
const presets = [
  { name: 'Stretch', duration: 10, icon: '🧘', color: 'emerald' },
  { name: 'Read', duration: 45, icon: '📖', color: 'blue' },
  // Add your own:
  { name: 'Meditate', duration: 20, icon: '🧘‍♀️', color: 'purple' },
];
```

### Modify Better Strategies
Edit `app.js` lines 32-38:
```javascript
betterStrategies: [
  "Call someone who understands",
  "Take a walk, even just 5 minutes",
  // Add your own strategies here
]
```

---

## 📱 Install as App (PWA)

### iOS (Safari)
1. Open your GitHub Pages URL
2. Tap the **Share** button
3. Tap **Add to Home Screen**
4. Name it "Vireo Loop"
5. Tap **Add**

### Android (Chrome)
1. Open your GitHub Pages URL
2. Tap the **⋮** menu
3. Tap **Add to Home screen**
4. Name it "Vireo Loop"
5. Tap **Add**

### Desktop (Chrome/Edge)
1. Open your GitHub Pages URL
2. Click the **install icon** (⊕) in the address bar
3. Click **Install**

---

## 💾 Data & Privacy

**Where is my data?**
- Everything is stored in your browser's localStorage
- No accounts, no servers, no tracking
- Data never leaves your device

**Backup your data:**
1. Open browser DevTools (F12)
2. Go to **Application** > **Local Storage**
3. Find key `vireoLoop`
4. Copy the value and save to a text file

**Restore data:**
1. Open DevTools
2. Paste your backup into the `vireoLoop` key
3. Refresh the page

---

## 🛠️ Technical Details

**Built with:**
- React 18 (via CDN)
- Tailwind CSS (via CDN)
- Babel Standalone (for JSX)
- No build process required!

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

**Storage:**
- localStorage (~5-10MB limit)
- Automatically saves after each change
- JSON format for easy backup/export

---

## 🐛 Troubleshooting

**Problem: Site shows 404**
- Solution: Wait 2-3 minutes after enabling Pages, then hard refresh (Ctrl+Shift+R)

**Problem: Data not saving**
- Solution: Check if cookies/localStorage are enabled in browser settings
- Note: Private/Incognito mode may block localStorage

**Problem: Animations not working**
- Solution: Disable "Reduce Motion" in browser/OS accessibility settings

**Problem: Timer not counting down**
- Solution: Keep the browser tab active (browsers pause timers in background tabs)

---

## 🎯 Philosophy

Vireo Loop is:
- **A tool, not a boss** – Skip days without guilt
- **Private by design** – Your data never leaves your device
- **Poetic, not clinical** – Language matters
- **Yours to modify** – Edit the code however you want

---

## 📝 License

MIT License - Do whatever you want with this code. No attribution required.

Built with care for clarity, one day at a time. 🐦✨

# 📦 GIT SETUP & DEPLOYMENT GUIDE

Complete Git workflow for Gmail Smart Cleaner extension.

---

## 🚀 QUICK GIT SETUP (5 MINUTES)

### Step 1: Initialize Git Repository
```bash
cd /Users/srw.aditya/Desktop/codebase/gmail-smart-cleaner
git init
```

### Step 2: Add Remote Repository
```bash
# Option A: If you have a GitHub repo ready
git remote add origin https://github.com/YOUR_USERNAME/gmail-smart-cleaner.git

# Option B: Create new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/gmail-smart-cleaner.git
```

### Step 3: Configure Git User (First Time Only)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Or globally (for all projects):
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Add All Files
```bash
git add .
```

### Step 5: Create Initial Commit
```bash
git commit -m "Initial commit: Gmail Smart Cleaner MVP - production ready"
```

### Step 6: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## 📋 COMMON GIT COMMANDS

### Check Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

### View Detailed History
```bash
git log --oneline --graph --all --decorate
```

### Create a Branch (for development)
```bash
git checkout -b feature/new-feature
# or: git switch -c feature/new-feature
```

### Switch Branches
```bash
git checkout main
# or: git switch main
```

### Merge Branch
```bash
git merge feature/new-feature
```

### Delete Branch
```bash
git branch -d feature/new-feature
```

### Add Specific Files
```bash
git add src/js/ui.js
git add src/css/styles.css
```

### Commit Changes
```bash
git commit -m "Update UI for better mobile responsiveness"
```

### Push Changes
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

---

## 🔄 TYPICAL WORKFLOW

### Making Changes

#### 1. Create Feature Branch
```bash
git checkout -b feature/add-dark-mode
```

#### 2. Make Changes
Edit files as needed

#### 3. Check What Changed
```bash
git status
git diff
```

#### 4. Stage Changes
```bash
git add .
# or selective: git add src/js/ui.js
```

#### 5. Commit
```bash
git commit -m "Add dark mode toggle to settings"
```

#### 6. Push
```bash
git push origin feature/add-dark-mode
```

#### 7. Create Pull Request (on GitHub)
- Go to your GitHub repo
- Click "Compare & pull request"
- Add description
- Create PR

#### 8. Merge (once approved)
```bash
git checkout main
git pull origin main
git merge feature/add-dark-mode
git push origin main
```

#### 9. Delete Feature Branch
```bash
git branch -d feature/add-dark-mode
git push origin --delete feature/add-dark-mode
```

---

## 📊 GIT WORKFLOW DIAGRAM

```
Local Repository (Your Computer)
│
├─ Working Directory (files you edit)
│  └─ git add → Staging Area
│     └─ git commit → Local Repository
│        └─ git push → Remote (GitHub)
│
└─ Branches
   ├─ main (production)
   ├─ develop (development)
   └─ feature/* (features)
```

---

## 🌳 BRANCHING STRATEGY

### Recommended Branch Structure
```
main (production-ready code)
├─ develop (development code)
│  ├─ feature/oauth-setup
│  ├─ feature/ui-improvements
│  ├─ feature/performance-optimization
│  ├─ bugfix/preview-modal-error
│  └─ release/v1.1.0
```

### Branch Types
- **main** – Production-ready code (stable)
- **develop** – Development branch (integration)
- **feature/** – New features (e.g., feature/dark-mode)
- **bugfix/** – Bug fixes (e.g., bugfix/login-error)
- **release/** – Release preparation (e.g., release/v1.1.0)

---

## 💾 GITHUB SETUP (If Not Done Yet)

### 1. Create GitHub Account
- Go to https://github.com/signup
- Sign up with email
- Verify email

### 2. Create New Repository
- Click "+" → "New repository"
- Name: `gmail-smart-cleaner`
- Description: "Safe Gmail inbox cleaner Chrome extension"
- Public (for visibility) or Private (for private development)
- Click "Create repository"

### 3. Copy Repository URL
```
https://github.com/YOUR_USERNAME/gmail-smart-cleaner.git
```

### 4. Add as Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/gmail-smart-cleaner.git
```

### 5. Push Initial Code
```bash
git add .
git commit -m "Initial commit: Gmail Smart Cleaner MVP"
git branch -M main
git push -u origin main
```

---

## 🔐 .gitignore FILE

Create a `.gitignore` file to exclude files:

```bash
cat > /Users/srw.aditya/Desktop/codebase/gmail-smart-cleaner/.gitignore << 'EOF'
# Node modules (if using npm)
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Build artifacts
dist/
build/
*.zip

# Logs
*.log
logs/

# Credentials (NEVER commit!)
credentials.json
client_secret.json
secrets.json

# Chrome extension build
*.crx
*.pem
EOF
cat /Users/srw.aditya/Desktop/codebase/gmail-smart-cleaner/.gitignore
```

---

## 📝 COMMIT MESSAGE CONVENTIONS

### Good Commit Messages
```
✅ Good:
git commit -m "Add undo feature with 30-second timer"
git commit -m "Fix preview modal not closing on Escape"
git commit -m "Improve email scan performance by 40%"
git commit -m "Update OAuth setup documentation"

❌ Bad:
git commit -m "fix stuff"
git commit -m "update"
git commit -m "asdf"
git commit -m "working version"
```

### Format
```
[Type] Brief description (50 chars max)

[Optional longer description explaining why and what changed]

[Optional footer with issue number]
```

### Types
- **feat**: New feature (e.g., "feat: add dark mode")
- **fix**: Bug fix (e.g., "fix: preview modal not closing")
- **docs**: Documentation (e.g., "docs: update OAuth guide")
- **style**: Code style (e.g., "style: format code")
- **refactor**: Code refactoring (e.g., "refactor: simplify api.js")
- **perf**: Performance (e.g., "perf: optimize email scan")
- **test**: Tests (e.g., "test: add unit tests")

### Examples
```bash
git commit -m "feat: add dark mode toggle to settings"
git commit -m "fix: resolve preview modal closing issue
- Add Escape key handler
- Fix modal overlay z-index"

git commit -m "docs: expand OAUTH_SETUP.md with troubleshooting
Fixes #42"
```

---

## 🔄 SYNCING WITH GITHUB

### Before Starting Work
```bash
git pull origin main
```

### After Finishing Work
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### If Conflicts Occur
```bash
git pull origin main
# Resolve conflicts in your editor
git add .
git commit -m "Merge conflicts resolved"
git push origin main
```

---

## 🚀 DEPLOYMENT WORKFLOW

### For Chrome Web Store

#### Step 1: Create Release Branch
```bash
git checkout -b release/v1.0.0
```

#### Step 2: Update Version Numbers
```bash
# Update manifest.json version
# Update README.md version
```

#### Step 3: Commit & Push
```bash
git add manifest.json README.md
git commit -m "Release v1.0.0"
git push origin release/v1.0.0
```

#### Step 4: Create Release on GitHub
- Go to GitHub
- Click "Releases" → "Draft a new release"
- Tag version: `v1.0.0`
- Release title: `Gmail Smart Cleaner v1.0.0`
- Description: What's new, bug fixes, etc.
- Upload extension ZIP file
- Publish release

#### Step 5: Merge Back to Main
```bash
git checkout main
git merge release/v1.0.0
git push origin main
```

#### Step 6: Create Production Tag
```bash
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

#### Step 7: Delete Release Branch
```bash
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

---

## 📊 GITHUB COLLABORATION

### If Working with Team

#### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/gmail-smart-cleaner.git
cd gmail-smart-cleaner
```

#### 2. Create Your Feature Branch
```bash
git checkout -b feature/your-feature
```

#### 3. Make Changes & Commit
```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

#### 4. Create Pull Request
- Go to GitHub
- Click "Pull requests" → "New pull request"
- Select your branch
- Add description
- Request reviewers
- Create PR

#### 5. Address Review Comments
```bash
# Make changes
git add .
git commit -m "Address review comments"
git push origin feature/your-feature
```

#### 6. Merge When Approved
- Click "Merge pull request" on GitHub
- Delete branch after merge

---

## 🔍 USEFUL GIT COMMANDS

### Undo Changes
```bash
# Undo changes in working directory
git checkout -- src/js/ui.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Stash Changes (Temporary Save)
```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply stashed changes
git stash pop

# Discard stash
git stash drop
```

### View File History
```bash
# View commits for specific file
git log -- src/js/ui.js

# View changes in specific file
git log -p -- src/js/ui.js
```

### Blame (See Who Changed What)
```bash
git blame src/js/ui.js
```

---

## 🛠️ GITHUB ACTIONS (CI/CD)

Create `.github/workflows/build.yml`:

```yaml
name: Build & Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Check syntax
      run: |
        # Add syntax checks here
        echo "Running syntax checks..."
```

---

## 📚 COMPLETE GIT QUICK REFERENCE

```bash
# SETUP
git init                           # Initialize repo
git remote add origin <url>        # Add GitHub remote
git config user.name "Your Name"   # Set username
git config user.email "you@ex.com" # Set email

# BASIC WORKFLOW
git status                         # Check status
git add .                          # Stage all files
git add <file>                     # Stage specific file
git commit -m "Message"            # Commit changes
git push origin main               # Push to GitHub
git pull origin main               # Pull from GitHub

# BRANCHING
git branch                         # List branches
git checkout -b <branch>           # Create & switch branch
git switch <branch>                # Switch branch
git merge <branch>                 # Merge branch
git branch -d <branch>             # Delete branch

# HISTORY
git log                            # View history
git log --oneline                  # Compact history
git diff                           # View changes
git show <commit>                  # Show commit details

# UNDO
git reset --soft HEAD~1            # Undo last commit
git checkout -- <file>             # Undo file changes
git stash                          # Temporary save

# TAGS (for releases)
git tag -a v1.0.0 -m "Message"    # Create tag
git push origin v1.0.0             # Push tag
git tag -d v1.0.0                  # Delete local tag
git push origin --delete v1.0.0    # Delete remote tag
```

---

## ✅ GIT SETUP CHECKLIST

- [ ] Install Git (or verify already installed)
- [ ] Configure user.name and user.email
- [ ] Initialize Git in gmail-smart-cleaner folder
- [ ] Create .gitignore file
- [ ] Create GitHub account (if needed)
- [ ] Create GitHub repository
- [ ] Add remote: `git remote add origin <url>`
- [ ] Add all files: `git add .`
- [ ] Create initial commit: `git commit -m "..."`
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Verify on GitHub.com

---

## 🎯 NEXT STEPS

### Immediate
1. Run the quick setup (5 commands above)
2. Verify on GitHub.com

### For Development
1. Create develop branch: `git checkout -b develop`
2. Create feature branches for new work
3. Push & create PRs for code review

### For Launch
1. Create release branch: `git checkout -b release/v1.0.0`
2. Tag version: `git tag -a v1.0.0`
3. Create GitHub Release with description
4. Merge back to main

---

## 🔗 USEFUL LINKS

- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

**Your code is now version-controlled and ready for collaboration!** 🚀

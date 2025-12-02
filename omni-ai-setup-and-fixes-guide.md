# 🚀 Complete Guide: VS Code Setup & Omni-AI Fixes

## Part 1: Setting Up VS Code & GitHub Connection

### Step 1: Open Your Project in VS Code

#### Option A: If you already have the project locally
```bash
# Open terminal/command prompt
cd path/to/your/omni-ai-project
code .
```

#### Option B: Clone from GitHub (if not local)
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Git: Clone" and select it
4. Paste your GitHub repository URL
5. Choose a local folder to save it
6. VS Code will open the project automatically

### Step 2: Check Git Connection
```bash
# In VS Code Terminal (View > Terminal or Ctrl+`)
git status
git remote -v  # Should show your GitHub repo
```

### Step 3: Create a New Branch for Fixes
```bash
# Always work on a branch, not directly on main
git checkout -b fix-critical-issues
```

---

## Part 2: Implementing All Fixes (With Exact Locations)

### 🔧 Fix 1: Add Missing Conversation Display Route

**File:** `routes/conversationRoutes.js`

**What to do:** Add this code AFTER line 9 (after the delete route)

```javascript
// VIEW A SPECIFIC CONVERSATION - Add this after line 9
router.get('/conversation/:conversationId', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }
        
        const queries = require('../queries');
        const conversation = await queries.getConversationById(req.params.conversationId);
        
        if (!conversation) {
            return res.redirect('/dashboard');
        }
        
        res.render('chatbox', { conversation });
    } catch (error) {
        console.error('Error viewing conversation:', error);
        res.redirect('/dashboard');
    }
});
```

---

### 🔧 Fix 2: Update OpenAI API Integration

**File:** `controllers/aiController.js`

**What to do:** REPLACE the entire `getChatGPTResponse` function (lines 16-30) with:

```javascript
// Helper function to send a request to the ChatGPT API - REPLACE lines 16-30
const getChatGPTResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { 
                        role: 'user', 
                        content: conversationHistory 
                    }
                ],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting ChatGPT response:', error.response ? error.response.data : error.message);
        return 'Error communicating with ChatGPT.';
    }
};
```

---

### 🔧 Fix 3: Update Gemini API Response Handling

**File:** `controllers/aiController.js`

**What to do:** REPLACE the entire `getGeminiResponse` function (lines 33-49) with:

```javascript
// Helper function to send a request to the Gemini API - REPLACE lines 33-49
const getGeminiResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [
                    { 
                        parts: [
                            { 
                                text: conversationHistory 
                            }
                        ] 
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Correct path to access Gemini response
        if (response.data && response.data.candidates && response.data.candidates[0]) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            return 'No response from Gemini.';
        }
    } catch (error) {
        console.error('Error getting Gemini response:', error.response ? error.response.data : error.message);
        return 'Error communicating with Gemini.';
    }
};
```

---

### 🔧 Fix 4: Create Public Directory Structure

**In VS Code Terminal:**

```bash
# Run these commands in order
mkdir -p public/css
mkdir -p public/images

# Move the CSS file
mv style.css public/css/styles.css

# If you have the Logo.jpeg file, move it too
# mv Logo.jpeg public/images/Logo.jpeg
```

---

### 🔧 Fix 5: Update Static File Path in Server

**File:** `server.js`

**What to do:** REPLACE line 13 with:

```javascript
// REPLACE line 13
app.use(express.static(path.join(__dirname, 'public')));
```

---

### 🔧 Fix 6: Update CSS Links in All View Files

**Files to update:** `views/dashboard.ejs`, `views/logout.ejs`, `views/login.ejs`, `views/chatbox.ejs`

**What to do:** In each file, find the line with stylesheet link and REPLACE:

```html
<!-- FIND this line (usually around line 7) -->
<link rel="stylesheet" href="/styles.css">

<!-- REPLACE with -->
<link rel="stylesheet" href="/css/styles.css">
```

**For login.ejs:** Add this line after line 6:
```html
<link rel="stylesheet" href="/css/styles.css">
```

**For chatbox.ejs:** Add this line after line 6:
```html
<link rel="stylesheet" href="/css/styles.css">
```

---

### 🔧 Fix 7: Update Dashboard to Make Conversations Clickable

**File:** `views/dashboard.ejs`

**What to do:** REPLACE lines 13-14 with:

```html
<!-- REPLACE lines 13-14 -->
<li>
    <a href="/conversation/<%= conversation._id %>" style="text-decoration: none; color: inherit;">
        <strong><%= conversation.title %></strong>
    </a>
```

---

### 🔧 Fix 8: Create .env.example File

**Create new file:** `.env.example` (in root directory)

```env
MONGODB_URI=mongodb://localhost:27017/omni-ai
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_PROJECT_ID=your_project_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=path/to/service-account.json
SESSION_SECRET=your-secret-session-key-here
```

---

### 🔧 Fix 9: Add Timestamps to Models

**File:** `models/Conversation.js`

**What to do:** REPLACE lines 3-7 with:

```javascript
const conversationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    title: { type: String, required: true}
}, { 
    timestamps: true  // This adds createdAt and updatedAt automatically
});
```

---

### 🔧 Fix 10: Fix Session Secret

**File:** `server.js`

**What to do:** REPLACE line 28 with:

```javascript
// REPLACE line 28
secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
```

---

### 🔧 Fix 11: Fix Sorting in Dashboard Controller

**File:** `controllers/conversationController.js`

**What to do:** REPLACE line 14 with:

```javascript
// REPLACE line 14 (the sorting line)
const conversations = user.conversations.sort((a, b) => {
    // Sort by most recent first
    return new Date(b.createdAt) - new Date(a.createdAt);
});
```

---

## Part 3: Testing Your Changes

### Step 1: Check for Errors
```bash
# In VS Code Terminal
npm install  # Make sure all dependencies are installed
npm run dev  # Start the development server
```

### Step 2: Test the Application
1. Open browser to `http://localhost:3000`
2. Sign up for a new account
3. Create a conversation
4. Click on the conversation title (should now be clickable!)
5. Send a prompt to test AI responses

---

## Part 4: Committing and Pushing to GitHub

### Step 1: Check What Changed
```bash
# See all your changes
git status

# See detailed changes
git diff
```

### Step 2: Stage Your Changes
```bash
# Add all changed files
git add .

# Or add specific files
git add controllers/aiController.js
git add routes/conversationRoutes.js
# etc...
```

### Step 3: Commit Your Changes
```bash
git commit -m "Fix critical issues: API endpoints, routing, and file structure"
```

### Step 4: Push to GitHub
```bash
# Push your branch to GitHub
git push origin fix-critical-issues

# If this is your first push of this branch, use:
git push -u origin fix-critical-issues
```

### Step 5: Create a Pull Request (Optional but Recommended)
1. Go to your GitHub repository in browser
2. You'll see a yellow bar saying "fix-critical-issues had recent pushes"
3. Click "Compare & pull request"
4. Review changes and click "Create pull request"
5. Merge the pull request

**OR** merge directly locally:
```bash
git checkout main
git merge fix-critical-issues
git push origin main
```

---

## Part 5: Environment Variables Setup

### Don't forget to set up your actual .env file!

**Create file:** `.env` (in root directory - never commit this!)

```env
MONGODB_URI=mongodb://localhost:27017/omni-ai
PORT=3000
OPENAI_API_KEY=sk-xxxxx  # Get from OpenAI platform
GOOGLE_API_KEY=AIzxxxxx  # Get from Google Cloud Console
SESSION_SECRET=use-a-random-string-here-like-ka8s7df6a9s8d7f6
```

### Make sure .env is in your .gitignore!
```bash
# Check if .env is ignored
cat .gitignore

# If not, add it
echo ".env" >> .gitignore
```

---

## 🎉 Quick Command Summary

```bash
# Complete workflow
cd your-project-folder
code .                                    # Open in VS Code
git checkout -b fix-critical-issues      # Create new branch
# ... make all the changes above ...
npm install                               # Install dependencies
npm run dev                               # Test locally
git add .                                 # Stage changes
git commit -m "Fix critical issues"      # Commit
git push origin fix-critical-issues      # Push to GitHub
```

---

## 🆘 Troubleshooting

### If Git asks for credentials:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### If npm run dev fails:
```bash
npm install nodemon --save-dev  # Reinstall nodemon
npm start  # Use regular start instead
```

### If MongoDB connection fails:
1. Make sure MongoDB is running locally
2. Or use MongoDB Atlas (cloud) and update MONGODB_URI

### If API calls fail:
1. Check your .env file has correct API keys
2. Check console for specific error messages
3. Verify API keys are active in their respective platforms

---

## 📝 Notes
- Always work on a branch, not directly on main
- Test locally before pushing
- Keep your .env file secret (never commit it)
- The line numbers mentioned are approximate - look for the specific functions/sections mentioned

Good luck! You've got this! 🚀

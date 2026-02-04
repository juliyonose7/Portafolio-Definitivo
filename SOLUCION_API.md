# 🚀 API ISSUE RESOLUTION (LEGACY)

## ❌ Identified Issue
The error “Failed to fetch” occurs when the REST API is not running at `http://localhost:3000`.

## ✅ Immediate Fix

### Option 1: Use Local Data (Legacy Fallback)
This repository previously included a local fallback dataset for historical quotes. If you re-enable that module, the site will continue to work without the API.

### Option 2: Run the REST API (Recommended)

#### Step 1: Open Terminal
- Press `Win + R`
- Type `cmd` and press Enter

#### Step 2: Go to the API
```cmd
cd "C:\Users\juliy\OneDrive\Escritorio\Portfolio Definitivo\APIREST"
```

#### Step 3: Install Dependencies
```cmd
npm install
```

#### Step 4: Start the Server
```cmd
npm start
```

#### Step 5: Verify
You should see:
```
🚀 Server running at http://localhost:3000
📚 Historical Quotes API v1.0.0
👥 Available authors: 8
```

## 🔧 PowerShell Notes

### Use Command Prompt (cmd) instead of PowerShell
1. `Win + R` → `cmd` → Enter
2. Follow the steps above

### Or update PowerShell policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## ✅ Current Status
The portfolio now focuses on visitor analytics and a global map. The quotes module is deprecated but can be re-enabled if needed.

## 🧪 Quick Test
1. Open the site in the browser
2. Open DevTools (`F12`) → Console
3. Confirm there are no API errors

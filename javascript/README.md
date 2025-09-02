## JavaScript Version

### Prerequisites
- Node.js 18+ (for up-to-date runtime; no special APIs used)

Check version:
```powershell
node --version
```

### How to Run
From repository root or within this `javascript` folder:
```powershell
cd javascript
node main.js            # summary (default)
node main.js summary    # same as above
node main.js filter     # users aged >= 30 count
node main.js group      # users per country
node main.js avg        # average age
node main.js top        # top 3 oldest users
node main.js region     # users per region
```

### Notes
- Reads shared `users.csv` located in repo root.
- No external dependencies.

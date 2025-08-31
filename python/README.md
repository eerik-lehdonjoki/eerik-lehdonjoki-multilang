## Python Version

Python implementation mirroring the Node.js script in `../javascript/main.js`.

### Prerequisites
- Python 3.10+ (match-case used)

Check version:
```powershell
python --version
```

### How to Run
From repository root or within this `python` folder:
```powershell
cd python
python main.py            # summary (default)
python main.py summary    # same as above
python main.py filter     # users aged >= 30 count
python main.py group      # users per country
python main.py avg        # average age
python main.py top        # top 3 oldest users
python main.py region     # users per region (continent groups)
```

### Notes
- Reads shared `../users.csv` in repo root.
- Standard library only (no external deps).
- Region command uses simple continent mapping via match-case.

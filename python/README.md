## Prerequisites

- **Python 3.10 or higher** (required for match-case statements)

### Check Python Installation

Open command line and run:
```powershell
python --version
```

If Python is not installed, download it from [python.org](https://www.python.org/downloads/) and make sure to check "Add Python to PATH" during installation.

## How to Run

### 1. Navigate to the Python Directory

Open command line in root folder and navigate to the python directory:
```powershell
cd python
```

### 2. Run Different Operations

The script supports several operations

#### Summary (Default Operation)
Shows total users, filtered users (age >= 30), users per country, average age, and top 3 oldest users:
```powershell
python main.py
# or explicitly:
python main.py summary
```

#### Filter Users by Age
Shows count of users aged 30 and above:
```powershell
python main.py filter
```

#### Group Users by Country
Shows user count per country:
```powershell
python main.py group
```

#### Calculate Average Age
Shows the average age of all users:
```powershell
python main.py avg
```

#### Show Top 3 Oldest Users
Displays the 3 oldest users:
```powershell
python main.py top
```

#### Show Users by Region
Groups users by geographical regions using match-case statements:
```powershell
python main.py region
```

# Scala Version

## Features
- Loads shared `users.csv` from repo root (parent directory of `scala/`)
- Filtering users by minimum age (default 30)
- Counting users by country
- Calculating average age (1 decimal)
- Top N oldest users (default 3)
- Region aggregation (Europe, North America, South America, Asia, Oceania, Other)

## Prerequisites
- Scala 3 (3.3.x) and sbt installed

Check versions:
```powershell
scala -version
sbt --version
```

## Run with sbt (recommended)
From this `scala` directory:
```powershell
sbt run                # summary (default)
sbt "run summary"      # explicit
sbt "run filter"       # users aged >= 30 count
sbt "run group"        # users per country
sbt "run avg"          # average age
sbt "run top"          # top 3 oldest users
sbt "run region"       # users per region
```

## Compile then run (manual scalac)
```powershell
cd scala
# Compile (will put class files in ./classes directory you create)
mkdir -Force classes
scalac -d classes src/main/scala/Main.scala
# Run (note the parent path for csv)
scala -cp classes users.Main top
```

## Notes
- Pure standard library; no external dependencies.
- The program resolves CSV path relatively (`../users.csv`). Run commands from inside `scala/` so relative path is correct.
- Mirrors functionality of JavaScript, Python, and TypeScript versions.

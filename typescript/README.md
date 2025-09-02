# TypeScript Version

## Features
- Loads `users.csv` from repo root
- Filtering users by minimum age (default 30)
- Counting users by country
- Calculating average age (1 decimal)
- Top N oldest users (default top 3)
- Region aggregation (Europe, North America, South America, Asia, Oceania, Other)

## Install
From inside this folder:
```pwsh
cd typescript
npm install
```

## Build (compile to JS)
```pwsh
npm run build
```
Outputs compiled JS to `typescript/dist/`.

## Quick Runs (ts-node)
```pwsh
npm run summary
npm run filter
npm run group
npm run avg
npm run top
npm run region
```
Custom op:
```pwsh
npm run run -- top
```
(The argument after `--` is passed to the script.)

## Run Compiled Output
```pwsh
npm run build
npm start            # summary
node dist/main.js top
```

## Operations
- summary
- filter
- group
- avg
- top
- region

Direct ts-node (alternative):
```pwsh
npx ts-node main.ts top
```

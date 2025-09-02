const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'users.csv');

function loadUsers(csvPath) {
  try {
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const lines = raw.trim().split(/\r?\n/);
    const header = lines[0].split(',');
    return lines.slice(1).filter(Boolean).map(line => {
      const cols = line.split(',');
      const obj = {};
      header.forEach((h, i) => {
        obj[h] = cols[i];
      });
      return obj;
    });
  } catch (e) {
    console.error(`Could not read CSV at ${csvPath}`);
    return [];
  }
}

function filterUsersByMinimumAge(users, threshold = 30) {
  return users.filter(u => parseInt(u.age, 10) >= threshold);
}

function countUsersByCountry(users) {
  return users.reduce((acc, user) => {
    acc[user.country] = (acc[user.country] || 0) + 1;
    return acc;
  }, {});
}

function calculateUsersAverageAge(users) {
  if (!users.length) return 0.0;
  const ages = users.map(u => parseInt(u.age, 10));
  const avg = ages.reduce((a, b) => a + b, 0) / ages.length;
  return Math.round(avg * 10) / 10; // 1 decimal
}

function getTopNOldestUsers(users, n = 3) {
  return [...users].sort((a, b) => parseInt(b.age, 10) - parseInt(a.age, 10)).slice(0, n);
}

function getRegionForCountry(country) {
  switch (country) {
    case 'Finland':
    case 'Germany':
    case 'France':
    case 'UK':
      return 'Europe';
    case 'USA':
    case 'Canada':
      return 'North America';
    case 'Brazil':
      return 'South America';
    case 'India':
    case 'Japan':
      return 'Asia';
    case 'Australia':
      return 'Oceania';
    default:
      return 'Other';
  }
}

function usersByRegion(users) {
  const regionCounts = users.reduce((acc, u) => {
    const r = getRegionForCountry(u.country);
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});
  console.log('Users per region:');
  Object.entries(regionCounts).forEach(([r, n]) => {
    console.log(`  ${r}: ${n}`);
  });
}

function doSummary(users) {
  const total = users.length;
  const filtered = filterUsersByMinimumAge(users);
  const grouped = countUsersByCountry(users);
  const avgAge = calculateUsersAverageAge(users);
  const oldest = getTopNOldestUsers(users, 3);

  console.log(`Total users: ${total}`);
  console.log(`Filtered count: ${filtered.length}`);
  console.log('Users per country:');
  Object.entries(grouped).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
  console.log(`Average age: ${avgAge}`);
  console.log('Top 3 oldest users:');
  oldest.forEach(u => console.log(`  ${u.name} (${u.age})`));
}

function main() {
  const users = loadUsers(CSV_PATH);
  if (!users.length) return;

  const operation = process.argv[2] || 'summary';

  if (operation === 'summary') {
    doSummary(users);
    return;
  }

  if (operation === 'filter') {
    console.log(`Filtered count: ${filterUsersByMinimumAge(users).length}`);
    return;
  }

  if (operation === 'group') {
    console.log('Users per country:');
    Object.entries(countUsersByCountry(users)).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
    return;
  }

  if (operation === 'avg') {
    console.log(`Average age: ${calculateUsersAverageAge(users)}`);
    return;
  }

  if (operation === 'top') {
    getTopNOldestUsers(users).forEach(u => console.log(`${u.name} (${u.age})`));
    return;
  }

  if (operation === 'region') {
    usersByRegion(users);
    return;
  }

  console.log(`Unknown operation '${operation}'. Use summary|filter|group|avg|top|region.`);
}

if (require.main === module) {
  main();
}

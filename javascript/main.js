const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'users.csv');

/**
 * Example: [ { name: 'Alice', age: '34', country: 'Finland' }, { name: 'Bob', age: '27', country: 'USA' } ]
 * Note: All values are strings
 * Type: Array<Record<string,string>>
 */
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
  const result = [];
  users.forEach(user => {
    const age = parseInt(user.age, 10);
    if (!isNaN(age) && age >= threshold) {
      result.push(user);
    }
  });
  return result;
}

function countUsersByCountry(users) {
  const counts = {};
  users.forEach(user => {
    const country = user.country;
    counts[country] = (counts[country] || 0) + 1;
  });
  return counts;
}

function calculateUsersAverageAge(users) {
  if (!users.length) return 0.0;

  let sum = 0;
  let count = 0;

  users.forEach(u => {
    const age = parseInt(u.age, 10);
    if (!isNaN(age)) {
      sum += age;
      count += 1;
    }
  });

  if (!count) return 0.0;
  const avg = sum / count;

  return Math.round(avg * 10) / 10;
}

function getTopNOldestUsers(users, n = 3) {
  // Avoid original array mutation.
  const copy = users.slice();

  copy.sort((a, b) => {
    const ageA = parseInt(a.age, 10) || 0;
    const ageB = parseInt(b.age, 10) || 0;
    return ageB - ageA;
  });

  return copy.slice(0, n);
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
  const regionCounts = {};
  users.forEach(u => {
    const region = getRegionForCountry(u.country);
    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });
  console.log('Users per region:');
  logKeyValueLines(regionCounts);
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
  logKeyValueLines(grouped);
  console.log(`Average age: ${avgAge}`);
  console.log('Top 3 oldest users:');
  oldest.forEach(u => console.log(`  ${u.name} (${u.age})`));
}

function logKeyValueLines(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
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
    const byCountry = countUsersByCountry(users);
    logKeyValueLines(byCountry);
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

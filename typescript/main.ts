import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'users.csv');

export interface UserRecord {
  name: string;
  age: string;
  country: string;
}

export type CountryCounts = Record<string, number>;
export type RegionCounts = Record<string, number>;

export function loadUsers(csvPath: string): UserRecord[] {
  try {
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const lines = raw.trim().split(/\r?\n/);
    if (!lines.length) return [];
    const header = lines[0].split(',');
    return lines.slice(1).filter(Boolean).map(line => {
      const cols = line.split(',');
      const obj: UserRecord = { name: '', age: '', country: '' } as UserRecord;
      header.forEach((h, i) => {
        (obj as any)[h] = cols[i];
      });
      return obj;
    });
  } catch (e) {
    console.error(`Could not read CSV at ${csvPath}`);
    return [];
  }
}

export function filterUsersByMinimumAge(users: UserRecord[], threshold = 30): UserRecord[] {
  return users.filter(u => {
    const age = parseInt(u.age, 10);
    return !isNaN(age) && age >= threshold;
  });
}

export function countUsersByCountry(users: UserRecord[]): CountryCounts {
  return users.reduce<CountryCounts>((acc, u) => {
    acc[u.country] = (acc[u.country] || 0) + 1;
    return acc;
  }, {});
}

export function calculateUsersAverageAge(users: UserRecord[]): number {
  const validAges = users.map(u => parseInt(u.age, 10)).filter(a => !isNaN(a));
  if (!validAges.length) return 0.0;
  const avg = validAges.reduce((s, a) => s + a, 0) / validAges.length;
  return Math.round(avg * 10) / 10;
}

export function getTopNOldestUsers(users: UserRecord[], n = 3): UserRecord[] {
  return [...users].sort((a, b) => (parseInt(b.age, 10) || 0) - (parseInt(a.age, 10) || 0)).slice(0, n);
}

export function getRegionForCountry(country: string): string {
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

export function usersByRegion(users: UserRecord[]): RegionCounts {
  return users.reduce<RegionCounts>((acc, u) => {
    const region = getRegionForCountry(u.country);
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});
}

function logKeyValueLines(obj: Record<string, number>) {
  Object.entries(obj).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}

function doSummary(users: UserRecord[]) {
  const total = users.length;
  const filtered = filterUsersByMinimumAge(users);
  const grouped = countUsersByCountry(users);
  const avgAge = calculateUsersAverageAge(users);
  const oldest = getTopNOldestUsers(users, 3);
  const regionCounts = usersByRegion(users);

  console.log(`Total users: ${total}`);
  console.log(`Filtered count: ${filtered.length}`);
  console.log('Users per country:');
  logKeyValueLines(grouped);
  console.log(`Average age: ${avgAge}`);
  console.log('Top 3 oldest users:');
  oldest.forEach(u => console.log(`  ${u.name} (${u.age})`));
  console.log('Users per region:');
  logKeyValueLines(regionCounts);
}

export function main(argv = process.argv) {
  const users = loadUsers(CSV_PATH);
  if (!users.length) return;

  const operation = argv[2] || 'summary';

  switch (operation) {
    case 'summary':
      doSummary(users);
      break;
    case 'filter':
      console.log(`Filtered count: ${filterUsersByMinimumAge(users).length}`);
      break;
    case 'group':
      console.log('Users per country:');
      logKeyValueLines(countUsersByCountry(users));
      break;
    case 'avg':
      console.log(`Average age: ${calculateUsersAverageAge(users)}`);
      break;
    case 'top':
      getTopNOldestUsers(users).forEach(u => console.log(`${u.name} (${u.age})`));
      break;
    case 'region':
      console.log('Users per region:');
      logKeyValueLines(usersByRegion(users));
      break;
    default:
      console.log(`Unknown operation '${operation}'. Use summary|filter|group|avg|top|region.`);
  }
}

if (require.main === module) {
  main();
}

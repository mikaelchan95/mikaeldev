import { readFileSync } from 'node:fs';

const files = [
  'src/styles/portfolio.css',
  'src/aurora-lugia.js',
  'index.html',
  'public/favicon.svg',
];

const sources = Object.fromEntries(files.map((file) => [file, readFileSync(file, 'utf8')]));
const combined = Object.values(sources).join('\n').toLowerCase();

const requiredTokens = [
  '--lugia-white:#ffffff',
  '--lugia-pale:#d6e6f5',
  '--lugia-indigo:#293488',
  '--lugia-periwinkle:#9cace6',
  '--lugia-blue:#5b77fb',
  '--lugia-red:#e74f41',
];

const requiredPalette = ['#ffffff', '#d6e6f5', '#293488', '#9cace6', '#5b77fb', '#e74f41'];
const retiredWarmColors = [
  '#eb5939',
  '#c59b64',
  '#b7ab98',
  '#ece4d6',
  'rgba(235,89,57',
  'rgba(197,155,100',
  'rgba(183,171,152',
];

const failures = [];

for (const token of requiredTokens) {
  if (!sources['src/styles/portfolio.css'].toLowerCase().replace(/\s+/g, '').includes(token)) {
    failures.push(`Missing CSS theme token ${token}`);
  }
}

for (const color of requiredPalette) {
  if (!combined.includes(color)) {
    failures.push(`Missing Lugia palette color ${color}`);
  }
}

for (const color of retiredWarmColors) {
  if (combined.includes(color)) {
    failures.push(`Retired warm color is still present: ${color}`);
  }
}

if (!sources['src/aurora-lugia.js'].includes('Lugia')) {
  failures.push('Aurora source should identify the Lugia color treatment.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Lugia theme colors verified.');

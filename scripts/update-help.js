/* eslint-disable */
const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, '../src/actions');
const helpFile = path.join(__dirname, '../companion/HELP.md');

console.log('\n🔍 Scanning for actions...\n');

function extractActions(fileContent, fileName) {
  const results = [];
  const lines = fileContent.split(/\r?\n/);
  let name = null;
  let description = null;
  for (const line of lines) {
    const nameMatch = line.match(/name\s*:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      name = nameMatch[1];
    }
    const descMatch = line.match(/description\s*:\s*['"]([^'"]+)['"]/);
    if (descMatch) {
      description = descMatch[1];
    }
    if (name && description) {
      results.push({ name, description, category: fileName });
      name = null;
      description = null;
    }
  }
  return results;
}

const allActions = [];
fs.readdirSync(actionsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(actionsDir, file), 'utf8');
    const actions = extractActions(content, file);
    allActions.push(...actions);
  }
});

const categoryLookup = {};

function formatCategoryName(fileName) {
  // Remove .ts extension
  let category = fileName.replace('.ts', '');
  
  // Strip out 'action-' prefix if it exists
  if (category.startsWith('action-')) {
    category = category.substring(7); // Remove 'action-'
  }
  
  // Replace dashes with spaces and capitalize first letter of each word
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Add category to each action
allActions.forEach(action => {
  action.category = categoryLookup[action.category] || formatCategoryName(action.category);
});

// Sort actions by category then name
const sortedActions = allActions.sort((a, b) => {
  if (a.category === b.category) {
    return a.name.localeCompare(b.name);
  }
  return a.category.localeCompare(b.category);
});

let table = '| Category | Name | Description |\n';
table += '|----------|------|-------------|\n';
sortedActions.forEach(action => {
  table += `| ${action.category} | ${action.name} | ${action.description} |\n`;
});

let helpContent = fs.readFileSync(helpFile, 'utf8');
const supportedActionsHeader = '## Supported Actions and Feedbacks';
const headerIndex = helpContent.indexOf(supportedActionsHeader);
if (headerIndex !== -1) {
  // Find the next heading after '### Supported Actions'
  const afterHeader = helpContent.slice(headerIndex + supportedActionsHeader.length);
  const nextHeadingMatch = afterHeader.match(/\n#+\s.*/);
  let before = helpContent.slice(0, headerIndex + supportedActionsHeader.length);
  let after = '';
  if (nextHeadingMatch) {
    after = afterHeader.slice(nextHeadingMatch.index);
  }
  helpContent = before + '\n\n' + table + '\n' + after;
} else {
  // If no header, append at the end
  helpContent += '\n\n' + supportedActionsHeader + '\n\n' + table + '\n';
}

fs.writeFileSync(helpFile, helpContent);

// Display summary
console.log('📊 Actions Summary by Category:\n');
const categoryCounts = {};
sortedActions.forEach(action => {
  if (!categoryCounts[action.category]) {
    categoryCounts[action.category] = [];
  }
  categoryCounts[action.category].push(action.name);
});

Object.keys(categoryCounts).sort().forEach(category => {
  console.log(`\x1b[36m${category}\x1b[0m (${categoryCounts[category].length} actions)`);
  categoryCounts[category].forEach(name => {
    console.log(`  • ${name}`);
  });
  console.log('');
});

console.log(`\x1b[32m✅ Successfully updated ${helpFile}\x1b[0m`);
console.log(`\x1b[32m✅ Total actions added: ${allActions.length}\x1b[0m\n`);

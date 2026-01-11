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
  let collectingDescription = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for name
    const nameMatch = line.match(/name\s*:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      name = nameMatch[1];
    }
    
    // Check for description start
    const descMatch = line.match(/description\s*:\s*['"]([^'"]+)['"]/);
    if (descMatch) {
      description = descMatch[1];
    } else if (line.match(/description\s*:\s*$/)) {
      // Description starts on next line
      collectingDescription = true;
    } else if (collectingDescription && line.trim().match(/^['"]([^'"]+)['"],?$/)) {
      // Get description from next line
      const descValue = line.trim().match(/^['"]([^'"]+)['"],?$/);
      if (descValue) {
        description = descValue[1];
        collectingDescription = false;
      }
    }
    
    if (name && description) {
      results.push({ name, description, category: fileName });
      name = null;
      description = null;
      collectingDescription = false;
    }
  }
  return results;
}

function extractCategoryDescription(fileContent) {
  // Look for JSDoc comment with @help-description tag
  const jsdocMatch = fileContent.match(/\/\*\*[\s\S]*?@help-description\s+([\s\S]*?)(?:\n\s*\*\s*@|\n\s*\*\/)/);
  if (jsdocMatch) {
    // Clean up the description - remove leading asterisks and extra whitespace
    return jsdocMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line.length > 0)
      .join('\n');
  }
  return null;
}

const allActions = [];
const categoryDescriptions = {};
fs.readdirSync(actionsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(actionsDir, file), 'utf8');
    const actions = extractActions(content, file);
    allActions.push(...actions);
    
    // Extract category description if it exists
    const categoryDesc = extractCategoryDescription(content);
    if (categoryDesc) {
      categoryDescriptions[file] = categoryDesc;
    }
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

// Add category to each action and keep track of original file name
allActions.forEach(action => {
  action.originalFileName = action.category;
  action.category = categoryLookup[action.category] || formatCategoryName(action.category);
  
  // Attach category description if it exists
  if (categoryDescriptions[action.originalFileName]) {
    action.categoryDescription = categoryDescriptions[action.originalFileName];
  }
});

// Sort actions by category then name
const sortedActions = allActions.sort((a, b) => {
  if (a.category === b.category) {
    return a.name.localeCompare(b.name);
  }
  return a.category.localeCompare(b.category);
});

// Group actions by category
const actionsByCategory = {};
sortedActions.forEach(action => {
  if (!actionsByCategory[action.category]) {
    actionsByCategory[action.category] = [];
  }
  actionsByCategory[action.category].push(action);
});

// Build tables for each category
let tables = '';
const categories = Object.keys(actionsByCategory).sort();
categories.forEach((category, index) => {
  tables += `### ${category}\n\n`;
  
  // Add category description if it exists
  const firstAction = actionsByCategory[category][0];
  if (firstAction && firstAction.categoryDescription) {
    tables += `${firstAction.categoryDescription}\n\n`;
  }
  
  tables += '| Name | Description |\n';
  tables += '| --- | --- |\n';
  actionsByCategory[category].forEach(action => {
    tables += `| ${action.name} | ${action.description} |\n`;
  });
  // Only add blank line between categories, not after the last one
  if (index < categories.length - 1) {
    tables += '\n';
  }
});

let helpContent = fs.readFileSync(helpFile, 'utf8');
const supportedActionsHeader = '## Supported Actions and Feedbacks';
const headerIndex = helpContent.indexOf(supportedActionsHeader);
if (headerIndex !== -1) {
  // Find the next level 2 heading after 'Supported Actions and Feedbacks'
  const afterHeader = helpContent.slice(headerIndex + supportedActionsHeader.length);
  const nextHeadingMatch = afterHeader.match(/\n##\s[^#]/);
  let before = helpContent.slice(0, headerIndex + supportedActionsHeader.length);
  let after = '';
  if (nextHeadingMatch) {
    after = afterHeader.slice(nextHeadingMatch.index);
  }
  helpContent = before + '\n\n' + tables + after;
} else {
  // If no header, append at the end
  helpContent += '\n\n' + supportedActionsHeader + '\n\n' + tables;
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

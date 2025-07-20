#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * 
 * This script provides automated accessibility testing for the Leonardo Anime Database application.
 * It checks for common accessibility issues and provides a report.
 * 
 * Usage: node scripts/test-accessibility.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Accessibility checklist items
const accessibilityChecklist = [
  {
    category: 'Semantic HTML',
    checks: [
      'Proper heading hierarchy (h1, h2, h3)',
      'Semantic HTML elements (main, nav, section, article)',
      'Proper form structure with labels',
      'Alt text for all images',
      'Skip links for main content'
    ]
  },
  {
    category: 'Keyboard Navigation',
    checks: [
      'All interactive elements are keyboard accessible',
      'Logical tab order throughout the application',
      'Escape key closes modals',
      'Enter/Space keys activate buttons',
      'Arrow keys work in dropdowns'
    ]
  },
  {
    category: 'Screen Reader Support',
    checks: [
      'ARIA labels on all interactive elements',
      'ARIA descriptions for complex elements',
      'Live regions for dynamic content',
      'Proper roles for custom elements',
      'Error messages announced to screen readers'
    ]
  },
  {
    category: 'Color and Contrast',
    checks: [
      'Sufficient color contrast (4.5:1 minimum)',
      'Color is not the only way to convey information',
      'Focus indicators are clearly visible',
      'High contrast mode compatibility',
      'No flashing or blinking content'
    ]
  },
  {
    category: 'Form Accessibility',
    checks: [
      'All form fields have associated labels',
      'Required fields are properly marked',
      'Error messages are clear and descriptive',
      'Help text is provided where needed',
      'Form validation is announced to screen readers'
    ]
  }
];

// Manual testing checklist
const manualTestingChecklist = [
  {
    category: 'Keyboard Testing',
    items: [
      'Tab through all interactive elements',
      'Use Enter/Space to activate buttons',
      'Use Escape to close modals',
      'Navigate forms with Tab/Shift+Tab',
      'Use arrow keys in dropdowns',
      'Test skip links functionality'
    ]
  },
  {
    category: 'Screen Reader Testing',
    items: [
      'Test with NVDA (Windows)',
      'Test with JAWS (Windows)',
      'Test with VoiceOver (macOS)',
      'Test with TalkBack (Android)',
      'Verify all images have alt text',
      'Check form labels and help text',
      'Verify error messages are announced',
      'Test loading state announcements'
    ]
  },
  {
    category: 'Visual Testing',
    items: [
      'Check color contrast ratios',
      'Verify focus indicators are visible',
      'Test with high contrast mode',
      'Check text sizing (zoom 200%)',
      'Verify no flashing content',
      'Test with different color schemes'
    ]
  }
];

// Function to print colored text
function printColor(text, color = 'reset') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// Function to print section header
function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  printColor(text, 'bright');
  console.log('='.repeat(60));
}

// Function to print checklist
function printChecklist(checklist, title) {
  printHeader(title);
  
  checklist.forEach((section, sectionIndex) => {
    printColor(`\n${sectionIndex + 1}. ${section.category}`, 'cyan');
    console.log('-'.repeat(40));
    
    section.checks.forEach((check, checkIndex) => {
      console.log(`  ${sectionIndex + 1}.${checkIndex + 1} ${check}`);
    });
  });
}

// Function to print manual testing steps
function printManualTesting() {
  printHeader('Manual Testing Checklist');
  
  manualTestingChecklist.forEach((section, sectionIndex) => {
    printColor(`\n${sectionIndex + 1}. ${section.category}`, 'yellow');
    console.log('-'.repeat(40));
    
    section.items.forEach((item, itemIndex) => {
      console.log(`  [ ] ${sectionIndex + 1}.${itemIndex + 1} ${item}`);
    });
  });
}

// Function to print testing tools
function printTestingTools() {
  printHeader('Automated Testing Tools');
  
  const tools = [
    {
      name: 'Lighthouse',
      command: 'npx lighthouse http://localhost:3000 --only-categories=accessibility',
      description: 'Google\'s automated accessibility audit tool'
    },
    {
      name: 'axe-core',
      command: 'npm install axe-core',
      description: 'Automated accessibility testing library'
    },
    {
      name: 'WAVE',
      command: 'https://wave.webaim.org/',
      description: 'Web accessibility evaluation tool (online)'
    },
    {
      name: 'Color Contrast Analyzer',
      command: 'https://www.tpgi.com/color-contrast-checker/',
      description: 'Verify color contrast ratios (online)'
    }
  ];
  
  tools.forEach((tool, index) => {
    printColor(`\n${index + 1}. ${tool.name}`, 'green');
    console.log(`   Command: ${tool.command}`);
    console.log(`   Description: ${tool.description}`);
  });
}

// Function to print resources
function printResources() {
  printHeader('Accessibility Resources');
  
  const resources = [
    {
      name: 'WCAG 2.1 Guidelines',
      url: 'https://www.w3.org/WAI/WCAG21/quickref/',
      description: 'Official Web Content Accessibility Guidelines'
    },
    {
      name: 'ARIA Authoring Practices',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      description: 'ARIA patterns and examples'
    },
    {
      name: 'Web Accessibility Initiative',
      url: 'https://www.w3.org/WAI/',
      description: 'W3C accessibility standards and resources'
    },
    {
      name: 'axe-core Documentation',
      url: 'https://github.com/dequelabs/axe-core',
      description: 'Automated accessibility testing library'
    }
  ];
  
  resources.forEach((resource, index) => {
    printColor(`\n${index + 1}. ${resource.name}`, 'blue');
    console.log(`   URL: ${resource.url}`);
    console.log(`   Description: ${resource.description}`);
  });
}

// Function to check if files exist
function checkFiles() {
  printHeader('File Structure Check');
  
  const requiredFiles = [
    'src/app/layout.tsx',
    'src/components/AnimeList.tsx',
    'src/components/AnimeModal.tsx',
    'ACCESSIBILITY.md',
    'README.md'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      printColor(`✅ ${file}`, 'green');
    } else {
      printColor(`❌ ${file}`, 'red');
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    printColor('\n✅ All required files are present!', 'green');
  } else {
    printColor('\n❌ Some required files are missing. Please check the file structure.', 'red');
  }
  
  return allFilesExist;
}

// Function to check for accessibility patterns in code
function checkCodePatterns() {
  printHeader('Code Pattern Check');
  
  const patterns = [
    {
      name: 'ARIA Labels',
      pattern: /aria-label=/,
      description: 'Check for ARIA labels on interactive elements'
    },
    {
      name: 'Alt Text',
      pattern: /alt=/,
      description: 'Check for alt text on images'
    },
    {
      name: 'Role Attributes',
      pattern: /role=/,
      description: 'Check for role attributes on custom elements'
    },
    {
      name: 'Tab Index',
      pattern: /tabIndex=/,
      description: 'Check for tabIndex on custom interactive elements'
    },
    {
      name: 'Keyboard Events',
      pattern: /onKeyDown/,
      description: 'Check for keyboard event handlers'
    }
  ];
  
  const filesToCheck = [
    'src/app/layout.tsx',
    'src/components/AnimeList.tsx',
    'src/components/AnimeModal.tsx'
  ];
  
  patterns.forEach(pattern => {
    let found = false;
    
    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (pattern.pattern.test(content)) {
          found = true;
        }
      }
    });
    
    if (found) {
      printColor(`✅ ${pattern.name}`, 'green');
    } else {
      printColor(`❌ ${pattern.name}`, 'red');
    }
    console.log(`   ${pattern.description}`);
  });
}

// Main function
function main() {
  printColor('🔍 Leonardo Anime Database - Accessibility Testing', 'bright');
  printColor('==================================================', 'bright');
  
  // Check file structure
  const filesExist = checkFiles();
  
  if (filesExist) {
    // Check code patterns
    checkCodePatterns();
  }
  
  // Print accessibility checklist
  printChecklist(accessibilityChecklist, 'Accessibility Implementation Checklist');
  
  // Print manual testing checklist
  printManualTesting();
  
  // Print testing tools
  printTestingTools();
  
  // Print resources
  printResources();
  
  // Print summary
  printHeader('Summary');
  printColor('This script provides a comprehensive accessibility testing framework.', 'bright');
  printColor('For detailed implementation guidance, see ACCESSIBILITY.md', 'bright');
  printColor('For automated testing, use the tools listed above.', 'bright');
  
  console.log('\n' + '='.repeat(60));
  printColor('Accessibility testing script completed!', 'green');
  console.log('='.repeat(60) + '\n');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  accessibilityChecklist,
  manualTestingChecklist,
  checkFiles,
  checkCodePatterns
}; 
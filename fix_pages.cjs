const fs = require('fs');
const path = require('path');

const screensDir = 'C:\\Users\\TARINMOY\\.gemini\\antigravity\\brain\\ddce20db-a72f-4628-82a9-7f2c611f9ad4\\scratch\\screens';
const pagesDir = 'e:\\My Space\\ExpiryGuard AI\\expiry-guard-ai\\src\\pages';

const pagesMapping = {
    'FoodSafety': 'FoodSafety',
    'Freshness': 'Freshness',
    'Compliance': 'Compliance',
    'Executive': 'Dashboard'
};

function htmlToJsx(html) {
    let jsx = html;
    
    // Convert class to className
    jsx = jsx.replace(/class=/g, 'className=');
    
    // Convert HTML comments to JSX comments
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
    
    // Convert stroke-* and viewbox
    jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
    jsx = jsx.replace(/stroke-dasharray=/g, 'strokeDasharray=');
    jsx = jsx.replace(/stroke-dashoffset=/g, 'strokeDashoffset=');
    jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
    jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
    jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
    jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
    jsx = jsx.replace(/viewbox=/g, 'viewBox=');
    
    // Fix styles
    jsx = jsx.replace(/style="width:\s*([^"]+?)"/g, 'style={{width: "$1"}}');
    jsx = jsx.replace(/style="height:\s*([^"]+?)"/g, 'style={{height: "$1"}}');
    jsx = jsx.replace(/style="background-image:\s*url\('([^']+)'\)"/g, 'style={{backgroundImage: "url(\'$1\')"}}');
    
    // Custom style fixes
    jsx = jsx.replace(/style="font-variation-settings:\s*'([^']+)'\s*(\d+);?"/g, 'style={{fontVariationSettings: "\'$1\' $2"}}');
    jsx = jsx.replace(/style="stop-color:([^;]+);stop-opacity:([^"]+)"/g, 'style={{stopColor: "$1", stopOpacity: $2}}');
    
    // Close standalone tags
    jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
    jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
    jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
    
    // Convert html entities
    jsx = jsx.replace(/&nbsp;/g, ' ');
    
    return `<>\n${jsx}\n</>`;
}

for (const [htmlName, jsxName] of Object.entries(pagesMapping)) {
    const htmlPath = path.join(screensDir, `${htmlName}.html`);
    if (!fs.existsSync(htmlPath)) continue;
    
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const match = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    let mainContent = '';
    if (match && match[1]) {
        mainContent = match[1];
        // Remove <header> if exists since TopNav is in Layout
        mainContent = mainContent.replace(/<header[\s\S]*?<\/header>/i, '');
        // Remove <footer> if exists
        mainContent = mainContent.replace(/<footer[\s\S]*?<\/footer>/i, '');
    }
    
    if (mainContent.trim()) {
        const jsxContent = htmlToJsx(mainContent.trim());
        
        const componentCode = `import React from 'react';

const ${jsxName} = () => {
  return (
    ${jsxContent}
  );
};

export default ${jsxName};
`;
        fs.writeFileSync(path.join(pagesDir, `${jsxName}.jsx`), componentCode);
        console.log(`Updated ${jsxName}.jsx`);
    } else {
        console.log(`Could not extract main content for ${htmlName}`);
    }
}

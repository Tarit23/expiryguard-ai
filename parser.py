import os
import re

def extract_main_content(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    match = re.search(r'(<div class="p-md grid grid-cols-12 gap-md max-w-container-max mx-auto w-full">.*?</main>)', html, re.DOTALL)
    if not match:
        match = re.search(r'</header>\s*(<div.*?</main>)', html, re.DOTALL)
    
    if match:
        content = match.group(1)
        content = content.replace('</main>', '')
        content = content.replace('class=', 'className=')
        content = re.sub(r'<(img|input|br|hr)([^>]*[^/])>', r'<\1\2/>', content)
        content = re.sub(r'style="([^"]*)"', r'', content)
        # React expects stroke-dasharray etc in camelCase but let's just do a quick fix for common ones
        content = content.replace('stroke-dasharray', 'strokeDasharray')
        content = content.replace('stroke-dashoffset', 'strokeDashoffset')
        content = content.replace('stroke-linecap', 'strokeLinecap')
        content = content.replace('stroke-width', 'strokeWidth')
        content = content.replace('font-variation-settings', 'fontVariationSettings')
        content = content.replace('<!--', '{/*')
        content = content.replace('-->', '*/}')
        return content.strip()
    return ''

pages = {
    'Inwarding.jsx': 'Inwarding.html',
    'FoodSafety.jsx': 'FoodSafety.html',
    'Freshness.jsx': 'Freshness.html',
    'Alerts.jsx': 'Alerts.html',
    'Compliance.jsx': 'Compliance.html',
    'Dashboard.jsx': 'Executive.html'
}

base_dir = r"C:\Users\TARINMOY\.gemini\antigravity\brain\ddce20db-a72f-4628-82a9-7f2c611f9ad4\scratch\screens"

for jsx_file, html_file in pages.items():
    html_path = os.path.join(base_dir, html_file)
    if os.path.exists(html_path):
        content = extract_main_content(html_path)
        jsx_content = f"""import React from 'react';

const {jsx_file[:-4]} = () => {{
  return (
    <>
      {content}
    </>
  );
}};

export default {jsx_file[:-4]};
"""
        with open(f'src/pages/{jsx_file}', 'w', encoding='utf-8') as f:
            f.write(jsx_content)
        print(f'Generated {jsx_file}')
    else:
        print(f'Not found: {html_path}')

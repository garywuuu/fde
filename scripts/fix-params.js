const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all route files
const routeFiles = glob.sync('app/api/**/[*]/route.ts', { cwd: __dirname + '/..' });

routeFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Fix params type from { id: string } to Promise<{ id: string }>
  const paramPattern = /(\{ params \}: \{ params: \{ id: string \} \})/g;
  if (paramPattern.test(content)) {
    content = content.replace(
      /(\{ params \}: \{ params: \{ id: string \} \})/g,
      '{ params }: { params: Promise<{ id: string }> }'
    );
    changed = true;
  }

  // Add await params destructuring after function start
  const functionPattern = /export async function (GET|POST|PATCH|PUT|DELETE)\([\s\S]*?\{ params \}: \{ params: Promise<\{ id: string \}> \}[\s\S]*?\) \{[\s\S]*?(try|const)/;
  if (functionPattern.test(content) && !content.includes('const { id } = await params;')) {
    content = content.replace(
      /(export async function (GET|POST|PATCH|PUT|DELETE)\([\s\S]*?\{ params \}: \{ params: Promise<\{ id: string \}> \}[\s\S]*?\) \{[\s\S]*?)(try|const)/,
      (match, p1, p2, p3) => {
        if (!p1.includes('const { id } = await params;')) {
          return p1 + '    const { id } = await params;\n    ' + p3;
        }
        return match;
      }
    );
    changed = true;
  }

  // Replace params.id with id
  if (content.includes('params.id')) {
    content = content.replace(/params\.id/g, 'id');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('Done fixing params!');


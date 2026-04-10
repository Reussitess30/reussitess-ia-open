const fs = require('fs');
const path = require('path');

const MARK = `/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
`;

function watermark(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory() && !full.includes('node_modules') && !full.includes('.next')) {
      watermark(full);
    } else if (file.endsWith('.js') && !file.includes('node_modules')) {
      const content = fs.readFileSync(full, 'utf8');
      if (!content.includes('DSO2026012614')) {
        fs.writeFileSync(full, MARK + content);
        console.log(`✅ WATERMARK: ${full}`);
      }
    }
  });
}

watermark('.');
console.log('🏆 WATERMARK REUSSITESS TERMINÉ !');

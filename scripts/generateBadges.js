/* eslint-env node */
const fs = require("fs");

const cwd = process.cwd();
const readmePath = `${cwd}/README.md`;

const rm = fs.readFileSync(readmePath).toString();

const badges = fs.readdirSync(`${cwd}/badges`);

const badgeStr = badges
    .map((svgName) => `![${svgName}](./badges/${svgName})`)
    .join("\n");

const rmNew = rm.replace(/^(.*\n)+# 🧪/gm, `${badgeStr}\n\n# 🧪`);

fs.writeFileSync(readmePath, rmNew);

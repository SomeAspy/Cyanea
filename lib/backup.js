import { readDB, writeDB } from "./db.js";
import colors from 'colors'
console.log("Backing up database...".magenta);
writeDB(await readDB(), "db.backup.json")
console.log("Backup complete!".green);
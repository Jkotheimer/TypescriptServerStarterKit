import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.ENVIRONMENT?.toLowerCase() ?? 'dev';
const dotenvFileName = `.env.${environment}`;
const dotenvFilePath = path.join(__dirname, dotenvFileName);
if (!fs.existsSync(dotenvFilePath)) {
    throw new Error(`Environment file missing `);
}

const environmentVars = dotenv.parse(fs.readFileSync(dotenvFilePath));
export default environmentVars;

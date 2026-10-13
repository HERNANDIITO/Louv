// src/config/keys.js
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __FILENAME = fileURLToPath(import.meta.url);
const __DIRNAME = dirname(__FILENAME);

const FILE_PATH_PUBLIC_KEY = resolve(__DIRNAME, '../../public.pem');
const FILE_PATH_PRIVATE_KEY = resolve(__DIRNAME, '../../private.pem');

// Se leen las claves una sola vez al cargar el módulo
const PUBLIC_KEY = readFileSync(FILE_PATH_PUBLIC_KEY, 'utf8');
const PRIVATE_KEY = readFileSync(FILE_PATH_PRIVATE_KEY, 'utf8');

export { PUBLIC_KEY, PRIVATE_KEY };

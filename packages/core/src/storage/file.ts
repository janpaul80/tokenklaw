import fs from 'fs';
import path from 'path';
import { CacheEntry, ProviderPricing, RequestRecord } from '@tokenklaw/shared';
import { DEFAULT_PROVIDER_PRICING } from '@tokenklaw/providers';

export interface FileStorage {
  mode: 'file';
  dataDir: string;
  ensureReady(): void;
  isWritable(): boolean;
  getProviders(): ProviderPricing[];
  getProviderById(id: string): ProviderPricing | undefined;
  getCache(hash: string): CacheEntry | null;
  upsertCache(entry: CacheEntry): void;
  appendRequest(rec: RequestRecord): void;
  getRecentRequests(limit?: number): RequestRecord[];
  getAllRequests(): RequestRecord[];
}

type CacheMap = Record<string, CacheEntry>;

const REQUESTS_FILE = 'requests.jsonl';
const CACHE_FILE = 'cache.json';
const PROVIDERS_FILE = 'providers.json';

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

function writeJsonFile(filePath: string, value: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function appendJsonLine(filePath: string, value: unknown): void {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function readJsonLines<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.trim()) return [];
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => JSON.parse(l) as T);
}

export function createFileStorage(dataDir: string): FileStorage {
  const absDir = path.resolve(dataDir);

  const requestsPath = path.join(absDir, REQUESTS_FILE);
  const cachePath = path.join(absDir, CACHE_FILE);
  const providersPath = path.join(absDir, PROVIDERS_FILE);

  const ensureReady = () => {
    ensureDir(absDir);

    if (!fs.existsSync(requestsPath)) {
      fs.writeFileSync(requestsPath, '', 'utf8');
    }

    if (!fs.existsSync(cachePath)) {
      writeJsonFile(cachePath, {});
    }

    if (!fs.existsSync(providersPath)) {
      writeJsonFile(providersPath, DEFAULT_PROVIDER_PRICING);
    } else {
      const current = readJsonFile<ProviderPricing[]>(providersPath, []);
      if (!Array.isArray(current) || current.length === 0) {
        writeJsonFile(providersPath, DEFAULT_PROVIDER_PRICING);
      }
    }
  };

  const isWritable = () => {
    try {
      ensureReady();
      const probe = path.join(absDir, '.write-test');
      fs.writeFileSync(probe, 'ok', 'utf8');
      fs.unlinkSync(probe);
      return true;
    } catch {
      return false;
    }
  };

  const getProviders = () => {
    ensureReady();
    return readJsonFile<ProviderPricing[]>(providersPath, DEFAULT_PROVIDER_PRICING);
  };

  const getProviderById = (id: string) => getProviders().find(p => p.id === id);

  const getCache = (hash: string): CacheEntry | null => {
    ensureReady();
    const map = readJsonFile<CacheMap>(cachePath, {});
    return map[hash] ?? null;
  };

  const upsertCache = (entry: CacheEntry): void => {
    ensureReady();
    const map = readJsonFile<CacheMap>(cachePath, {});
    map[entry.hash] = entry;
    writeJsonFile(cachePath, map);
  };

  const appendRequest = (rec: RequestRecord): void => {
    ensureReady();
    appendJsonLine(requestsPath, rec);
  };

  const getAllRequests = (): RequestRecord[] => {
    ensureReady();
    return readJsonLines<RequestRecord>(requestsPath);
  };

  const getRecentRequests = (limit = 50): RequestRecord[] => {
    const rows = getAllRequests().sort((a, b) => b.created_at - a.created_at);
    return rows.slice(0, limit);
  };

  return {
    mode: 'file',
    dataDir: absDir,
    ensureReady,
    isWritable,
    getProviders,
    getProviderById,
    getCache,
    upsertCache,
    appendRequest,
    getRecentRequests,
    getAllRequests,
  };
}

export type Path = readonly string[];
export type Kind = 'folder' | 'file';
export type Entry = { kind: Kind; name: string; size: number | null };
export type Document = { name: string; size: number | null; modifiedAt: number | null; text: string | null };
export type Capacity = { total: number; free: number; used: number };

export interface FileStore {
  capacity(): Promise<Capacity | null>;
  list(path: Path): Promise<Entry[]>;
  createFolder(path: Path, name: string): Promise<void>;
  createText(path: Path, name: string, text: string): Promise<void>;
  read(path: Path): Promise<Document>;
  saveText(path: Path, previous: string, text: string): Promise<void>;
  remove(path: Path, kind: Kind): Promise<void>;
}

export const rootFolder = 'lab5-files';
export const rootLabel = 'Документи';

export function routePath(path: Path): string {
  return JSON.stringify(path).replace(/%/g, '\\u0025');
}

function validName(name: string): boolean {
  if (!name || name !== name.trim() || name === '.' || name === '..' || /[\\/:*?"<>|\u0000-\u001f\u007f]/u.test(name)) return false;
  try {
    return encodeURIComponent(name).replace(/%[\dA-F]{2}/g, 'x').length <= 255;
  } catch {
    return false;
  }
}

export function readPath(value: string | string[] | undefined): Path | null {
  if (typeof value !== 'string') return null;
  try {
    const segments: unknown = JSON.parse(value);
    if (Array.isArray(segments) && segments.every((name) => typeof name === 'string' && validName(name))) return segments;
  } catch {
    return null;
  }
  return null;
}

export function entryName(input: string, kind: Kind): string {
  const name = input.trim().normalize('NFC');
  if (!validName(name) || (kind === 'file' && name.toLowerCase() === '.txt')) {
    throw new Error('Введи коректну назву без символів / \\ : * ? " < > |.');
  }
  const fullName = kind === 'file' && !isText(name) ? `${name}.txt` : name;
  if (!validName(fullName)) throw new Error('Назва задовга. Скороти її та спробуй ще раз.');
  return fullName;
}

export function lastSegment(path: Path): string {
  const name = path[path.length - 1];
  if (!name) throw new Error('Вибери файл або папку всередині «Документів».');
  return name;
}

export function assertAvailable(name: string, existing: string[]) {
  const normalized = name.normalize('NFC').toLowerCase();
  if (existing.some((item) => item.normalize('NFC').toLowerCase() === normalized)) {
    throw new Error('Елемент із такою назвою вже існує.');
  }
}

export function extension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export function isText(name: string) {
  return extension(name) === 'txt';
}

export function sortEntries(entries: Entry[]) {
  return entries.sort((a, b) => a.kind === b.kind
    ? a.name.localeCompare(b.name, 'uk', { numeric: true, sensitivity: 'base' })
    : a.kind === 'folder' ? -1 : 1);
}

export function capacity(total: number | null | undefined, free: number | null | undefined): Capacity | null {
  if (typeof total !== 'number' || typeof free !== 'number' || !Number.isFinite(total) || !Number.isFinite(free) || total <= 0) return null;
  const available = Math.max(0, Math.min(total, free));
  return { total, free: available, used: total - available };
}

export function formatSize(bytes: number | null): string {
  if (bytes === null || !Number.isFinite(bytes) || bytes < 0) return '—';
  const units = ['Б', 'КіБ', 'МіБ', 'ГіБ', 'ТіБ'];
  const unit = Math.min(units.length - 1, Math.floor(Math.log(Math.max(1, bytes)) / Math.log(1024)));
  const value = bytes / 1024 ** unit;
  return `${value.toLocaleString('uk', { maximumFractionDigits: unit ? 2 : 0 })} ${units[unit]}`;
}

export function errorText(error: unknown, fallback: string) {
  return error instanceof Error && /^[А-ЯІЇЄҐ]/u.test(error.message) ? error.message : fallback;
}

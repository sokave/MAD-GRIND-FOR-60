import { Directory, File, Paths } from 'expo-file-system';
import { assertAvailable, capacity, isText, lastSegment, rootFolder, sortEntries } from './files';
import type { FileStore, Path } from './files';

function directory(path: Path) {
  const root = new Directory(Paths.document, rootFolder);
  if (!root.exists) root.create({ idempotent: true, intermediates: true });
  return path.length ? new Directory(root, ...path) : root;
}

function newEntry(path: Path, name: string) {
  const parent = directory(path);
  assertAvailable(name, parent.list().map((entry) => entry.name));
  return parent;
}

function existingFile(path: Path) {
  const file = new File(directory(path.slice(0, -1)), lastSegment(path));
  if (!file.exists) throw new Error('Файл не знайдено.');
  return file;
}

export const storage: FileStore = {
  async capacity() {
    return capacity(Paths.totalDiskSpace, Paths.availableDiskSpace);
  },

  async list(path) {
    const folder = directory(path);
    if (!folder.exists) throw new Error('Папку не знайдено. Перейди до батьківської папки.');
    return sortEntries(folder.list().map((entry) => entry instanceof File
      ? { kind: 'file', name: entry.name, size: entry.size }
      : { kind: 'folder', name: entry.name, size: null }));
  },

  async createFolder(path, name) {
    new Directory(newEntry(path, name), name).create();
  },

  async createText(path, name, text) {
    const file = new File(newEntry(path, name), name);
    file.create({ overwrite: false });
    if (!text) return;
    try {
      await file.write(text);
    } catch (error) {
      file.delete();
      throw error;
    }
  },

  async read(path) {
    const file = existingFile(path);
    const info = file.info();
    return {
      name: file.name,
      size: info.size ?? null,
      modifiedAt: info.modificationTime ?? null,
      text: isText(file.name) ? await file.text() : null,
    };
  },

  async saveText(path, previous, text) {
    const file = existingFile(path);
    if (!isText(file.name)) throw new Error('Редагувати можна текстові файли .txt.');
    if (await file.text() !== previous) throw new Error('Вміст файлу змінився. Відкрий його ще раз.');
    try {
      await file.write(text);
    } catch (error) {
      try {
        await file.write(previous);
      } catch {
        throw new Error('Не вдалося зберегти зміни та відновити попередній вміст.');
      }
      throw error;
    }
  },

  async remove(path, kind) {
    const parent = directory(path.slice(0, -1));
    const name = lastSegment(path);
    const entry = kind === 'folder' ? new Directory(parent, name) : new File(parent, name);
    if (!entry.exists) throw new Error('Елемент уже відсутній.');
    entry.delete();
  },
};

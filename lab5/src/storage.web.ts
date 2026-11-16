import { assertAvailable, capacity, isText, lastSegment, rootFolder, sortEntries } from './files';
import type { Entry, FileStore, Path } from './files';

async function directory(path: Path) {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) {
    throw new Error('Відкрий застосунок у сучасному браузері через localhost або HTTPS.');
  }
  const origin = await navigator.storage.getDirectory();
  let folder = await origin.getDirectoryHandle(rootFolder, { create: true });
  for (const part of path) folder = await folder.getDirectoryHandle(part);
  return folder;
}

async function newEntry(path: Path, name: string) {
  const folder = await directory(path);
  const names: string[] = [];
  for await (const item of folder.keys()) names.push(item);
  assertAvailable(name, names);
  return folder;
}

async function existingFile(path: Path) {
  const parent = await directory(path.slice(0, -1));
  return parent.getFileHandle(lastSegment(path));
}

function mutate(task: () => Promise<void>) {
  return navigator.locks ? navigator.locks.request(rootFolder, task) : task();
}

async function writeText(handle: FileSystemFileHandle, text: string) {
  const stream = await handle.createWritable();
  try {
    await stream.write(text);
    await stream.close();
  } catch (error) {
    await stream.abort().catch(() => {});
    throw error;
  }
}

export const storage: FileStore = {
  async capacity() {
    if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
    const { quota, usage } = await navigator.storage.estimate();
    return capacity(quota, quota !== undefined && usage !== undefined ? quota - usage : null);
  },

  async list(path) {
    const folder = await directory(path);
    const entries: Entry[] = [];
    for await (const handle of folder.values()) {
      if (handle.kind === 'directory') entries.push({ kind: 'folder', name: handle.name, size: null });
      else {
        const file = await (handle as FileSystemFileHandle).getFile();
        entries.push({ kind: 'file', name: file.name, size: file.size });
      }
    }
    return sortEntries(entries);
  },

  createFolder(path, name) {
    return mutate(async () => {
      const folder = await newEntry(path, name);
      await folder.getDirectoryHandle(name, { create: true });
    });
  },

  createText(path, name, text) {
    return mutate(async () => {
      const folder = await newEntry(path, name);
      const handle = await folder.getFileHandle(name, { create: true });
      if (!text) return;
      try {
        await writeText(handle, text);
      } catch (error) {
        await folder.removeEntry(name);
        throw error;
      }
    });
  },

  async read(path) {
    const file = await (await existingFile(path)).getFile();
    return {
      name: file.name,
      size: file.size,
      modifiedAt: file.lastModified,
      text: isText(file.name) ? await file.text() : null,
    };
  },

  saveText(path, previous, text) {
    return mutate(async () => {
      const handle = await existingFile(path);
      if (!isText(handle.name)) throw new Error('Редагувати можна текстові файли .txt.');
      const file = await handle.getFile();
      if (await file.text() !== previous) throw new Error('Вміст файлу змінився. Відкрий його ще раз.');
      await writeText(handle, text);
    });
  },

  remove(path, kind) {
    return mutate(async () => {
      const name = lastSegment(path);
      const parent = await directory(path.slice(0, -1));
      if (kind === 'folder') await parent.getDirectoryHandle(name);
      else await parent.getFileHandle(name);
      await parent.removeEntry(name, { recursive: kind === 'folder' });
    });
  },
};

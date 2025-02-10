let instance: LocalStorageService;

export class LocalStorageService {
  private constructor() {}

  static instance(): LocalStorageService {
    if (!instance) {
      instance = new LocalStorageService();
    }

    return instance;
  }

  readValue<T extends Record<string, any>>(key: string): T | null {
    try {
      const val = window.localStorage.getItem(key);

      if (!val) {
        return null;
      }

      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  }

  write(key: string, value: any): void {
    let val;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      val = JSON.stringify({ value });
    } else {
      val = JSON.stringify(value);
    }

    window.localStorage.setItem(key, val);
  }
}

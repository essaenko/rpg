import { LocalStorageService } from '@client/services/localstorage';

let instance: SettingsService;

export class SettingsService {
  private readonly settings: Record<string, any> = {};

  private constructor() {
    this.settings = LocalStorageService.instance().readValue('settings') ?? {};
  }

  static instance(): SettingsService {
    if (!instance) {
      instance = new SettingsService();
    }

    return instance;
  }

  setSetting(key: string, value: any) {
    this.settings[key] = value;
  }

  getSetting(key: string): any {
    return this.settings[key];
  }

  saveSettings() {
    LocalStorageService.instance().write('settings', this.settings);
  }
}

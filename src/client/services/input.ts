import { SettingsService } from '@client/services/settings';
import { Keys } from '@client/utils/types';

let instance: InputService;

export class InputService {
  private readonly bindings: Record<string, Keys> = {
    KeyQ: Keys.Spell1,
    KeyE: Keys.Spell2,
    KeyR: Keys.Spell3,
    KeyT: Keys.Spell4,
    KeyF: Keys.Spell5,
    Digit1: Keys.Spell6,
    Digit2: Keys.Spell7,
    Digit3: Keys.Spell8,
    Digit4: Keys.Spell9,
    Digit5: Keys.Spell10,
  };
  private spellBinding: Record<string, string> = {};
  private readonly pressed = new Set<Keys>();
  private constructor() {
    const binding = SettingsService.instance().getSetting('binding');
    const spells = SettingsService.instance().getSetting('spell-binding');

    if (binding) {
      this.bindings = binding;
    }
    if (spells) {
      this.spellBinding = spells;
    }

    document.addEventListener('keypress', ({ code }) => {
      if (code in this.bindings) {
        this.pressed.add(this.bindings[code]);
      }
    });
    document.addEventListener('keyup', ({ code }) => {
      if (code in this.bindings) {
        this.pressed.delete(this.bindings[code]);
      }
    });
  }

  isPressed(key: Keys): boolean {
    return this.pressed.has(key);
  }

  getSpellBinding(key: Keys): string | null {
    return this.spellBinding[key] ?? null;
  }

  static instance() {
    if (!instance) {
      instance = new InputService();
    }

    return instance;
  }
}

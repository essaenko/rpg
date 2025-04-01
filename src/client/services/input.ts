import { SettingsService } from '@client/services/settings';
import { DEFAULT_KEY_BINDING } from '@client/utils/const';
import { Keys, SpellPanel } from '@client/utils/types';
import type { Spells } from '@shared/utils/spells';

let instance: InputService;

export class InputService {
  private readonly bindings: Record<SpellPanel, Keys> = DEFAULT_KEY_BINDING;
  private readonly spellBinding: Partial<Record<SpellPanel, Spells>> = {};
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
      if (Object.values(this.bindings).includes(code as Keys)) {
        this.pressed.add(code as Keys);
      }
    });
    document.addEventListener('keyup', ({ code }) => {
      if (Object.values(this.bindings).includes(code as Keys)) {
        this.pressed.delete(code as Keys);
      }
    });
  }

  isPressed(key: Keys): boolean {
    return this.pressed.has(key);
  }

  getSpellBinding(key: Keys): Spells | null {
    const bind = Object.entries(this.bindings).find(([_, k]) => k === key);

    if (bind) {
      return this.spellBinding[+bind[0] as SpellPanel] ?? null;
    }

    return null;
  }

  static instance() {
    if (!instance) {
      instance = new InputService();
    }

    return instance;
  }
}

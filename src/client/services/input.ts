import { SettingsService } from '@client/services/settings';
import { DEFAULT_KEY_BINDING } from '@client/utils/const';
import { Keys, SpellPanel } from '@client/utils/types';
import { SpellSlot } from '@shared/types';

let instance: InputService;

export class InputService {
  private readonly bindings: Record<Keys, SpellPanel> = DEFAULT_KEY_BINDING;
  private readonly spellBinding: Record<SpellPanel, SpellSlot> = {
    [SpellPanel.Spell1]: SpellSlot.Main,
    [SpellPanel.Spell2]: SpellSlot.Secondary,
    [SpellPanel.Spell3]: SpellSlot.Buff,
    [SpellPanel.Spell4]: SpellSlot.Ultimate,
    [SpellPanel.Spell5]: SpellSlot.Gather,
    [SpellPanel.Spell6]: SpellSlot.Loot,
  };
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
      this.pressed.add(code as Keys);
    });
    document.addEventListener('keyup', ({ code }) => {
      this.pressed.delete(code as Keys);
    });
  }

  isPressed(key: Keys): boolean {
    return this.pressed.has(key);
  }

  getSpellBinding(key: Keys): SpellSlot | null {
    return this.spellBinding[this.bindings[key]] ?? null;
  }

  static instance() {
    if (!instance) {
      instance = new InputService();
    }

    return instance;
  }
}

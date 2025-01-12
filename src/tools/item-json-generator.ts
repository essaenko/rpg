import { Weapon } from "../shared/schemas/game/item/weapon";
import { EquipSlot, WeaponHand, WeaponType } from "../shared/types";
import { nanoid } from "nanoid";

const weapon = new Weapon();
weapon.id = nanoid(9);
weapon.name = "Тренировочный меч";
weapon.description = "Меч для тренировок";
weapon.cost = 100;
weapon.attackMax = 13;
weapon.attackMin = 10;
weapon.speed = 2;
weapon.type = WeaponType.Sword;
weapon.slot = EquipSlot.MainHand;
weapon.hand = WeaponHand.DualHand;

console.log(JSON.stringify(weapon), weapon.id);

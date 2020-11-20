import React, {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from "react";
import aPassives from "./data/a-passives.json";
import assists from "./data/assists.json";
import bPassives from "./data/b-passives.json";
import cPassives from "./data/c-passives.json";
import seals from "./data/seals.json";
import specials from "./data/specials.json";
import weapons from "./data/weapons.json";
import { Skill, Slot, WeaponType } from "./types";

export interface SkillSelectProps {
  slot: Slot;
  value?: Skill;
  weaponType?: WeaponType;
  onSelect: (skill?: Skill) => void;
}

export default function SkillSelect({
  value,
  onSelect,
  slot,
  weaponType,
}: SkillSelectProps) {
  const [selected, setSelected]: [
    Skill | undefined,
    Dispatch<SetStateAction<Skill | undefined>>
  ] = useState<Skill | undefined>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const selectSkill: (event: ChangeEvent<HTMLSelectElement>) => void = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    let arr: Skill[] = [];
    switch (slot) {
      case Slot.Assist:
        arr = assists;
        break;
      case Slot.Special:
        arr = specials;
        break;
      case Slot.A:
        arr = aPassives;
        break;
      case Slot.B:
        arr = bPassives;
        break;
      case Slot.C:
        arr = cPassives;
        break;
      case Slot.Seal:
        arr = seals;
        break;
      case Slot.Weapon:
        arr = weapons;
        break;
      default:
        break;
    }
    const skill: Skill | undefined = arr.find(
      (s: Skill) => s.name === event.target.value
    );

    setSelected(skill);
    onSelect(skill);
  };

  const icon: JSX.Element | null = useMemo(() => {
    const styles: CSSProperties = {
      width: "20px",
      height: "20px",
    };
    switch (slot) {
      case Slot.Assist:
        return (
          <img style={styles} src="./Icon_Skill_Assist.png" alt="Assist" />
        );
      case Slot.Special:
        return (
          <img style={styles} src="./Icon_Skill_Special.png" alt="Special" />
        );
      case Slot.Weapon:
        switch (weaponType) {
          case WeaponType.Sword:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Sword.png"
                alt="Sword"
              />
            );
          case WeaponType.Lance:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Lance.png"
                alt="Lance"
              />
            );
          case WeaponType.Axe:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Axe.png"
                alt="Axe"
              />
            );
          case WeaponType.Staff:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Staff.png"
                alt="Staff"
              />
            );
          case WeaponType.RBow:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Bow.png"
                alt="Red Bow"
              />
            );
          case WeaponType.RDagger:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Dagger.png"
                alt="Red Dagger"
              />
            );
          case WeaponType.RTome:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Tome.png"
                alt="Red Tome"
              />
            );
          case WeaponType.RBreath:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Breath.png"
                alt="Red Breath"
              />
            );
          case WeaponType.RBeast:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Red_Beast.png"
                alt="Red Beast"
              />
            );
          case WeaponType.BBow:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Bow.png"
                alt="Blue Bow"
              />
            );
          case WeaponType.BDagger:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Dagger.png"
                alt="Blue Dagger"
              />
            );
          case WeaponType.BTome:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Tome.png"
                alt="Blue Tome"
              />
            );
          case WeaponType.BBreath:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Breath.png"
                alt="Blue Breath"
              />
            );
          case WeaponType.BBeast:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Blue_Beast.png"
                alt="Blue Beast"
              />
            );
          case WeaponType.GBow:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Bow.png"
                alt="Green Bow"
              />
            );
          case WeaponType.GDagger:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Dagger.png"
                alt="Green Dagger"
              />
            );
          case WeaponType.GTome:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Tome.png"
                alt="Green Tome"
              />
            );
          case WeaponType.GBreath:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Breath.png"
                alt="Green Breath"
              />
            );
          case WeaponType.GBeast:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Green_Beast.png"
                alt="Green Beast"
              />
            );
          case WeaponType.CBow:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Bow.png"
                alt="Colorless Bow"
              />
            );
          case WeaponType.CDagger:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Dagger.png"
                alt="Colorless Dagger"
              />
            );
          case WeaponType.CTome:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Tome.png"
                alt="Colorless Tome"
              />
            );
          case WeaponType.CBreath:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Breath.png"
                alt="Colorless Breath"
              />
            );
          case WeaponType.CBeast:
            return (
              <img
                style={styles}
                src="./weapon-types/Icon_Class_Colorless_Beast.png"
                alt="Colorless Beast"
              />
            );
          default:
            return null;
        }
      default:
        return selected ? (
          <img style={styles} src={selected.icon} alt={selected.name} />
        ) : null;
    }
  }, [slot, weaponType, selected]);

  const selectList: JSX.Element[] | null = useMemo(() => {
    switch (slot) {
      case Slot.Assist:
        return assists.map((assist: Skill) => (
          <option key={assist.name} value={assist.name}>
            {assist.name}
          </option>
        ));
      case Slot.Special:
        return specials.map((special: Skill) => (
          <option key={special.name} value={special.name}>
            {special.name}
          </option>
        ));
      case Slot.A:
        return aPassives.map((passive: Skill) => (
          <option key={passive.name} value={passive.name}>
            {passive.name}
          </option>
        ));
      case Slot.B:
        return bPassives.map((passive: Skill) => (
          <option key={passive.name} value={passive.name}>
            {passive.name}
          </option>
        ));
      case Slot.C:
        return cPassives.map((passive: Skill) => (
          <option key={passive.name} value={passive.name}>
            {passive.name}
          </option>
        ));
      case Slot.Seal:
        return seals.map((seal: Skill) => (
          <option key={seal.name} value={seal.name}>
            {seal.name}
          </option>
        ));
      case Slot.Weapon:
        return weapons
          .filter((weapon: Skill) => {
            switch (weaponType) {
              case WeaponType.Sword:
              case WeaponType.Lance:
              case WeaponType.Staff:
              case WeaponType.Axe:
              case WeaponType.RTome:
              case WeaponType.BTome:
              case WeaponType.GTome:
              case WeaponType.CTome:
                return weaponType === weapon.weaponType;
              case WeaponType.RBow:
              case WeaponType.BBow:
              case WeaponType.GBow:
              case WeaponType.CBow:
                return (
                  weapon.weaponType === WeaponType.RBow ||
                  weapon.weaponType === WeaponType.BBow ||
                  weapon.weaponType === WeaponType.GBow ||
                  weapon.weaponType === WeaponType.CBow
                );
              case WeaponType.RDagger:
              case WeaponType.BDagger:
              case WeaponType.GDagger:
              case WeaponType.CDagger:
                return (
                  weapon.weaponType === WeaponType.RDagger ||
                  weapon.weaponType === WeaponType.BDagger ||
                  weapon.weaponType === WeaponType.GDagger ||
                  weapon.weaponType === WeaponType.CDagger
                );
              case WeaponType.RBreath:
              case WeaponType.BBreath:
              case WeaponType.GBreath:
              case WeaponType.CBreath:
                return (
                  weapon.weaponType === WeaponType.RBreath ||
                  weapon.weaponType === WeaponType.BBreath ||
                  weapon.weaponType === WeaponType.GBreath ||
                  weapon.weaponType === WeaponType.CBreath
                );
              case WeaponType.RBeast:
              case WeaponType.BBeast:
              case WeaponType.GBeast:
              case WeaponType.CBeast:
                return (
                  weapon.weaponType === WeaponType.RBeast ||
                  weapon.weaponType === WeaponType.BBeast ||
                  weapon.weaponType === WeaponType.GBeast ||
                  weapon.weaponType === WeaponType.CBeast
                );
              default:
                return false;
            }
          })
          .map((weapon: Skill) => (
            <option key={weapon.name} value={weapon.name}>
              {weapon.name}
            </option>
          ));

      default:
        return null;
    }
  }, [slot, weaponType]);

  return (
    <div style={{ display: "flex", alignItems: 'center' }}>
      <div style={{ width: "2em", flexGrow: 1 }}>{icon}</div>
      <select
        style={{ width: "15em" }}
        name="skill"
        value={selected?.name}
        onChange={selectSkill}
      >
        <option value="">None</option>
        {selectList}
      </select>
    </div>
  );
}

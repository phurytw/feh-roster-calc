import React, { ChangeEvent } from "react";
import { Hero, Skill, Slot, Stat } from "./types";
import SkillSelect from "./SkillSelect";
import calculateScore, { calculateBst } from "./score";

export interface HeroProps {
  hero: Hero;
  onChange: (hero: Hero) => void;
  onDelete: () => void;
}

export default function HeroCard({ hero, onChange, onDelete }: HeroProps) {
  const {
    name,
    icon,
    weaponType,
    merges,
    asset,
    flaw,
    hasBlessing,
    weapon,
    assist,
    special,
    a,
    b,
    c,
    seal,
  }: Hero = hero;
  const onWeaponChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      weapon: skill,
    });
  };
  const onAssistChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      assist: skill,
    });
  };
  const onSpecialChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      special: skill,
    });
  };
  const onAChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      a: skill,
    });
  };
  const onBChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      b: skill,
    });
  };
  const onCChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      c: skill,
    });
  };
  const onSealChange: (skill?: Skill) => void = (skill?: Skill) => {
    onChange({
      ...hero,
      seal: skill,
    });
  };
  const onMergeChange: (event: ChangeEvent<HTMLInputElement>) => void = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value: number = parseInt(event.target.value);
    if (value >= 0 && value <= 10) {
      onChange({ ...hero, merges: value });
    }
  };
  const onAssetChange: (event: ChangeEvent<HTMLSelectElement>) => void = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value: Stat = parseInt(event.target.value);
    switch (value) {
      case Stat.Hp:
        onChange({ ...hero, asset: Stat.Hp });
        break;
      case Stat.Atk:
        onChange({ ...hero, asset: Stat.Atk });
        break;
      case Stat.Spd:
        onChange({ ...hero, asset: Stat.Spd });
        break;
      case Stat.Def:
        onChange({ ...hero, asset: Stat.Def });
        break;
      case Stat.Res:
        onChange({ ...hero, asset: Stat.Res });
        break;
      default:
        onChange({ ...hero, asset: undefined });
        break;
    }
  };
  const onFlawChange: (event: ChangeEvent<HTMLSelectElement>) => void = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value: Stat = parseInt(event.target.value);
    switch (value) {
      case Stat.Hp:
        onChange({ ...hero, flaw: Stat.Hp });
        break;
      case Stat.Atk:
        onChange({ ...hero, flaw: Stat.Atk });
        break;
      case Stat.Spd:
        onChange({ ...hero, flaw: Stat.Spd });
        break;
      case Stat.Def:
        onChange({ ...hero, flaw: Stat.Def });
        break;
      case Stat.Res:
        onChange({ ...hero, flaw: Stat.Res });
        break;
      default:
        onChange({ ...hero, flaw: undefined });
        break;
    }
  };
  const onBlessingChange: (event: ChangeEvent<HTMLSelectElement>) => void = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value) {
      onChange({ ...hero, hasBlessing: true });
    } else {
      onChange({ ...hero, hasBlessing: false });
    }
  };
  const deleteHero: () => void = () => {
    if (window.confirm(`Are you sure to delete ${name}?`)) {
      onDelete();
    }
  };

  return (
    <div
      style={{
        margin: "1em",
        padding: "0 1em",
        textAlign: "center",
        border: "2px solid #ceb766",
        borderRadius: "1em"
      }}
    >
      <h3>{name}</h3>
      <div>
        <img src={icon} alt={name} />
      </div>
      <div>
        <span>Merges</span>
        <input type="number" onChange={onMergeChange} value={merges} />
      </div>
      <div>
        <span>Asset</span>
        <select name="asset" value={asset} onChange={onAssetChange}>
          <option value="">None</option>
          <option value={Stat.Hp}>Hp</option>
          <option value={Stat.Atk}>Atk</option>
          <option value={Stat.Spd}>Spd</option>
          <option value={Stat.Def}>Def</option>
          <option value={Stat.Res}>Res</option>
        </select>
      </div>
      <div>
        <span>Flaw</span>
        <select name="flaw" value={flaw} onChange={onFlawChange}>
          <option value="">None</option>
          <option value={Stat.Hp}>Hp</option>
          <option value={Stat.Atk}>Atk</option>
          <option value={Stat.Spd}>Spd</option>
          <option value={Stat.Def}>Def</option>
          <option value={Stat.Res}>Res</option>
        </select>
      </div>
      <SkillSelect
        value={weapon}
        weaponType={weaponType}
        slot={Slot.Weapon}
        onSelect={onWeaponChange}
      />
      <SkillSelect
        value={assist}
        slot={Slot.Assist}
        onSelect={onAssistChange}
      />
      <SkillSelect
        value={special}
        slot={Slot.Special}
        onSelect={onSpecialChange}
      />
      <SkillSelect value={a} slot={Slot.A} onSelect={onAChange} />
      <SkillSelect value={b} slot={Slot.B} onSelect={onBChange} />
      <SkillSelect value={c} slot={Slot.C} onSelect={onCChange} />
      <SkillSelect
        value={seal}
        slot={Slot.Seal}
        onSelect={onSealChange}
      />
      <h4>BST: {calculateBst(hero)}</h4>
      <h4>Score: {calculateScore(hero)}</h4>
      <button onClick={deleteHero}>Delete</button>
    </div>
  );
}

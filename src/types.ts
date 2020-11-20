export enum Slot {
  Weapon,
  Assist,
  Special,
  A,
  B,
  C,
  Seal,
}

export enum Stat {
  Hp,
  Atk,
  Spd,
  Def,
  Res,
}

export interface PossibleStats {
  flaw: number;
  neutral: number;
  asset: number;
}

export interface Skill {
  name: string;
  icon: string;
  slot: Slot;
  weaponType?: WeaponType;
  sp: number;
  bstModifier?: number;
}

export enum WeaponType {
  Sword,
  Lance,
  Axe,
  Staff,
  RBow,
  RDagger,
  RTome,
  RBreath,
  RBeast,
  BBow,
  BDagger,
  BTome,
  BBreath,
  BBeast,
  GBow,
  GDagger,
  GTome,
  GBreath,
  GBeast,
  CBow,
  CDagger,
  CTome,
  CBreath,
  CBeast,
}

export interface Hero {
  id?: string;
  name: string;
  icon: string;
  stats: {
    hp: PossibleStats;
    atk: PossibleStats;
    spd: PossibleStats;
    def: PossibleStats;
    res: PossibleStats;
  };
  weaponType: WeaponType;
  isLegendaryOrMythic: boolean;
  level: number;
  merges: number;
  asset?: Stat;
  flaw?: Stat;
  hasBlessing?: boolean;
  weapon?: Skill;
  assist?: Skill;
  special?: Skill;
  a?: Skill;
  b?: Skill;
  c?: Skill;
  seal?: Skill;
  bstModifier?: number;
}

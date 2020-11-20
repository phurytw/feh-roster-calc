import { Hero, Stat, PossibleStats, Skill } from "./types";

const statMap: { [key: string]: Stat } = {
  hp: Stat.Hp,
  atk: Stat.Atk,
  spd: Stat.Spd,
  def: Stat.Def,
  res: Stat.Res,
};

type StatName = "hp" | "atk" | "spd" | "def" | "res";

export function calculateBst(hero: Hero): number {
  let bst: number = 0;
  // bst
  for (const stat in hero.stats) {
    const statValue: PossibleStats = hero.stats[stat as StatName];
    if (statMap[stat] === hero.asset) {
      bst += statValue.asset;
    } else if (statMap[stat] === hero.flaw && hero.merges === 0) {
      bst += statValue.flaw;
    } else {
      bst += statValue.neutral;
    }
  }
  // neutral bst bonus
  if (typeof hero.asset === "undefined" && typeof hero.flaw === "undefined") {
    bst += 3;
  }
  return bst;
}

export function calculateScore(hero: Hero): number {
  let bst: number = calculateBst(hero);
  // check if has bst modifiers
  const bstModifiers: number[] = [
    hero.bstModifier,
    hero.weapon?.bstModifier,
    hero.assist?.bstModifier,
    hero.special?.bstModifier,
    hero.a?.bstModifier,
    hero.b?.bstModifier,
    hero.c?.bstModifier,
    hero.seal?.bstModifier,
  ].filter((bstMod: number | undefined) => bstMod) as number[];

  // final bst
  bst = Math.max(...bstModifiers, bst);
  const sp: number = ([
    hero.weapon,
    hero.assist,
    hero.a,
    hero.b,
    hero.c,
    hero.special,
    hero.seal,
  ].filter((skill: Skill | undefined) => skill) as Skill[]).reduce(
    (acc: number, s: Skill) => acc + s.sp,
    0
  );
  const bstScore: number = (bst - (bst % 5)) / 5;
  const advArena: number = 155;
  const unitNumber: number = 4 * 7;
  const rarityScore: number = 5 * 5;
  const levelScore: number = 40 * 2.25;
  const mergeScore: number = hero.merges * 2;
  const spScore: number = (sp - (sp % 100)) / 100;
  //   const blessingScore: number = hero.hasBlessing ? 4 : 0;

  return (
    (bstScore +
      advArena +
      unitNumber +
      rarityScore +
      levelScore +
      mergeScore +
      spScore) *
    2
  );
}

export default calculateScore;

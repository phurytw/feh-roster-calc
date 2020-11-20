import { load } from "cheerio";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
  WriteStream,
} from "fs";
import { IncomingMessage } from "http";
import { get } from "https";
import { resolve } from "path";
import sanitizeFilename from "sanitize-filename";
import { Hero, PossibleStats, Skill, Slot, WeaponType } from "../src/types";

const heroDb = importDb("../src/data/heroes.json");
const weaponDb = importDb("../src/data/weapons.json");
const assistDb = importDb("../src/data/assists.json");
const specialDb = importDb("../src/data/specials.json");
const passiveADb = importDb("../src/data/a-passives.json");
const passiveBDb = importDb("../src/data/b-passives.json");
const passiveCDb = importDb("../src/data/c-passives.json");
const sealDb = importDb("../src/data/seals.json");

function importDb(path: string) {
  if (existsSync(path)) {
    return require(path);
  }
  return [];
}

const heroList: string = "https://feheroes.gamepedia.com/List_of_Heroes";
const weaponList: string = "https://feheroes.gamepedia.com/Weapons_(full)";
const assistList: string = "https://feheroes.gamepedia.com/Assists";
const specialList: string = "https://feheroes.gamepedia.com/Specials";
const passiveList: string = "https://feheroes.gamepedia.com/Passives";
const sealList: string = "https://feheroes.gamepedia.com/Sacred_Seals";
const blessings: string[] = [
  "Fire",
  "Water",
  "Earth",
  "Wind",
  "Light",
  "Astra",
  "Dark",
  "Anima",
];

function parseWeaponType(weaponType: string): WeaponType {
  switch (weaponType.trim().toUpperCase()) {
    case "SWORD":
      return WeaponType.Sword;
    case "LANCE":
      return WeaponType.Lance;
    case "AXE":
      return WeaponType.Axe;
    case "STAFF":
      return WeaponType.Staff;
    case "RED BOW":
      return WeaponType.RBow;
    case "RED DAGGER":
      return WeaponType.RDagger;
    case "RED TOME":
      return WeaponType.RTome;
    case "RED BREATH":
      return WeaponType.RBreath;
    case "RED BEAST":
      return WeaponType.RBeast;
    case "BLUE BOW":
      return WeaponType.BBow;
    case "BLUE DAGGER":
      return WeaponType.BDagger;
    case "BLUE TOME":
      return WeaponType.BTome;
    case "BLUE BREATH":
      return WeaponType.BBreath;
    case "BLUE BEAST":
      return WeaponType.BBeast;
    case "GREEN BOW":
      return WeaponType.GBow;
    case "GREEN DAGGER":
      return WeaponType.GDagger;
    case "GREEN TOME":
      return WeaponType.GTome;
    case "GREEN BREATH":
      return WeaponType.GBreath;
    case "GREEN BEAST":
      return WeaponType.GBeast;
    case "COLORLESS BOW":
      return WeaponType.CBow;
    case "COLORLESS DAGGER":
      return WeaponType.CDagger;
    case "COLORLESS TOME":
      return WeaponType.CTome;
    case "COLORLESS BREATH":
      return WeaponType.CBreath;
    case "COLORLESS BEAST":
      return WeaponType.CBeast;
    default:
      throw new Error(`Invalid Weapon Type: ${weaponType}`);
  }
}

function getWeaponTypeIcon(weaponType: WeaponType) {
  let baseFile: string;
  switch (weaponType) {
    case WeaponType.Sword:
      baseFile = "Icon_Class_Red_Sword.png";
      break;
    case WeaponType.Lance:
      baseFile = "Icon_Class_Blue_Lance.png";
      break;
    case WeaponType.Axe:
      baseFile = "Icon_Class_Green_Axe.png";
      break;
    case WeaponType.Staff:
      baseFile = "Icon_Class_Colorless_Staff.png";
      break;
    case WeaponType.RBow:
      baseFile = "Icon_Class_Red_Bow.png";
      break;
    case WeaponType.RDagger:
      baseFile = "Icon_Class_Red_Dagger.png";
      break;
    case WeaponType.RTome:
      baseFile = "Icon_Class_Red_Tome.png";
      break;
    case WeaponType.RBreath:
      baseFile = "Icon_Class_Red_Breath.png";
      break;
    case WeaponType.RBeast:
      baseFile = "Icon_Class_Red_Beast.png";
      break;
    case WeaponType.BBow:
      baseFile = "Icon_Class_Blue_Bow.png";
      break;
    case WeaponType.BDagger:
      baseFile = "Icon_Class_Blue_Dagger.png";
      break;
    case WeaponType.BTome:
      baseFile = "Icon_Class_Blue_Tome.png";
      break;
    case WeaponType.BBreath:
      baseFile = "Icon_Class_Blue_Breath.png";
      break;
    case WeaponType.BBeast:
      baseFile = "Icon_Class_Blue_Beast.png";
      break;
    case WeaponType.GBow:
      baseFile = "Icon_Class_Green_Bow.png";
      break;
    case WeaponType.GDagger:
      baseFile = "Icon_Class_Green_Dagger.png";
      break;
    case WeaponType.GTome:
      baseFile = "Icon_Class_Green_Tome.png";
      break;
    case WeaponType.GBreath:
      baseFile = "Icon_Class_Green_Breath.png";
      break;
    case WeaponType.GBeast:
      baseFile = "Icon_Class_Green_Beast.png";
      break;
    case WeaponType.CBow:
      baseFile = "Icon_Class_Colorless_Bow.png";
      break;
    case WeaponType.CDagger:
      baseFile = "Icon_Class_Colorless_Dagger.png";
      break;
    case WeaponType.CTome:
      baseFile = "Icon_Class_Colorless_Tome.png";
      break;
    case WeaponType.CBreath:
      baseFile = "Icon_Class_Colorless_Breath.png";
      break;
    case WeaponType.CBeast:
      baseFile = "Icon_Class_Colorless_Beast.png";
      break;

    default:
      throw new Error(`Invalid Weapon Type: ${weaponType}`);
  }
  return `weapon-types/${baseFile}`;
}

function downloadAsString(src: string): Promise<string> {
  return new Promise(
    (resolve: (value: string) => void, reject: (reason?: any) => void) => {
      get(src, (res: IncomingMessage) => {
        let data: string = "";
        res.on("data", (chunk: string) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
        res.on("error", (err: Error) => {
          reject(err);
        });
      });
    }
  );
}

function downloadAsFile(src: string, dest: string): Promise<void> {
  return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
    get(src, (res: IncomingMessage) => {
      const destFile: WriteStream = createWriteStream(dest);
      res.pipe(destFile);
      res.on("end", () => {
        resolve();
      });
      res.on("error", (err: Error) => {
        reject(err);
      });
    });
  });
}

async function scrapHero(
  name: string,
  icon: string,
  src: string
): Promise<Hero> {
  const heroData: string = await downloadAsString(src);
  const $: CheerioStatic = load(heroData);
  let bstModifier: number | undefined = undefined;
  let isLegendaryOrMythic: boolean = false;
  let weaponType: WeaponType = WeaponType.Sword;
  const infobox: Cheerio = $("table.wikitable.hero-infobox");
  $(infobox)
    .find("tr")
    .each((trIndex: number, trElement: CheerioElement) => {
      const text: string = $(trElement).text();

      if (text.includes("Duel")) {
        const matches: RegExpExecArray | null = /\d\d\d/.exec(text);
        if (matches && matches[0]) {
          bstModifier = parseInt(matches[0]);
        }
      }

      if (
        text.includes("Effect") &&
        blessings.some((blessing: string) => text.includes(blessing))
      ) {
        isLegendaryOrMythic = true;
      }

      if (text.includes("Weapon Type")) {
        weaponType = parseWeaponType($(trElement).find("td").text());
      }
    });

  const statCells: CheerioElement[] = $("span#Level_40_stats")
    .parent()
    .next("table")
    .find("tr")
    .last()
    .find("td")
    .toArray();

  const getPossibleStats: (td: CheerioElement) => PossibleStats = (
    td: CheerioElement
  ): PossibleStats => {
    const [flaw, neutral, asset]: number[] = $(td)
      .text()
      .split("/")
      .map((value: string) => parseInt(value));
    return {
      asset,
      flaw,
      neutral,
    };
  };

  return {
    name,
    icon,
    level: 40,
    merges: 0,
    isLegendaryOrMythic,
    weaponType,
    stats: {
      hp: getPossibleStats(statCells[1]),
      atk: getPossibleStats(statCells[2]),
      spd: getPossibleStats(statCells[3]),
      def: getPossibleStats(statCells[4]),
      res: getPossibleStats(statCells[5]),
    },
    bstModifier,
  };
}

async function scrapHeroes({ overwrite, showGot, showSkipped }: ScrapOptions) {
  const heroListData: string = await downloadAsString(heroList);
  const $list: CheerioStatic = load(heroListData);
  const heroTable: CheerioElement[] = $list(
    "table.sortable.wikitable.default tr"
  ).toArray();
  let heroes: Hero[] = [];

  for (let i = 1; i < heroTable.length; i++) {
    const element: CheerioElement = heroTable[i];
    const name: string | undefined = $list(element)
      .find("td a")
      .first()
      .attr("title");
    let icon: string | undefined = $list(element)
      .find("td img")
      .first()
      .attr("src");
    const link: string | undefined = $list(element)
      .find("td a")
      .first()
      .attr("href");

    if (name && icon && link) {
      const heroFromDb: Hero | undefined = heroDb.find(
        (h: Hero) => h.name === name
      );
      if (!heroFromDb || overwrite) {
        const page: string = `https://feheroes.gamepedia.com${link}`;

        await downloadAsFile(
          icon,
          resolve(
            __dirname,
            "..",
            "public",
            "heroes",
            `${sanitizeFilename(name)}.png`
          )
        );
        icon = `heroes/${sanitizeFilename(name)}.png`;

        const hero: Hero = await scrapHero(name, icon, page);

        heroes = [...heroes, hero];
        if (showGot) {
          console.log("Got hero:", name);
        }
      } else {
        heroes = [...heroes, heroFromDb];
        if (showSkipped) {
          console.log("Skipped hero:", name);
        }
      }
    }
  }

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "heroes.json"),
    JSON.stringify(heroes)
  );
}

async function scrapWeapon(src: string): Promise<Skill[]> {
  const data: string = await downloadAsString(src);
  const $: CheerioStatic = load(data);
  const infobox = $(data).find(".hero-infobox");
  const name: string | undefined = infobox.find("span").first().text();
  const weaponType: WeaponType = parseWeaponType(
    infobox
      .find("tr")
      .filter((trIndex: number, trElement: CheerioElement) => {
        return $(trElement).text().includes("Weapon type");
      })
      .find("a")
      .attr("title") || ""
  );
  const sp: number | undefined = parseInt(
    infobox
      .find("tr")
      .filter((trIndex: number, trElement: CheerioElement) => {
        return $(trElement).text().includes("SP");
      })
      .find("td")
      .text() || ""
  );

  if (name && sp) {
    const [_, ...refines]: CheerioElement[] = $("#Upgrades")
      .parent()
      .siblings("table")
      .first()
      .find("tr")
      .toArray();
    if (refines.length > 0) {
      const refinedSpMatch: RegExpExecArray | null = /(\d{2,3}) SP/.exec(
        $(refines[0]).text()
      );
      if (!refinedSpMatch || !refinedSpMatch[1]) {
        throw new Error(`Refined SP not found for ${name}`);
      }
      const refinedSp: number = parseInt(refinedSpMatch[1]);

      return [
        {
          icon: getWeaponTypeIcon(weaponType),
          name,
          slot: Slot.Weapon,
          sp,
          weaponType,
        },
        {
          icon: getWeaponTypeIcon(weaponType),
          name: `${name} (Refined)`,
          slot: Slot.Weapon,
          sp: refinedSp,
          weaponType,
        },
      ];
    }

    return [
      {
        icon: getWeaponTypeIcon(weaponType),
        name,
        slot: Slot.Weapon,
        sp,
        weaponType,
      },
    ];
  }

  return [];
}

async function scrapWeapons({ overwrite, showGot, showSkipped }: ScrapOptions) {
  const data: string = await downloadAsString(weaponList);
  const $: CheerioStatic = load(data);
  const [, ...weapons]: CheerioElement[] = $("table tr").toArray();
  let weaponsData: Skill[] = [];

  for (let i = 0; i < weapons.length; i++) {
    const element: CheerioElement = weapons[i];
    const link: Cheerio = $(element).find("a").first();
    const name: string | undefined = $(link).text();
    const href: string | undefined = $(link).attr("href");
    if (name && href) {
      const weaponsFromDb: Skill[] = weaponDb.filter((w: Skill) =>
        w.name.startsWith(name)
      );
      if (weaponsFromDb.length === 0 || overwrite) {
        weaponsData = [
          ...weaponsData,
          ...(await scrapWeapon(`https://feheroes.gamepedia.com${href}`)),
        ];
        if (showGot) {
          console.log("Got weapon:", name);
        }
      } else {
        weaponsData = [...weaponsData, ...weaponsFromDb];
        if (showSkipped) {
          console.log("Skipped weapon:", name);
        }
      }
    }
  }

  // remove duplicates
  // happens with Falchion
  weaponsData = weaponsData.reduce(
    (acc: Skill[], cur: Skill, index: number, arr: Skill[]) => {
      if (acc.find((w: Skill) => w.name === cur.name)) {
        return acc;
      }
      return [...acc, cur];
    },
    []
  );

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "weapons.json"),
    JSON.stringify(weaponsData)
  );
}

async function scrapAssists({ overwrite, showGot, showSkipped }: ScrapOptions) {
  const data: string = await downloadAsString(assistList);
  const $: CheerioStatic = load(data);
  const [, ...rows]: CheerioElement[] = $("table.sortable")
    .first()
    .find("tr")
    .toArray();

  const assists: Skill[] = rows.map(
    (element: CheerioElement, i: number): Skill => {
      const name: string | undefined = $(element)
        .find("td")
        .first()
        .find("a")
        .text();
      const sp: string | undefined = $($(element).find("td")[2]).text();
      if (name && sp) {
        const assistFromDb: Skill | undefined = assistDb.find(
          (a: Skill) => a.name === name
        );
        if (!assistFromDb || overwrite) {
          if (showGot) {
            console.log("Got assist:", name);
          }
          return {
            icon: "Icon_Skill_Assist.png",
            name,
            slot: Slot.Assist,
            sp: parseInt(sp),
          };
        }
        if (showSkipped) {
          console.log("Skipped assist:", name);
        }
        return assistFromDb;
      }
      throw new Error(`Error while getting ${name}`);
    }
  );

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "assists.json"),
    JSON.stringify(assists)
  );
}

async function scrapSpecials({
  overwrite,
  showGot,
  showSkipped,
}: ScrapOptions) {
  const data: string = await downloadAsString(specialList);
  const $: CheerioStatic = load(data);
  const [, ...rows]: CheerioElement[] = $("table.sortable")
    .first()
    .find("tr")
    .toArray();

  const specials: Skill[] = rows.map(
    (element: CheerioElement, i: number): Skill => {
      const name: string | undefined = $(element)
        .find("td")
        .first()
        .find("a")
        .text();
      const sp: string | undefined = $($(element).find("td")[2]).text();
      if (name && sp) {
        const specialFromDb: Skill | undefined = specialDb.find(
          (s: Skill) => s.name === name
        );
        if (!specialFromDb || overwrite) {
          if (showGot) {
            console.log("Got special:", name);
          }
          return {
            icon: "Icon_Skill_Special.png",
            name,
            slot: Slot.Special,
            sp: parseInt(sp),
          };
        }
        if (showSkipped) {
          console.log("Skipped special:", name);
        }
        return specialFromDb;
      }
      throw new Error(`Error while getting ${name}`);
    }
  );

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "specials.json"),
    JSON.stringify(specials)
  );
}

async function scrapPassives({
  overwrite,
  showGot,
  showSkipped,
}: ScrapOptions) {
  const data: string = await downloadAsString(passiveList);
  const $: CheerioStatic = load(data);
  const [a, b, c]: CheerioElement[] = $("table.sortable").toArray();

  async function scrapTable(
    table: CheerioElement,
    slot: Slot
  ): Promise<Skill[]> {
    const [, ...rows]: CheerioElement[] = $(table).find("tr").toArray();
    let skills: Skill[] = [];
    const allPassives: Skill[] = [...passiveADb, ...passiveBDb, ...passiveCDb];

    for (let i = 0; i < rows.length; i++) {
      const element: CheerioElement = rows[i];
      const name: string | undefined = $($(element).find("td")[1]).text();
      const description: string | undefined = $(
        $(element).find("td")[2]
      ).text();
      const sp: string | undefined = $($(element).find("td")[3]).text();
      const img: string | undefined = $(element)
        .find("td")
        .first()
        .find("img")
        .attr("src");
      let bstModifier: number | undefined;

      if (description && description.includes("in modes like Arena")) {
        const matches: RegExpExecArray | null = /treats unit's stats as (\d+)/.exec(
          description
        );
        if (matches && matches[1]) {
          bstModifier = parseInt(matches[1]);
        }
      }

      if (name && sp && img) {
        const passiveFromDb: Skill | undefined = allPassives.find(
          (p: Skill) => p.name === name
        );
        if (!passiveFromDb || overwrite) {
          await downloadAsFile(
            img,
            resolve(
              __dirname,
              "..",
              "public",
              "passives",
              `${sanitizeFilename(name)}.png`
            )
          );

          skills = [
            ...skills,
            {
              icon: `passives/${sanitizeFilename(name)}.png`,
              name,
              slot,
              sp: parseInt(sp),
              bstModifier,
            },
          ];
          if (showGot) {
            console.log("Got passive:", name);
          }
        } else {
          skills = [...skills, passiveFromDb];
          if (showSkipped) {
            console.log("Skipped passive:", name);
          }
        }
      }
    }

    return skills;
  }

  const aPassives: Skill[] = await scrapTable(a, Slot.A);
  const bPassives: Skill[] = await scrapTable(b, Slot.B);
  const cPassives: Skill[] = await scrapTable(c, Slot.C);

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "a-passives.json"),
    JSON.stringify(aPassives)
  );

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "b-passives.json"),
    JSON.stringify(bPassives)
  );

  writeFileSync(
    resolve(__dirname, "..", "src", "data", "c-passives.json"),
    JSON.stringify(cPassives)
  );
}

async function scrapSeals({ overwrite, showGot, showSkipped }: ScrapOptions) {
  const data: string = await downloadAsString(sealList);
  const $: CheerioStatic = load(data);
  const [, ...rows]: CheerioElement[] = $("table.sortable")
    .first()
    .find("tr")
    .toArray();
  let skills: Skill[] = [];

  for (let i = 0; i < rows.length; i++) {
    const element: CheerioElement = rows[i];
    const name: string | undefined = $($(element).find("td")[1]).text();
    const description: string | undefined = $($(element).find("td")[2]).text();
    const sp: string | undefined = $($(element).find("td")[3]).text();
    const img: string | undefined = $(element)
      .find("td")
      .first()
      .find("img")
      .attr("src");
    let bstModifier: number | undefined;

    if (description && description.includes("in modes like Arena")) {
      const matches: RegExpExecArray | null = /treats unit's stats as (\d+)/.exec(
        description
      );
      if (matches && matches[1]) {
        bstModifier = parseInt(matches[1]);
      }
    }

    if (name && sp && img) {
      const sealFromDb: Skill | undefined = sealDb.find(
        (s: Skill) => s.name === name
      );
      if (!sealFromDb || overwrite) {
        await downloadAsFile(
          img,
          resolve(
            __dirname,
            "..",
            "public",
            "passives",
            `${sanitizeFilename(name)}.png`
          )
        );

        skills = [
          ...skills,
          {
            icon: `passives/${sanitizeFilename(name)}.png`,
            name,
            slot: Slot.Seal,
            sp: parseInt(sp),
            bstModifier,
          },
        ];
        if (showGot) {
          console.log("Got seal:", name);
        }
      } else {
        skills = [...skills, sealFromDb];
        if (showSkipped) {
          console.log("Skipped seal:", name);
        }
      }
    }
  }

  writeFileSync(
    resolve(__dirname, "..", "src", "seals.json"),
    JSON.stringify(skills)
  );
}

interface ScrapOptions {
  overwrite: boolean;
  showSkipped: boolean;
  showGot: boolean;
}

async function run(
  { overwrite, showSkipped, showGot }: ScrapOptions = {
    overwrite: false,
    showSkipped: true,
    showGot: true,
  }
) {
  const toRun: Function[] = [
    scrapHeroes,
    scrapWeapons,
    scrapAssists,
    scrapSpecials,
    scrapPassives,
    scrapSeals,
  ];

  // ensure that data/assets directories exists
  const dataDir = resolve(__dirname, "..", "src", "data");
  const heroImagesDir = resolve(__dirname, "..", "public", "heroes");
  const passiveImagesDir = resolve(__dirname, "..", "public", "passives");
  const weaponTypeImagesDir = resolve(__dirname, "..", "public", "weapon-types");

  [dataDir, heroImagesDir, passiveImagesDir, weaponTypeImagesDir].forEach(
    (dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  );

  for (let i = 0; i < toRun.length; i++) {
    const task = toRun[i];
    try {
      await task({ overwrite, showSkipped, showGot });
    } catch (error) {
      console.error(error);
    }
  }
}

run();

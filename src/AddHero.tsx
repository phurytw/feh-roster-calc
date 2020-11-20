import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import heroList from "./data/heroes.json";
import { Hero } from "./types";

export interface AddHeroProps {
  addHero: (hero: Hero) => void;
}

export default function AddHero({ addHero }: AddHeroProps) {
  const [selected, setSelected]: [
    Hero,
    Dispatch<SetStateAction<Hero>>
  ] = useState(heroList[0]);

  const selectHero:
    | ((event: ChangeEvent<HTMLSelectElement>) => void)
    | undefined = (event: ChangeEvent<HTMLSelectElement>) => {
    const hero: Hero | undefined = heroList.find(
      (hero: Hero) => hero.name === event.target.value
    );
    if (hero) {
      setSelected(hero);
    }
  };

  const add: () => void = () => {
    addHero(selected);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <select name="heroes" onChange={selectHero}>
        {(heroList as Hero[]).map((hero: Hero) => {
          return (
            <option key={hero.name} value={hero.name}>
              {hero.name}
            </option>
          );
        })}
      </select>
      {selected && (
        <>
          <h2>{selected.name}</h2>
          <div>
            <img src={selected.icon} alt={selected.name} />
          </div>
          <button onClick={add}>Add</button>
        </>
      )}
    </div>
  );
}

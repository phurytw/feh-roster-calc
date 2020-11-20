import React, { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

import { Hero } from "./types";
import AddHero from "./AddHero";
import HeroCard from "./HeroCard";
import calculateScore, { calculateBst } from "./score";
import { v4 } from "uuid";

type SortOrder = "name" | "level" | "bst" | "score";

function App() {
  const savedHeroes: string | null = localStorage.getItem("heroes");
  const [heroes, setHeroes]: [
    Hero[],
    Dispatch<SetStateAction<Hero[]>>
  ] = useState<Hero[]>(savedHeroes ? JSON.parse(savedHeroes) : []);
  const [sortOrder, setSortOrder]: [
    SortOrder,
    Dispatch<SetStateAction<SortOrder>>
  ] = useState<SortOrder>("score");

  const updateHeroes: (heroes: Hero[]) => void = (heroes: Hero[]) => {
    setHeroes(heroes);
    localStorage.setItem("heroes", JSON.stringify(heroes));
  };

  const addHero: (hero: Hero) => void = (hero: Hero) => {
    updateHeroes([...heroes, { ...hero, id: v4() }]);
  };

  const changeSortOrder: (event: ChangeEvent<HTMLSelectElement>) => void = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value as SortOrder);
  };

  return (
    <div style={{ padding: "0 1em" }}>
      <h1>FEH Roster Calculator</h1>
      <AddHero addHero={addHero} />
      <div>
        Sort:{" "}
        <select name="sort" value={sortOrder} onChange={changeSortOrder}>
          <option value="name">Name</option>
          <option value="level">Level</option>
          <option value="bst">Base Stat Total</option>
          <option value="score">Arena Score</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fill, 300px)', gridAutoFlow: 'row' }}>
        {heroes
          .sort((a: Hero, b: Hero) => {
            switch (sortOrder) {
              case "name":
                if (b.name > a.name) {
                  return -1;
                }
                if (b.name < a.name) {
                  return 1;
                }
                return 0;
              case "level":
                return b.level + b.merges - a.level - a.merges;
              case "bst":
                return calculateBst(b) - calculateBst(a);
              case "score":
                return calculateScore(b) - calculateScore(a);
              default:
                return 0;
            }
          })
          .map((hero: Hero, i: number) => {
            return (
              <HeroCard
                key={hero.id}
                hero={hero}
                onChange={(newHero: Hero) => {
                  updateHeroes(
                    heroes.map((hero: Hero, index: number) => {
                      if (index === i) {
                        console.log("UPDATE");

                        return newHero;
                      }
                      return hero;
                    })
                  );
                }}
                onDelete={() => {
                  updateHeroes(
                    heroes.filter((h: Hero, index: number) => index !== i)
                  );
                }}
              />
            );
          })}
      </div>
    </div>
  );
}

export default App;

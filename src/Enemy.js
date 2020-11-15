import { cards } from "./Card.js"

const enemies = {
  enemy1: {
    name: "Bob",
    hp: 20,
    deck: [
      cards.poke,
      cards.heal,
    ],
    characters_per_second: 4,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 60,
      std: 5
    }
  },
}

export {
  enemies
}

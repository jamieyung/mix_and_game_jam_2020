import { cards } from "./Card.js"

const enemies = {
  enemy1: {
    hp: 10,
    deck: [
      cards.poke,
      cards.heal
    ],
    characters_per_second: 6,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 60,
      std: 5
    }
  }
}

export {
  enemies
}

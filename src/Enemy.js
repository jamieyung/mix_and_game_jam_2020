import { cards } from "./Card.js"

const enemies = {
  troll: {
    id: "troll",
    name: "Troll",
    hp: 10,
    deck: [
      // cards.poke,
      // cards.heal,
      cards.harden,
      cards.mud,
    ],
    characters_per_second: 4,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 60,
      std: 5
    }
  },
  bull: {
    id: "bull",
    name: "Bull",
    hp: 10,
    deck: [
      cards.poke,
      cards.heal,
      // cards.harden,
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

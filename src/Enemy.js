import { cards } from "./Card.js"

const enemies = {
  troll: {
    id: "troll",
    name: "Internet Troll",
    hp: 8,
    deck: [
      cards.poke,
      cards.heal,
      // cards.harden,
      // cards.mud,
    ],
    characters_per_second: 3,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 50,
      std: 7
    }
  },
  bull: {
    id: "bull",
    name: "Charging Bull",
    hp: 10,
    deck: [
      cards.ram,
      cards.berserk
      // cards.harden,
    ],
    characters_per_second: 4,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 55,
      std: 5
    }
  },
  hippo: {
    id: "hippo",
    name: "Grumpy Hippo",
    hp: 16,
    deck: [
      cards.mud,
      cards.harden,
      cards.crunch
    ],
    characters_per_second: 2,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 80,
      std: 5
    }
  },
  cobra: {
    id: "cobra",
    name: "Vicious Cobra",
    hp: 12,
    deck: [
      cards.leech,
      cards.bite
    ],
    characters_per_second: 3,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 80,
      std: 5
    }
  },
  bookworm: {
    id: "bookworm",
    name: "Arcane Bookworm",
    hp: 14,
    deck: [
      cards.succinct,
      cards.verbosify,
      cards.lifesteal,
      cards.replenish
    ],
    characters_per_second: 7,
    casting_cooldown_ms: 500,
    n_characters_between_mistakes: {
      avg: 100,
      std: 5
    }
  },

}

export {
  enemies
}

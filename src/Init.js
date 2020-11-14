import mkCard from "./Card.js"

var scene = new Phaser.Scene({ key: "Init" })

scene.init = function(input) {
  console.log("Init", input)
}

scene.update = function() {
  scene.scene.start("Battle", {
    player: {
      max_hp: 10,
      hp: 10,
      deck: [
        mkCard(),
        mkCard(),
        mkCard(),
        mkCard(),
        mkCard(),
        mkCard(),
      ],
      gold: 0, // TODO
      ult: {}, // TODO
      inventory: {} // TODO
    },
    enemy: {
      hp: 10,
      deck: [],
      cps: 6
    }
  })
}

export default scene

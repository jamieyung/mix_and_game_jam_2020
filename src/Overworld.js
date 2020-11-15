import { cards } from "./Card.js"
import { enemies } from "./Enemy.js"
import { NodeContentsType, floors } from "./Floor.js"

var scene = new Phaser.Scene({ key: "Overworld" })

var $ = {}

scene.init = function(input) {
  console.log("Overworld", input)
  $ = {
    floor: floors[input.floorId],
    node_objects: {},
    edge_objects: [],
    nodes_and_edges_layer: scene.add.container(0, 0),
    enemies_layer: scene.add.container(0, 0),
    player: {
      nodeId: 0, // initialised below
      obj: null // initialised below
    },
    enemies: []
  }

  $.enter = scene.input.keyboard.addKey("ENTER", true)

  // Render floor
  for (var edge of $.floor.edges) {
    var u = $.floor.nodes[edge[0]]
    var v = $.floor.nodes[edge[1]]
    var line = scene.add.line(0, 0, u.x, u.y, v.x, v.y, 0x805920).setOrigin(0, 0)
    $.nodes_and_edges_layer.add(line)
    $.edge_objects.push(line)
  }
  for (var i = 0; i < $.floor.nodes.length; i++) {
    var node = $.floor.nodes[i]
    var g = scene.add.circle(node.x, node.y, 40, 0x805920)
    $.nodes_and_edges_layer.add(g)
    $.node_objects[i] = g

    if (node.contents.type === NodeContentsType.PLAYER) {
      $.player.nodeId = i
      $.player.obj = scene.add.text(node.x, node.y, "P")
    } else if (node.contents.type === NodeContentsType.ENEMY) {
      var enemy = enemies[node.contents.enemyId]
      var enemy_obj = scene.add.text(node.x, node.y, enemy.name)
      $.enemies_layer.add(enemy_obj)
      $.enemies.push({
        enemy: enemy,
        obj: enemy_obj
      })
    }
  }
}

scene.update = function() {
  if ($.enter.isDown) {
    scene.scene.start("Battle", {
      player: {
        max_hp: 20,
        hp: 15,
        deck: [
          cards.hit,
          cards.heal
        ],
        gold: 0, // TODO
        ult: {}, // TODO
        inventory: {} // TODO
      },
      enemy: enemies.enemy1
    })
  }
}

export default scene

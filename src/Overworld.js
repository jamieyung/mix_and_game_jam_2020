import { cards } from "./Card.js"
import { enemies } from "./Enemy.js"
import { NodeContentsType, floors } from "./Floor.js"

const scene = new Phaser.Scene({ key: "Overworld" })

let $ = {}

scene.create = function(input) {
  console.log("Overworld", input)
  $ = {
    floor: floors[input.floorId],
    node_objects: {},
    edge_objects: [],
    adjacency_map: {}, // initialised below
    nodes_and_edges_layer: scene.add.container(0, 0),
    enemies_layer: scene.add.container(0, 0),
    player: {
      nodeId: 0, // initialised below
      obj: null // initialised below
    },
    enemies: []
  }

  $.enter = scene.input.keyboard.addKey("ENTER", true)

  // Render edges
  for (let edge of $.floor.edges) {
    const uid = edge[0]
    const vid = edge[1]
    const u = $.floor.nodes[uid]
    const v = $.floor.nodes[vid]
    const line = scene.add.line(0, 0, u.x, u.y, v.x, v.y, 0x805920).setOrigin(0, 0)
    $.nodes_and_edges_layer.add(line)
    $.edge_objects.push(line)

    // populate adjacency_map
    if (!$.adjacency_map[uid]) $.adjacency_map[uid] = []
    if (!$.adjacency_map[vid]) $.adjacency_map[vid] = []
    if ($.adjacency_map[uid].indexOf(vid) === -1) $.adjacency_map[uid].push(vid)
    if ($.adjacency_map[vid].indexOf(uid) === -1) $.adjacency_map[vid].push(uid)
  }

  // Render nodes and node contents
  for (let i = 0; i < $.floor.nodes.length; i++) {
    const node = $.floor.nodes[i]
    const circle = scene.add.circle(node.x, node.y, 30, 0x805920)
    circle.setInteractive()
    circle.on("pointerdown", function() {
      console.log(node)
    })
    $.nodes_and_edges_layer.add(circle)
    $.node_objects[i] = circle

    if (node.contents.type === NodeContentsType.PLAYER) {
      $.player.nodeId = i
      $.player.obj = scene.add.text(node.x, node.y, "P")
    } else if (node.contents.type === NodeContentsType.ENEMY) {
      const enemy = enemies[node.contents.enemyId]
      const enemy_obj = scene.add.text(node.x, node.y, enemy.name)
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

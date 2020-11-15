import { enemies } from "./Enemy.js"
import { NodeContentsType, floors } from "./Floor.js"

const scene = new Phaser.Scene({ key: "Overworld" })

let $ = {}

// input.floor
// input.player.max_hp
// input.player.hp
// input.player.deck - an array of Cards
// input.player.gold TODO
// input.player.ult TODO
// input.player.inventory TODO
scene.create = function(input) {
  console.log("Overworld", input)
  const floor = JSON.parse(JSON.stringify(input.floor)) // deep copy
  $ = {
    floor: floor,
    player: input.player,
    node_objects: {},
    edge_objects: [],
    adj: {}, // adjacency list, initialised below
    nodes_and_edges_layer: scene.add.container(0, 0),
    node_contents_layer: scene.add.container(0, 0),
    player_overworld_info: {
      nodeId: floor.playerStartNodeId,
      obj: null // initialised below
    },
    enemies: []
  }

  // Render edges
  for (let edge of $.floor.edges) {
    const uid = edge[0]
    const vid = edge[1]
    const u = $.floor.nodes[uid]
    const v = $.floor.nodes[vid]
    const line = scene.add.line(0, 0, u.x, u.y, v.x, v.y, 0x805920).setOrigin(0, 0)
    $.nodes_and_edges_layer.add(line)
    $.edge_objects.push(line)

    // populate adj
    if (!$.adj[uid]) $.adj[uid] = []
    if (!$.adj[vid]) $.adj[vid] = []
    if ($.adj[uid].indexOf(vid) === -1) $.adj[uid].push(vid)
    if ($.adj[vid].indexOf(uid) === -1) $.adj[vid].push(uid)
  }

  // Render nodes and node contents
  for (let i = 0; i < $.floor.nodes.length; i++) {
    const node = $.floor.nodes[i]
    const circle = scene.add.circle(node.x, node.y, 30, 0x805920)
    circle.setInteractive()
    circle.on("pointerup", function() {
      const path = bfs(0, i)
      if (path) {
        $.player_overworld_info.nodeId = i
        $.player_overworld_info.obj.x = node.x
        $.player_overworld_info.obj.y = node.y
        handlePlayerArrivedAtNode(node)
      }
    })
    $.nodes_and_edges_layer.add(circle)
    $.node_objects[i] = circle

    if (node.contents.type === NodeContentsType.NONE) {
      // do nothing
    } else if (node.contents.type === NodeContentsType.ENEMY) {
      const enemy = enemies[node.contents.enemyId]
      const enemy_obj = scene.add.text(node.x, node.y, enemy.name)
      $.node_contents_layer.add(enemy_obj)
      $.enemies.push({
        enemy: enemy,
        obj: enemy_obj
      })
    } else if (node.contents.type === NodeContentsType.EXIT) {
      const exit_obj = scene.add.text(node.x, node.y, "E")
      $.node_contents_layer.add(exit_obj)
    } else {
      console.log("Overworld create function: Unhandled NodeContentsType case:", node.contents.type)
    }
  }

  // Render player
  const playerStartNode = floor.nodes[floor.playerStartNodeId]
  $.player_overworld_info.obj = scene.add.text(playerStartNode.x, playerStartNode.y, "P")
}

function handlePlayerArrivedAtNode(node) {
  if (node.contents.type === NodeContentsType.NONE) {
    // do nothing
  } else if (node.contents.type === NodeContentsType.ENEMY) {
    scene.scene.start("Battle", {
      player: $.player,
      enemy: enemies[node.contents.enemyId],
      floor: JSON.parse(JSON.stringify($.floor)), // deep copy
      playerNodeId: $.player_overworld_info.nodeId
    })
  } else if (node.contents.type === NodeContentsType.EXIT) {
    var floor = floors[node.contents.targetFloorIdx]
    scene.scene.start("Overworld", {
      floor: JSON.parse(JSON.stringify(floor)), // deep copy
      player: $.player
    })
  } else {
    console.log("Overworld handlePlayerArrivedAtNode function: Unhandled NodeContentsType case:", node.contents.type)
  }
}

// u and v are node ids.
// null as a return value means no valid path was found.
function bfs(u, v) {
  const prev = {}
  const visited = {}
  const queue = []
  queue.push(u)

  while (queue.length > 0) {
    const cur = queue.shift()
    visited[cur] = true

    if (cur === v) {
      const path = []
      let tmp = v
      while (tmp !== u) {
        path.unshift(tmp)
        tmp = prev[tmp]
      }
      return path
    }

    // disallow progressing past nodes with enemies on them (must defeat the enemy first)
    if ($.floor.nodes[cur].contents.type === NodeContentsType.ENEMY) continue

    for (let child of $.adj[cur]) {
      if (visited[child]) continue
      prev[child] = cur
      queue.push(child)
    }
  }

  return null
}

scene.update = function() {
}

export default scene

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
// input.difficulty.word_length.avg
// input.difficulty.word_length.std
scene.create = function(input) {
  console.log("Overworld", input)

  scene.sound.pauseOnBlur = false

  const floor = JSON.parse(JSON.stringify(input.floor)) // deep copy
  $ = {
    floor: floor,
    player: input.player,
    difficulty: input.difficulty,
    node_objects: {},
    edge_objects: [],
    adj: {}, // adjacency list, initialised below
    nodes_and_edges_layer: scene.add.container(0, 0),
    node_contents_layer: scene.add.container(0, 0),
    target_node_keys_layer: scene.add.container(0, 0),
    nodeid_to_char: {}, // initialised below
    target_node_keys: [],
    player_overworld_info: {
      nodeId: floor.playerStartNodeId,
      obj: null // initialised below
    },
    music: scene.sound.add("overworld_loop", { volume: 0.4, loop: true }),
    enemies: [],
  }

  // Init edges
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

  // Init nodes and node contents
  let availableKeys = "FJDKSLAHGQWERTYUIOPZXCVBNM"
  for (let nodeId = 0; nodeId < $.floor.nodes.length; nodeId++) {
    $.nodeid_to_char[nodeId] = availableKeys[0]
    availableKeys = availableKeys.substring(1)
    const node = $.floor.nodes[nodeId]
    const circle = scene.add.circle(node.x, node.y, 100, 0x805920)
    circle.setScale(1, 0.5)
    circle.setInteractive()
    circle.on("pointerup", function() {
      tryTravelToNode(nodeId)
    })
    $.nodes_and_edges_layer.add(circle)
    $.node_objects[nodeId] = circle

    if (node.contents.type === NodeContentsType.NONE) {
      // do nothing
    } else if (node.contents.type === NodeContentsType.ENEMY) {
      const enemy_sprite_obj = scene.add.image(node.x, node.y + 5, node.contents.enemyId)
      enemy_sprite_obj.setOrigin(0.5, 0.88)
      enemy_sprite_obj.setScale(0.08)
      $.node_contents_layer.add(enemy_sprite_obj)
    }

    else if (node.contents.type === NodeContentsType.EXIT) {
      const exit_obj = scene.add.image(node.x, node.y, "exit")
      exit_obj.setOrigin(0.5, 0.55)
      exit_obj.setScale(0.05)
      $.node_contents_layer.add(exit_obj)
    }

    else {
      console.log("Overworld create function: Unhandled NodeContentsType case:", node.contents.type)
    }
  }

  // Render player
  const playerStartNode = floor.nodes[floor.playerStartNodeId]
  $.player_overworld_info.obj = scene.add.image(playerStartNode.x, playerStartNode.y + 5, "hero_front")
  $.player_overworld_info.obj.setOrigin(0.47, 0.95)
  $.player_overworld_info.obj.setScale(0.09)

  refreshTargetNodeKeys()

  const hint = scene.add.bitmapText(400, 580, "monoid", "Type to move").setOrigin(0.5)
  hint.setTint(0xe0d728)
  hint.setFontSize(20)

  $.music.play({ volume: 0.4, loop: true })
}

function tryTravelToNode(nodeId) {
  const path = bfs($.player_overworld_info.nodeId, nodeId)
  if (path) {
    const node = $.floor.nodes[nodeId]
    $.player_overworld_info.nodeId = nodeId
    $.player_overworld_info.obj.x = node.x
    $.player_overworld_info.obj.y = node.y
    handlePlayerArrivedAtNode(node)
  }
}

function handlePlayerArrivedAtNode(node) {
  refreshTargetNodeKeys()

  if (node.contents.type === NodeContentsType.NONE) {
    // do nothing
  } else if (node.contents.type === NodeContentsType.ENEMY) {
    cleanup()
    scene.scene.start("Battle", {
      player: $.player,
      enemy: enemies[node.contents.enemyId],
      floor: JSON.parse(JSON.stringify($.floor)), // deep copy
      playerNodeId: $.player_overworld_info.nodeId,
      difficulty: $.difficulty,
    })
  } else if (node.contents.type === NodeContentsType.EXIT) {
    const floor = floors[node.contents.targetFloorIdx]
    cleanup()
    scene.scene.start("Overworld", {
      floor: JSON.parse(JSON.stringify(floor)), // deep copy
      player: $.player,
      difficulty: $.difficulty,
    })
  } else {
    console.log("Overworld handlePlayerArrivedAtNode function: Unhandled NodeContentsType case:", node.contents.type)
  }
}

function refreshTargetNodeKeys() {
  $.target_node_keys_layer.removeAll(true) // destroy all children
  for (let x of $.target_node_keys) {
    x.key_listener.destroy()
  }
  $.target_node_keys = []

  const curNodeId = $.player_overworld_info.nodeId
  const reachableNodes = calcReachableNodes(curNodeId)
  for (let nodeId of reachableNodes) {
    const c = $.nodeid_to_char[nodeId]
    const key_listener = scene.input.keyboard.addKey(c, true)
    key_listener.on("down", function() {
      tryTravelToNode(nodeId)
    })
    const node = $.floor.nodes[nodeId]
    const text_obj = scene.add.bitmapText(node.x, node.y + 65, "monoid", c)
    text_obj.setFontSize(20).setOrigin(0.5, 0.5)
    text_obj.setTint(0xe0d728)
    $.target_node_keys_layer.add(text_obj)
    $.target_node_keys.push({
      key_listener: key_listener,
      text_obj: text_obj,
      node: node
    })
  }
}

// u and v are node ids.
// null as a return value means no valid path was found.
function bfs(u, v) {
  const prev = {}
  const visited = {}
  const queue = [u]

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

    if (!canProgressPastNode(cur)) continue

    for (let child of $.adj[cur]) {
      if (visited[child]) continue
      prev[child] = cur
      queue.push(child)
    }
  }

  return null
}

// returned node ids don't include src node
function calcReachableNodes(src) {
  const ret = []
  const visited = {}
  const queue = [src]

  while (queue.length > 0) {
    const cur = queue.shift()
    visited[cur] = true
    if (cur !== src) ret.push(cur)

    if (!canProgressPastNode(cur)) continue

    for (let child of $.adj[cur]) {
      if (visited[child]) continue
      queue.push(child)
    }
  }

  return ret
}

function canProgressPastNode(nodeId) {
  const node = $.floor.nodes[nodeId]

  // disallow progressing past nodes with enemies on them (must defeat the enemy first)
  if (node.contents.type === NodeContentsType.ENEMY) return false

  return true
}

scene.update = function() {
}

// in order of add calls in create function
function cleanup() {
  $.nodes_and_edges_layer.removeAll(true) // destroy all children
  $.nodes_and_edges_layer.destroy()
  $.node_contents_layer.removeAll(true) // destroy all children
  $.node_contents_layer.destroy()
  $.target_node_keys_layer.removeAll(true) // destroy all children
  $.target_node_keys_layer.destroy()
  $.player_overworld_info.obj.destroy()
  $.music.destroy()
  for (let x of $.target_node_keys) {
    x.key_listener.destroy()
  }
}

export default scene

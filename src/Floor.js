const NodeContentsType = {
  NONE: 0,
  PLAYER: 1,
  ENEMY: 2
}

const floors = [
  { nodes:
      [ { x: 100, y: 300, contents: { type: NodeContentsType.PLAYER } }
      , { x: 250, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 300, contents: { type: NodeContentsType.ENEMY, enemyId: "enemy1" } }
      ]
  , edges:
      [ [0, 1]
      , [1, 2]
      ]
  }
]

export {
  NodeContentsType,
  floors
}

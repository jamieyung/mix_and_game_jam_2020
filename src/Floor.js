const NodeContentsType = {
  NONE: 0,
  PLAYER: 1,
  ENEMY: 2
}

const floors = [
  { nodes:
      [ { x: 100, y: 300, contents: { type: NodeContentsType.PLAYER } }
      , { x: 250, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 200, contents: { type: NodeContentsType.ENEMY, enemyId: "enemy1" } }
      , { x: 450, y: 400, contents: { type: NodeContentsType.ENEMY, enemyId: "enemy1" } }
      , { x: 600, y: 300, contents: { type: NodeContentsType.ENEMY, enemyId: "enemy1" } }
      ]
  , edges:
      [ [0, 1]
      , [1, 2]
      , [1, 3]
      , [2, 4]
      , [3, 4]
      ]
  }
]

export {
  NodeContentsType,
  floors
}

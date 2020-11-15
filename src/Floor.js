const NodeContentsType = {
  NONE: 0,
  ENEMY: 1
}

const floors = [
  { nodes:
      [ { id: 0, x: 100, y: 300, contents: { type: NodeContentsType.NONE } }
      , { id: 1, x: 200, y: 300, contents: { type: NodeContentsType.ENEMY, enemyId: "enemy1" } }
      ]
  , edges:
      [ [0, 1]
      ]
  }
]

export {
  floors
}

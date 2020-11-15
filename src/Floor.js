const NodeContentsType = {
  NONE: 0,
  ENEMY: 1,
  EXIT: 2
}

const floors = [
  { nodes:
      [ { x: 100, y: 500, contents: { type: NodeContentsType.NONE } }
      , { x: 250, y: 350, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 450, contents: { type: NodeContentsType.ENEMY, enemyId: "troll" } }
      , { x: 600, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 200, contents: { type: NodeContentsType.ENEMY, enemyId: "bull" } }
      , { x: 630, y: 80, contents: { type: NodeContentsType.NONE } }
      , { x: 250, y: 150, contents: { type: NodeContentsType.EXIT, targetFloorIdx: 1 } }
      ]
  , edges:
      [ [0, 1]
      , [1, 2]
      , [2, 3]
      , [2, 4]
      , [4, 5]
      , [4, 6]
      ]
  , playerStartNodeId: 0
  },
  { nodes:
      [ { x: 100, y: 500, contents: { type: NodeContentsType.NONE } }
      , { x: 250, y: 350, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 450, contents: { type: NodeContentsType.ENEMY, enemyId: "cobra" } }
      , { x: 600, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 450, y: 200, contents: { type: NodeContentsType.ENEMY, enemyId: "hippo" } }
      , { x: 630, y: 80, contents: { type: NodeContentsType.NONE } }
      , { x: 250, y: 150, contents: { type: NodeContentsType.EXIT, targetFloorIdx: 2 } }
      ]
  , edges:
      [ [0, 1]
      , [1, 2]
      , [2, 3]
      , [2, 4]
      , [4, 5]
      , [4, 6]
      ]
  , playerStartNodeId: 0
  },
  { nodes:
      [ { x: 100, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 400, y: 300, contents: { type: NodeContentsType.NONE } }
      , { x: 700, y: 300, contents: { type: NodeContentsType.ENEMY, enemyId: "bookworm" } }
      ]
  , edges:
      [ [0, 1]
      , [1, 2]
      ]
  , playerStartNodeId: 0
  },
]

export {
  NodeContentsType,
  floors
}

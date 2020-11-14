export default function () {
  return {
    id: 0,
    name: "Hit",
    cost: Phaser.Math.RND.integerInRange(1, 3),
    target: "enemy",
    damage: Phaser.Math.RND.integerInRange(1, 5)
  }
}

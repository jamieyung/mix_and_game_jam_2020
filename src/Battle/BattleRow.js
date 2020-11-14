var words = ["Adult","Aeroplane","Air","Airforce","Airport","Album","Alphabet","Apple","Arm","Army","Baby","Backpack","Balloon","Banana","Bank","Barbecue","Bathroom","Bathtub","Bed","Bee","Bird","Bomb","Book","Boss","Bottle","Bowl","Box","Boy","Brain","Bridge","Butterfly","Button","Cappuccino","Car","Carpet","Carrot","Cave","Chair","Chess","Chief","Child","Chisel","Chocolates","Church","Church","Circle","Circus","Circus","Clock","Clown","Coffee","Comet","Compact","Compass","Computer","Crystal","Cup","Cycle","Database","Desk","Diamond","Dress","Drill","Drink","Drum","Dung","Ears","Earth","Egg","Electricity","Elephant","Eraser","Explosive","Eyes","Family","Fan","Feather","Festival","Film","Finger","Fire","Floodlight","Flower","Foot","Fork","Freeway","Fruit","Fungus","Game","Garden","Gas","Gate","Gemstone","Girl","Gloves","God","Grapes","Guitar","Hammer","Hat","Hieroglyph","Highway","Horoscope","Horse","Hose","Ice","Insect","Jet","Junk","Kaleidoscope","Kitchen","Knife","Leather","Leg","Library","Liquid","Magnet","Man","Map","Maze","Meat","Meteor","Microscope","Milk","Milkshake","Mist","Money","Monster","Mosquito","Mouth","Nail","Navy","Necklace","Needle","Onion","PaintBrush","Pants","Parachute","Passport","Pebble","Pendulum","Pepper","Perfume","Pillow","Plane","Planet","Pocket","Post","Potato","Printer","Prison","Pyramid","Radar","Rainbow","Record","Restaurant","Rifle","Ring","Robot","Rock","Rocket","Roof","Room","Rope","Saddle","Salt","Sandpaper","Sandwich","Satellite","School","Sex","Ship","Shoes","Shop","Shower","Signature","Skeleton","Snail","Software","Solid","Space","Spectrum","Sphere","Spice","Spiral","Spoon","Sports","Spot","Square","Staircase","Star","Stomach","Sun","Sunglasses","Surveyor","Swimming","Sword","Table","Tapestry","Teeth","Telescope","Television","Tennis","Thermometer","Tiger","Toilet","Tongue","Torch","Torpedo","Train","Treadmill","Triangle","Tunnel","Typewriter","Umbrella","Vacuum","Vampire","Videotape","Vulture","Water","Weapon","Web","Wheelchair","Window","Woman","Worm"]

// args.forbidden_initial_characters - array of characters (case-insensitive)
// args.card - the card from the deck
// args.scene - the scene
export default function (args) {
  var orig_text
  for (let j = 0; j < 50; j++) {
    orig_text = Phaser.Math.RND.pick(words)
    var conflict_found = false
    var initial_character = orig_text[0].toUpperCase()
    for (var c of args.forbidden_initial_characters) {
      if (c.toUpperCase() === initial_character) {
        conflict_found = true
        break
      }
    }
    if (!conflict_found) break
  }
  var root = args.scene.add.container(0, 0)

  var card_name_text_obj = args.scene.add.text(0, 0, args.card.name)
  card_name_text_obj.setFontSize(20)
  root.add(card_name_text_obj)

  var text_obj = args.scene.add.text(0, 15, orig_text)
  text_obj.setFontSize(40)
  root.add(text_obj)

  return {
    orig_text: orig_text,
    remaining: orig_text,
    card: args.card,
    root: root,
    text_obj: text_obj,
    destroy: function () {
      card_name_text_obj.destroy()
      text_obj.destroy()
      root.destroy()
    }
  }
}

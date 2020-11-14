var scene = new Phaser.Scene({ key: "Battle" })

var words = ["Adult","Aeroplane","Air","Airforce","Airport","Album","Alphabet","Apple","Arm","Army","Baby","Backpack","Balloon","Banana","Bank","Barbecue","Bathroom","Bathtub","Bed","Bee","Bird","Bomb","Book","Boss","Bottle","Bowl","Box","Boy","Brain","Bridge","Butterfly","Button","Cappuccino","Car","Carpet","Carrot","Cave","Chair","Chess","Chief","Child","Chisel","Chocolates","Church","Church","Circle","Circus","Circus","Clock","Clown","Coffee","Comet","Compact","Compass","Computer","Crystal","Cup","Cycle","Database","Desk","Diamond","Dress","Drill","Drink","Drum","Dung","Ears","Earth","Egg","Electricity","Elephant","Eraser","Explosive","Eyes","Family","Fan","Feather","Festival","Film","Finger","Fire","Floodlight","Flower","Foot","Fork","Freeway","Fruit","Fungus","Game","Garden","Gas","Gate","Gemstone","Girl","Gloves","God","Grapes","Guitar","Hammer","Hat","Hieroglyph","Highway","Horoscope","Horse","Hose","Ice","Insect","Jet","Junk","Kaleidoscope","Kitchen","Knife","Leather","Leg","Library","Liquid","Magnet","Man","Map","Maze","Meat","Meteor","Microscope","Milk","Milkshake","Mist","Money","Monster","Mosquito","Mouth","Nail","Navy","Necklace","Needle","Onion","PaintBrush","Pants","Parachute","Passport","Pebble","Pendulum","Pepper","Perfume","Pillow","Plane","Planet","Pocket","Post","Potato","Printer","Prison","Pyramid","Radar","Rainbow","Record","Restaurant","Rifle","Ring","Robot","Rock","Rocket","Roof","Room","Rope","Saddle","Salt","Sandpaper","Sandwich","Satellite","School","Sex","Ship","Shoes","Shop","Shower","Signature","Skeleton","Snail","Software","Solid","Space","Spectrum","Sphere","Spice","Spiral","Spoon","Sports","Spot","Square","Staircase","Star","Stomach","Sun","Sunglasses","Surveyor","Swimming","Sword","Table","Tapestry","Teeth","Telescope","Television","Tennis","Thermometer","Tiger","Toilet","Tongue","Torch","Torpedo","Train","Treadmill","Triangle","Tunnel","Typewriter","Umbrella","Vacuum","Vampire","Videotape","Vulture","Water","Weapon","Web","Wheelchair","Window","Woman","Worm"]

var $ = {}

// Input
//
// Player stats (HP, Deck, Gold, Ult meter, Inventory, Which character you are)
// Enemy stats (HP, Deck, Which character they are)

scene.init = function(input) {
  console.log("Battle", input)

  $ = {
    cards: [],
    current_card: undefined,
    keys: [],
    down_keys: {}
  }

  // init cards
  // TODO deal with words having the same starting character (prevent)
  for (let i = 0; i < 6; i++) {
    var orig_text = Phaser.Math.RND.pick(words)
    var text_obj = scene.add.text(100, 100 + i*40, orig_text)
    text_obj.setFontSize(40)
    $.cards.push({
      orig: orig_text,
      remaining: orig_text,
      text_obj: text_obj
    })
  }

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))
}

scene.update = function() {
  // Handle keyup events
  for (const [keyCode, key] of Object.entries($.down_keys)) {
    if (key.isDown) continue
    delete $.down_keys[keyCode]
  }

  // Handle keydown events
  for (var key of $.keys) {
    var keyCode = key.keyCode
    if (keyCode in $.down_keys) continue
    if (!key.isDown) continue
    console.log(String.fromCharCode(keyCode))
    $.down_keys[keyCode] = key

    if ($.current_card) {
      var nextKeyCode = $.current_card.remaining[0].toUpperCase().charCodeAt(0)
      if (nextKeyCode === keyCode) {
        $.current_card.remaining = $.current_card.remaining.substring(1)
        $.current_card.text_obj.text = $.current_card.remaining
        if ($.current_card.remaining.length === 0) {
          // regenerate card
          var orig_text = Phaser.Math.RND.pick(words)
          $.current_card.orig = orig_text
          $.current_card.remaining = orig_text
          $.current_card.text_obj.text = orig_text
          $.current_card.text_obj.setColor("#ffffff")
          $.current_card = undefined
        }
      } else {
        // regenerate card
        var orig_text = Phaser.Math.RND.pick(words)
        $.current_card.orig = orig_text
        $.current_card.remaining = orig_text
        $.current_card.text_obj.text = orig_text
        $.current_card.text_obj.setColor("#ffffff")
        $.current_card = undefined
      }
    } else {
      // no current card, try find one
      for (var card of $.cards) {
        if (card.remaining.length === 0) continue
        var nextKeyCode = card.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        card.remaining = card.remaining.substring(1)
        card.text_obj.text = card.remaining
        $.current_card = card
        card.text_obj.setColor("#55ff55")
        break
      }
    }
  }
}

export default scene

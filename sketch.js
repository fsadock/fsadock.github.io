var vehicles = [];
var food = [];
var poison = [];

var foodNutrition = 0.5;
var poisonNutrition = -0.75;

var debug;

function setup() {
  createCanvas(640, 360);

  debug = createCheckbox();

  for (var i = 0; i < 100; i++) {
    var x = random(width);
    var y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }
  for (var i = 0; i < 100; i++) {
    food.push(createVector(random(width), random(height)))
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y))
  }
}


function draw() {
  background(51);

  addStuff(food, 0.045)
  addStuff(poison, 0.01)
  removeStuff(food, 0.005)
  removeStuff(poison, 0.0075)

  drawStuff(food, color(0, 255, 0))
  drawStuff(poison, color(255, 0, 0))


  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviors(food, poison);
    vehicles[i].update();
    vehicles[i].display();

    var child = vehicles[i].clone(0.0015);
    if (child != null) {
      vehicles.push(child);
    }

    if (vehicles[i].dead()) {
      var x = vehicles[i].position.x;
      var y = vehicles[i].position.y;
      food.push(createVector(x,y));
      vehicles.splice(i, 1);
    }
  }
}

var addStuff = function(stuff, prob) {
  var x = random(width);
  var y = random(height);
  if (random(1) < prob) {
    stuff.push(createVector(x, y));
  }
}

var removeStuff = function(stuff, prob) {
  var x = random(width);
  var y = random(height);
  if (random(1) < prob) {
    stuff.pop();
  }
}

var drawStuff = function(stuff, color, size = 8) {
  for (var i = 0; i < stuff.length; i++) {
    fill(color);
    noStroke();
    ellipse(stuff[i].x, stuff[i].y, size, size)
  }
}
/*var target = createVector(mouseX, mouseY);
fill(127);
stroke(200);
strokeWeight(2);
ellipse(target.x, target.y, 48, 48);*/

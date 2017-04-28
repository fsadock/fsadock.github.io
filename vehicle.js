var mutationRate = 0.1;

function Vehicle(x, y, dna) {
  this.acceleration = createVector(0, 0);
  var vel = random(-2,2)
  this.velocity = createVector(vel, vel);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 2;
  this.maxforce = 0.1;


  this.health = 1;

  this.dna = [];
  if (dna === undefined) {
    // Food Weight
    this.dna[0] = random(-5, 5);
    // Poison Weight
    this.dna[1] = random(-5, 5);
    // Food Perception
    this.dna[2] = random(0, 100);
    // Poison Perception
    this.dna[3] = random(0, 100);
  } else {
    this.dna[0] = dna[0];
    if(random(1)<mutationRate){
      this.dna[0]+=random(-5,5)
    }
    // Poison Weight
    this.dna[1] = dna[1]
    if(random(1)<mutationRate){
      this.dna[1]+=random(-5,5)
    }
    // Food Perception
    this.dna[2] = dna[2]
    if(random(1)<mutationRate){
      this.dna[2]+=random(-30,30)
    }
    // Poison Perception
    this.dna[3] = dna[3]
    if(random(1)<mutationRate){
      this.dna[3]+=random(-30,30)
    }
  }

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.seek = function(target) {

    var desired = p5.Vector.sub(target, this.position);

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    // this.applyForce(steer);
  }

  this.eat = function(list, nutrition, perception) {
    var record = Infinity;
    var closest = -1;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      }

      if (d < record && d < perception) {
        record = d;
        closest = i;
      }
    }
    if (record < 5) {
      list.splice(closest, 1);
      this.health += nutrition;
    } else if (closest > -1) {
      return this.seek(list[closest]);
    }
    return createVector(0, 0);
  }
  // A method that calculates a steering force
  // STEER = DESIRED MINUS VELOCITY

  this.behaviors = function(good, bad) {
    var steerG = this.eat(good, foodNutrition, this.dna[2]);
    var steerB = this.eat(bad, poisonNutrition, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  this.dead = function() {
    return (this.health < 0)
  }

  this.display = function() {

    this.health -= 0.0059;
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(1);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(1);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);


    // stroke(gr);
    // line(0, 0, 0, this.dna[0] * -10);
    // noFill();
    // ellipse(0, 0, this.dna[2] * 2);
    // stroke(rd);
    // line(0, 0, 0, this.dna[1] * -10);
    // ellipse(0, 0, this.dna[3] * 2);



    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }

  this.boundaries = function() {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  this.clone = function(prob) {
    if (random(1) < prob) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }
}

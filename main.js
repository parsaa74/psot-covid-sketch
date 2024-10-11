let people = [];
const socialDistancingRadius = 50;
const interactionRadius = 30;

function setup() {
  // Create a responsive canvas that fills the browser window
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block'); // Removes the scrollbars
  textAlign(CENTER, CENTER);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(220, 20, 95);
  
  for (let person of people) {
    person.update();
    person.display();
    person.interact();
  }
  
  displayLonelinessMetric();
}

function mousePressed() {
  people.push(new Person(mouseX, mouseY));
}

class Person {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector();
    this.maxSpeed = 2;
    this.maxForce = 0.1;
    this.size = random(15, 25);
    this.color = color(random(360), 80, 80);
    this.interactionTimer = 0;
    this.wanderTheta = 0;
  }
  
  update() {
    this.vel.mult(0.9);
    this.acc.mult(0.1);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  
  interact() {
    for (let other of people) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < socialDistancingRadius) {
          // Move away from each other
          let angle = atan2(this.pos.y - other.pos.y, this.pos.x - other.pos.x);
          this.vel = p5.Vector.fromAngle(angle);
        } else if (d < interactionRadius) {
          // Interact
          this.interactionTimer++;
          fill(255, 0, 0);
          line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
      }
    }
  }
}

function displayLonelinessMetric() {
  let totalInteractions = people.reduce((sum, person) => sum + person.interactionTimer, 0);
  let averageInteractions = people.length > 0 ? totalInteractions / people.length : 0;
  let lonelinessScore = map(averageInteractions, 0, 100, 100, 0);
  
  fill(0);
  textSize(16);
  text(`Loneliness Score: ${lonelinessScore.toFixed(2)}`, width / 2, height - 40);
  text(`People: ${people.length}`, width / 2, height - 20);
}

// Add this function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
let people = [];
const socialDistancingRadius = 50;
const interactionRadius = 30;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(220);
  
  for (let person of people) {
    person.move();
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
    this.x = x;
    this.y = y;
    this.speed = random(1, 3);
    this.direction = p5.Vector.random2D();
    this.interactionTimer = 0;
  }
  
  move() {
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    
    if (this.x < 0 || this.x > width) this.direction.x *= -1;
    if (this.y < 0 || this.y > height) this.direction.y *= -1;
  }
  
  display() {
    fill(0, 150, 255);
    ellipse(this.x, this.y, 20, 20);
  }
  
  interact() {
    for (let other of people) {
      if (other !== this) {
        let d = dist(this.x, this.y, other.x, other.y);
        if (d < socialDistancingRadius) {
          // Move away from each other
          let angle = atan2(this.y - other.y, this.x - other.x);
          this.direction = p5.Vector.fromAngle(angle);
        } else if (d < interactionRadius) {
          // Interact
          this.interactionTimer++;
          fill(255, 0, 0);
          line(this.x, this.y, other.x, other.y);
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
  text(`Loneliness Score: ${lonelinessScore.toFixed(2)}`, width / 2, 20);
  text(`People: ${people.length}`, width / 2, 40);
}
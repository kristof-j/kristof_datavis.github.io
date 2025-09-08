let hourBalls = [];
let minuteBalls = [];
let secondBalls = [];
let lastHour = -1;
let lastMinute = -1;
let lastSecond = -1;

function setup() {
  createCanvas(800, 300);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(20);
  
  // gets current time
  let h = hour();
  let m = minute();
  let s = second();
  
  // made it 12 hour format because if not its kind of hard to count
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  
  // updates the balls if the time changes
  if (h12 !== lastHour) {
    updateBalls(hourBalls, h12, 150, 150, 110, color(255, 80, 120));
    lastHour = h12;
  }
  if (m !== lastMinute) {
    updateBalls(minuteBalls, m, 400, 150, 110, color(80, 255, 150));
    lastMinute = m;
  }
  if (s !== lastSecond) {
    updateBalls(secondBalls, s, 650, 150, 110, color(80, 150, 255));
    lastSecond = s;
  }
  
  // draws the circles and the balls
  drawCircleContainer(150, 150, 110, hourBalls);
  drawCircleContainer(400, 150, 110, minuteBalls);
  drawCircleContainer(650, 150, 110, secondBalls);
}

function updateBalls(ballArray, count, centerX, centerY, radius, ballColor) {
  // Calculate difference
  let currentCount = ballArray.length;
  let diff = count - currentCount;
  
  if (diff > 0) {
    // Add balls
    for (let i = 0; i < diff; i++) {
      ballArray.push(new LavaBall(centerX, centerY, radius, ballColor));
    }
  } else if (diff < 0) {
    // Remove balls (from the end)
    ballArray.splice(count);
  }
}

function drawCircleContainer(cx, cy, r, balls) {
  // draw circle outline
  noFill();
  stroke(100, 100);
  strokeWeight(2);
  ellipse(cx, cy, r * 2);
  
  // update and draw balls
  for (let ball of balls) {
    ball.updateCircle(cx, cy, r, balls);
    ball.display();
  }
}

class LavaBall {
  constructor(centerX, centerY, containerRadius, col) {
    this.containerX = centerX;
    this.containerY = centerY;
    this.containerRadius = containerRadius;
    
    // lets you start at random position within circle
    let angle = random(TWO_PI);
    let dist = random(0, containerRadius - 15);
    this.x = centerX + cos(angle) * dist;
    this.y = centerY + sin(angle) * dist;
    
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.radius = 10;
    this.color = col;
    this.floatOffset = random(TWO_PI);
    this.floatSpeed = random(0.01, 0.02);
  }
  
  updateCircle(cx, cy, containerR, otherBalls) {
    // Lava lamp style floating movement
    this.floatOffset += this.floatSpeed;
    this.vx += sin(this.floatOffset) * 0.03;
    this.vy += cos(this.floatOffset * 0.7) * 0.05;
    
    
    this.vy += random(-0.01, 0.02); // slow drift thats random
    
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    
    this.vx = constrain(this.vx, -0.8, 0.8); // limit maximum speed for slow movement
    this.vy = constrain(this.vy, -1, 1);
    
    
    this.x += this.vx; // updates the pos
    this.y += this.vy;
    
    
    let distFromCenter = dist(this.x, this.y, cx, cy); // this keeps the balls within the circle
    let maxDist = containerR - this.radius;
    
    if (distFromCenter > maxDist) {
      // Push ball back inside circle
      let angle = atan2(this.y - cy, this.x - cx);
      this.x = cx + cos(angle) * maxDist;
      this.y = cy + sin(angle) * maxDist;
      
      
      this.vx *= -0.5; // bounce spped
      this.vy *= -0.5;
    }
    
    // makes the collision happen with other balls
    for (let other of otherBalls) {
      if (other !== this) {
        let d = dist(this.x, this.y, other.x, other.y);
        let minDist = this.radius * 2;
        
        if (d < minDist && d > 0) {
          
          let angle = atan2(other.y - this.y, other.x - this.x);
          let force = (minDist - d) * 0.02; // collision logic
          
          this.vx -= cos(angle) * force;
          this.vy -= sin(angle) * force;
          other.vx += cos(angle) * force;
          other.vy += sin(angle) * force;
        }
      }
    }
  }
  
  display() {
    noStroke();
    
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

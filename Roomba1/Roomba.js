class Roomba1 {
  constructor(x, y) {
    this.sprite = createSprite(width / x, height / y, 50, 50);
    this.pos = this.sprite.position;
    this.angle = 0;
    this.r = 29;
    this.speed = 1;
    this.trail = [];
    this.directionChangeDelay = 1000; // 1 second delay in milliseconds
    this.lastDirectionChange = 0;
    this.color = this.sprite.color
  }


  update(other,delaytime) {
    if (this.isEating) {
      return;
    }
    
    this.constrain();
  
    if (frameCount % 5 === 0) {
      this.trail.push({ x: this.pos.x, y: this.pos.y });
    }
  
    if (Date.now() - this.lastDirectionChange >= this.directionChangeDelay + 100) {
      if (!this.closestFood) {
        this.findClosestFood();
      }
  
      this.findTargetAngle();
    }
  
    this.checkPosition(other,delaytime)
    this.pos.x += this.speed * cos(this.angle);
    this.pos.y += this.speed * sin(this.angle);
    this.angle = this.lerpAngle(this.angle, this.targetAngle, 0.1);
    this.checkMakingProgress();
    this.eatFood();
  }

  checkPosition(other,delaytime) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if(food.length > 0) {
      if (d < 50) {
        if (Date.now() - this.lastDirectionChange > delaytime) {
          this.targetAngle += PI *1.5;
          other.targetAngle -= PI ;
          this.lastDirectionChange = Date.now();
          other.lastDirectionChange = Date.now();
        }
      }
    }
  }

  checkMakingProgress(a) {
    if (!this.closestFood) return;

    const d = dist(
      this.pos.x,
      this.pos.y,
      this.closestFood.x,
      this.closestFood.y
    );

    if(this.closestFoodDistance < 400) {
      if ((new Date()) - 300 > this.closestFoodTime && (d + 0.01) >= this.closestFoodDistance) {
  
        food = food.filter(e => e !== this.closestFood);
        this.closestFood = null;
  
      } else {
        return this.closestFoodDistance = d;
      }
    } else {
      this.closestFoodDistance = d;
    }

  }

  findTargetAngle() {
    if (!this.closestFood) return;
    let angle = atan2(
      this.closestFood.y - this.pos.y,
      this.closestFood.x - this.pos.x
    );


    this.targetAngle = angle;  
  }

  findClosestFood() {
    let closestFood = null;
    let closestFoodDistance = Infinity;
    for (let snack of food) {
      let d = dist(this.pos.x, this.pos.y, snack.x, snack.y);
      let angle = atan2(snack.y - this.pos.y, snack.x - this.pos.x);
      let angleWeight = abs(angle - this.angle) * 50;

      if (d + angleWeight <= closestFoodDistance) {
        closestFoodDistance = d;
        closestFood = snack;
      }
    }

    this.closestFood = closestFood;
    this.closestFoodDistance = closestFoodDistance;
    this.closestFoodTime = new Date();
  }

  // eatFood() {
  //   for (let i = food.length - 1; i >= 0; i--) {
  //     if (dist(this.pos.x, this.pos.y, food[i].x, food[i].y) <= this.r) {
  //       food.splice(i, 1);
  //       this.closestFood = null;
  //     }
  //   }
  // }

  eatFood() {
    for (let i = food.length - 1; i >= 0; i--) {
      let d = dist(this.pos.x, this.pos.y, food[i].x, food[i].y)
      if (d <= 18) {
        this.isEating = true;
        setTimeout(() => {
          food.splice(i, 1);
          this.closestFood = null;
          this.isEating =false}, 30); // 
          break;
        }
    }
  }

  constrain() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
    }

    if (this.pos.x < this.r) {
      this.pos.x = this.r;
    }

    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
    }

    if (this.pos.y < this.r) {
      this.pos.y = this.r;
    }
  }

  // draw(colortrail) {
  //   this.drawTrail(colortrail);
  //   push();
  //   translate(this.pos.x, this.pos.y);
  //   rotate(this.angle);
  //   fill(0);
  //   circle(0, 0, this.r * 2);

  //   fill(255);
  //   circle(0, 0, 50);

  //   fill(0);
  //   circle(0, 0, 30);
  //   rectMode(CENTER);
  //   rect(20, 0, 3, 35);

  //   fill(100);
  //   circle(0, 0, 10);
  //   pop();
  // }

  draw(colortrail, otherRoomba) {
    this.drawTrail(colortrail);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(0);
    circle(0, 0, this.r * 2);

    if (otherRoomba && food.length > 0) {
      const d = dist(this.pos.x, this.pos.y, otherRoomba.pos.x, otherRoomba.pos.y);
      if (d < 50) {
        fill(255, 0, 0);
      } else {
        fill(255);
      }
    } else {
      fill(255);
    }
    circle(0, 0, 50);

    fill(0);
    circle(0, 0, 30);
    rectMode(CENTER);
    rect(20, 0, 3, 35);

    fill(255);
    circle(0, 0, 10);
    pop();
  }

  drawTrail(c) {
    // let trailLifetime = 50; // Lifetime of each trail point in frames
  
    // if (frameCount % trailLifetime === 0 && this.trail.length > 0) {
    //   this.trail.shift(); // Remove the oldest trail point
    // }
  
    for (let i = 0; i < this.trail.length; i++) {
      let color1 = color(0, c, 139, 20);
      let color2 = color(0, c, 139, 20);
      let interC = lerpColor(color1, color2, i / this.trail.length);
      fill(interC);
      noStroke();
      circle(this.trail[i].x, this.trail[i].y, this.r * 2.5);
    }
  }
  

  lerpAngle(a, b, i) {
    var va = p5.Vector.fromAngle(a);
    var vb = p5.Vector.fromAngle(b);
    return p5.Vector.lerp(va, vb, i).heading();
  }
  display() {
    // Display the Roomba as a circle
    fill(255);
    ellipse(this.x, this.y, 20, 20);
  }
}


class Roomba2 {
  constructor(x, y) {
    this.sprite = createSprite(width / x, height / y, 50, 50);
    this.pos = this.sprite.position;
    this.angle = 0;
    this.r = 29;
    this.speed = 1;
    this.trail = [];
    this.directionChangeDelay = 1000; // 1 second delay in milliseconds
    this.lastDirectionChange = 0;
  }

  update(other) {
      this.constrain();

    
      if (frameCount % 5 === 0) {
        this.trail.push({ x: this.pos.x, y: this.pos.y });
      }
  
      if (Date.now() - this.lastDirectionChange >= this.directionChangeDelay + 100) {
        if (!this.closestFood) {
          this.findClosestFood();
        }
    
        this.findTargetAngle();
      }
  
      this.checkPosition(other)
      this.pos.x += this.speed * cos(this.angle);
      this.pos.y += this.speed * sin(this.angle);
      this.angle = this.lerpAngle(this.angle, this.targetAngle, 0.1);
      this.checkMakingProgress();
      this.eatFood();
  
  }

  checkPosition(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if(food.length > 0) {
      if (d < 40) {
        if (Date.now() - this.lastDirectionChange > this.directionChangeDelay) {
          this.targetAngle += PI * 1.5;
          other.targetAngle -= PI;
          this.lastDirectionChange = Date.now();
          other.lastDirectionChange = Date.now();
        }
      }
    }
  }

  checkMakingProgress(a) {
    if (!this.closestFood) return;

    const d = dist(
      this.pos.x,
      this.pos.y,
      this.closestFood.x,
      this.closestFood.y
    );
      
    if(this.closestFoodDistance < 200) {
      if ((new Date()) - 100 > this.closestFoodTime && (d + 0.01) >= this.closestFoodDistance) {
  
        food = food.filter(e => e !== this.closestFood);
        this.closestFood = null;
  
      } else {
        return this.closestFoodDistance = d;
      }
    } else {
      this.closestFoodDistance = d;
    }

  }


  findTargetAngle() {
    if (!this.closestFood) return;
    let angle = atan2(
      this.closestFood.y - this.pos.y,
      this.closestFood.x - this.pos.x
    );


    this.targetAngle = angle;  
  }

  findClosestFood() {
    let closestFood = null;
    let closestFoodDistance = Infinity;
    for (let snack of food) {
      let d = dist(this.pos.x, this.pos.y, snack.x, snack.y);
      let angle = atan2(snack.y - this.pos.y, snack.x - this.pos.x);
      let angleWeight = abs(angle - this.angle) * 50;

      if (d + angleWeight <= closestFoodDistance) {
        closestFoodDistance = d;
        closestFood = snack;
      }
    }

    this.closestFood = closestFood;
    this.closestFoodDistance = closestFoodDistance;
    this.closestFoodTime = new Date();
  }

  eatFood() {
    for (let i = food.length - 1; i >= 0; i--) {
      if (dist(this.pos.x, this.pos.y, food[i].x, food[i].y) <= this.r) {
        food.splice(i, 1);
        this.closestFood = null;
      }
    }
  }

  constrain() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
    }

    if (this.pos.x < this.r) {
      this.pos.x = this.r;
    }

    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
    }

    if (this.pos.y < this.r) {
      this.pos.y = this.r;
    }
  }

  draw(colortrail) {
    this.drawTrail(colortrail);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(0);
    circle(0, 0, this.r * 2);

    fill(255);
    circle(0, 0, 50);

    fill(0);
    circle(0, 0, 30);
    rectMode(CENTER);
    rect(20, 0, 3, 35);

    fill(255);
    circle(0, 0, 10);
    pop();
  }

  drawTrail(c) {
    let trailLifetime = 50; // Lifetime of each trail point in frames
  
    if (frameCount % trailLifetime === 0 && this.trail.length > 0) {
      this.trail.shift(); // Remove the oldest trail point
    }
  
    for (let i = 0; i < this.trail.length; i++) {
      let color1 = color(0, c, 139, 20);
      let color2 = color(0, c, 139, 20);
      let interC = lerpColor(color1, color2, i / this.trail.length);
      fill(interC);
      noStroke();
      circle(this.trail[i].x, this.trail[i].y, this.r * 2.5);
    }
  }
  

  lerpAngle(a, b, i) {
    var va = p5.Vector.fromAngle(a);
    var vb = p5.Vector.fromAngle(b);
    return p5.Vector.lerp(va, vb, i).heading();
  }
  display() {
    // Display the Roomba as a circle
    fill(255);
    ellipse(this.x, this.y, 20, 20);
  }
}

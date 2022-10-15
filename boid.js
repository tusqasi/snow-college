class Boid {
  // Setup a boid
  constructor() {
    this.position = createVector(random(W), random(H));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.size = 0.4;

    this.alignment_sensitivity = 1;
    this.cohesion_sensitivity = 1;
    this.separation_sensitivity = 4;
    this.maxForce = 0.3;
  }

  draw(boid_color) {
    push();
    if (boid_color) {
      fill(boid_color);
      stroke(boid_color);
    }
    // circle(this.position.x,this.position.y, 10)
    // arrow
    push();
    translate(this.position);
    rotate(this.velocity.heading());

    line(this.size * 10, 0, 0, this.size * 10);
    line(this.size * 10, 0, 0, this.size * -10);

    line(this.size * 8, 0, 0, this.size * 10);
    line(this.size * 8, 0, 0, this.size * -10);
    pop();

    pop();
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  flock(boids) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let seperation = this.seperation(boids);

    alignment.mult(alignmentSlider.value());
    cohesion.mult(cohesionSlider.value());
    seperation.mult(seperationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(seperation);
  }

  alignment(boids) {
    // Alignment
    // go where the neighbours are going

    let perceptionRadius = 80;
    let dist = 0; // distance from a boid
    let avg_heading = createVector();
    let total = 0;
    for (let boid of boids) {
      dist = this.position.dist(boid.position);
      // only align with boids which it can "see".
      if (dist < perceptionRadius && this != boid) {
        avg_heading.add(boid.velocity);
        total++;
      }
    }
    if (total > 0) {
      avg_heading.div(total);
      avg_heading.setMag(this.alignment_sensitivity);
      avg_heading.sub(this.velocity);
      avg_heading.limit(this.maxForce);
    }
    return avg_heading;
  }

  cohesion(boids) {
    // Cohesion
    // go toward the center of the flock

    let perceptionRadius = 140;
    let dist = 0; // distance from a boid
    let avg_position = createVector();
    let total = 0;
    for (let boid of boids) {
      if (this != boid) {
        // ignore ourself in the boids list
        dist = this.position.dist(boid.position);
        if (dist < perceptionRadius) {
          // adding positions together
          avg_position.add(boid.position);
          total++;
        }
      }
    }
    if (total > 0) {
      avg_position.div(total); // Average
      avg_position.sub(this.position); // Pointing towards center of the flock
      avg_position.setMag(this.cohesion_sensitivity); // Normalize
      avg_position.sub(this.velocity); //
      avg_position.limit(this.maxForce);
    }
    return avg_position;
  }
  seperation(boids) {
    // Point away from neighbouring boids

    // How far can boid "see"
    let perceptionRadius = 80;

    let avg_diff = createVector();
    let total = 0;
    let dist = 0;
    for (let boid of boids) {
      dist = this.position.dist(boid.position);
      // ignore ourself in the boids list
      if (dist < perceptionRadius && this != boid) {
        let vector_to_this = p5.Vector.sub(this.position, boid.position);
        vector_to_this.div(dist * dist); // Get the unit vector, i.e direction of other boid towards this boid.
        avg_diff.add(vector_to_this);
        total++;
      }
    }
    if (total > 0) {
      avg_diff.div(total); // Average
      avg_diff.setMag(this.separation_sensitivity); // Normalize
      avg_diff.sub(this.velocity); //
      avg_diff.limit(this.maxForce);
    }
    return avg_diff;
  }
  wrap() {
    // x > screen. wrap
    // x < screen. wrap
    if (this.position.x >= W) {
      this.position.x = 0;
    } else if (this.position.x <= 0) {
      this.position.x = W;
    }

    // y > screen. wrap
    // y < screen. wrap
    if (this.position.y >= H) {
      this.position.y = 0;
    } else if (this.position.y <= 0) {
      this.position.y = H;
    }
  }
  focus() {
    push();
    strokeWeight(1);
    noFill();
    circle(this.position.x, this.position.y, 50);
    // this is color blue.
    stroke(BLUE);
    this.draw();
    pop();
  }

  optimal_flock(boids) {
    let perceptionRadius = 90;
    let distance = 0;
    let avg_position = createVector();
    let avg_heading = createVector();
    let avg_diff = createVector();
    let total = 0;
    for (let boid of boids) {
      distance = this.position.dist(boid.position);

      if (dist < perceptionRadius && this != boid) {
        let vector_to_this = p5.Vector.sub(this.position, boid.position);
        vector_to_this.div(dist * dist);
        avg_diff.add(vector_to_this);
        avg_position.add(boid.position);
        avg_heading.add(boid.velocity);
        total++;
      }
    }

    if (total > 0) {
      avg_diff.div(total); // Average
      avg_diff.setMag(this.separation_sensitivity); // Normalize
      avg_diff.sub(this.velocity); //
      avg_diff.limit(this.maxForce);

      avg_heading.div(total);
      avg_heading.setMag(this.alignment_sensitivity);
      avg_heading.sub(this.velocity);
      avg_heading.limit(this.maxForce);

      avg_position.div(total); // Average
      avg_position.sub(this.position); // Pointing towards center of the flock
      avg_position.setMag(this.cohesion_sensitivity); // Normalize
      avg_position.sub(this.velocity); //
      avg_position.limit(this.maxForce);

      avg_diff.mult(alignmentSlider.value());
      avg_heading.mult(cohesionSlider.value());
      avg_position.mult(seperationSlider.value());

      this.acceleration.add(avg_heading); // Alignment
      this.acceleration.add(avg_position); // Cohesion
      this.acceleration.add(avg_diff); // Seperation
    }
  }
}

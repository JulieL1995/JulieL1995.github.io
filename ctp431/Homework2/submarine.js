function Submarine() {
    this.pos = createVector(50, height/2-50);
    this.vel = createVector(0, -2);
    this.acc = createVector(0, 0); 

    this.applyForce = function(force) {
        this.acc.add(force);
    }
    
    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    this.show = function() {
        image(submarine_img, this.pos.x, this.pos.y, 100, 100);
    }
    
    this.reset = function() {
        this.pos = createVector(50, height/2-50);
        this.vel = createVector(0, -2);
        this.acc = createVector(0, 0); 
    }
} 

function Shell(y) {
    this.pos = createVector(width + 10, y);
    this.caught = false;
    
    this.update = function() {
        this.pos.x-=rect_width;
    }
    
    this.show = function() {
        image(shell, this.pos.x, this.pos.y, 25, 25);
    }
    
    this.isCaught = function() {
        if (this.pos.x < -50)
            return true;
        return this.caught;
    }
    
    this.catch = function() {
        bubble_sound.play();
        this.caught = true;
    }
}

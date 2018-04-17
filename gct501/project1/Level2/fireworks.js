
// one particle
function Particle(x, y, color, finalPos) {
    this.pos = createVector(x,y);
    this.lifespan = 255;
    this.color = color;
    
    this.vel = createVector(0, -sqrt(2*gravity.y*finalPos));
    this.vel = p5.Vector.random2D().mult(random(1,20));
    this.acc = createVector(0,0);
    
    this.applyForce = function(force){
        this.acc.add(force);
    }
    
    this.update = function() {
        this.vel.mult(0.85);
        this.lifespan-=3;
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    this.show = function() {
        strokeWeight(3);
        stroke(this.color, this.lifespan);
        point(this.pos.x, this.pos.y);
    }
    
    this.done = function() {
        return this.lifespan < 0;
    }
}
 
// one firework = multiple particles
function Firework(xPos, yPos) {
    this.color = color(255, 255, 255); 
    this.particles = [];
    for(var i = 0; i < 100; i++) {
        var p = new Particle(xPos, yPos, this.color);
        this.particles.push(p);
    }
    
    this.done = function() {
        return ( this.particles.length == 0 );
    }
    
    this.update = function() {
            for (var i = this.particles.length - 1; i >= 0 ; i--) {
                this.particles[i].applyForce(gravity);
                this.particles[i].update();
                if (this.particles[i].done()){
                    this.particles.splice(i,1);
                }
            }
    }
    
    this.show = function() {
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].show();
            }
    }
    
    this.explode = function() {
        for(var i = 0; i < 100; i++) {
            var p = new Particle(xPos, yPos, this.color);
            this.particles.push(p);
        }
    }
}

var analyzer,filter, freq, bubble_sound;
var data = [];
var head = 0;
var submarine_img, submarine, bubbles, shell, bam, button;
var gravity;
var shells = [];
var rect_width = 2;
var nr_shells = 0;
var start = false;
var finish = false;
var finishFrameCount = 0;

function preload() {
    song = loadSound('Beatles - Yellow Submarine.mp3');
    bubble_sound = loadSound('bubbles.mp3');
}

function setup() {
    var canvas = createCanvas(1500, 720);
    canvas.parent("myApp2");
    submarine_img = loadImage('./submarine.png');
    bubbles = loadImage('./bubbles.png');
    shell = loadImage('./shell.png');
    
    analyzer = new p5.Amplitude();
    
    filter = new p5.LowPass();
    freq = 22050;
    filter.freq(freq);
    song.disconnect();
    song.connect(filter);
    analyzer.setInput(filter);
    song.onended(function() {finishFrameCount = frameCount;});

    for (var i = 0; i < width/rect_width; i++) {
        data.push(100);
    }
    
    gravity = createVector(0, 0.2);
    submarine = new Submarine();
    
    button = createButton('Start game');
    button.position(width/2 - 50, height/2 + 150);
    button.mousePressed(startGame);
    
}

function draw() {
    background(color('#633202'));
    
    if (song.isPlaying()) {
        var rms = analyzer.getLevel();
        var new_length = map(rms, 0.0, 1.0, 100, height/2 - 10);
    }
    else {
        var new_length = 100;
    }
    data[ (head - 1) % data.length ] = new_length;
    
    fill(color('#2019FB'));
    noStroke();
    for (var i = 0; i < data.length; i++) {
        var j = (head + i) % data.length;
        rect(rect_width*i, (height/2 - data[j]), rect_width, data[j]);
        rect(rect_width*i, height/2, rect_width, data[j]);
    }
    
    if (start) {
        if (random(1000) < 2 && song.isPlaying()) {
            var y = height/2 + random(-new_length+25, new_length-25);
            shells.push(new Shell(y));
        }
    
        for (var i = 0; i < shells.length; i++) {
            if (shells[i].isCaught()) {
                shells.splice(i, 1);
            }
            else {
                shells[i].update();
                shells[i].show();
            }
        }
    
        if (keyIsDown(72)) {
            submarine.applyForce(createVector(0, -0.4));
            image(bubbles, submarine.pos.x - 50, submarine.pos.y + 50, 50, 25);
        }
    
        submarine.applyForce(gravity);
        submarine.update();
        submarine.show();
    
        checkCatch();
        checkCollide();
        
        image(shell, width - 370, 5, 20, 20);
        text(": " + nr_shells, width-340, 20);
        text("Frequence range: " + freq, width - 200, 20);
        
        if (finishFrameCount > 0 && frameCount - finishFrameCount >= width/rect_width) 
            finishGame();
    }
    
    if (finish) {
        fill(0);
        textStyle(BOLD);
        textAlign(CENTER);
        rect(width/2 - 100, height/2 - 100, 200, 200);
        fill(255);
        rect(width/2 - 95, height/2 - 95, 190, 190);
        fill(color('#0000FF'));
        text("GAME OVER", width/2 , height/2 - 40);
        if (freq == 10) {
            // you lost
            text("You lost", width/2 , height/2 - 20);
        }
        else {
            text("Final score: " + freq, width/2, height/2 + 20);
            image(shell, width/2 - 20, height/2 - 20, 20, 20);
            text(": " + nr_shells, width/2+ 10, height/2 - 5);
        }
    }
    
    head = (head + 1) % data.length;
}

function createPoly() {
    var poly = [];
    poly[0] = createVector(submarine.pos.x, submarine.pos.y + 50);
    poly[1] = createVector(submarine.pos.x + 40, submarine.pos.y + 50);
    poly[2] = createVector(submarine.pos.x + 40, submarine.pos.y + 15);
    poly[3] = createVector(submarine.pos.x + 66, submarine.pos.y + 15);
    poly[4] = createVector(submarine.pos.x + 66, submarine.pos.y + 50);
    poly[5] = createVector(submarine.pos.x + 100, submarine.pos.y + 50);
    poly[6] = createVector(submarine.pos.x + 100, submarine.pos.y + 80);
    poly[7] = createVector(submarine.pos.x, submarine.pos.y + 80);
    return poly;
}

function checkCatch() {
    var poly = createPoly();
    for (var i = 0; i < shells.length; i++) {
        if (shells[i].pos.x < submarine.pos.x + 120) {
            if (collideCirclePoly(shells[i].pos.x + 12.5, shells[i].pos.y + 12, 25, poly)) {
                shells[i].catch();
                nr_shells++;
            }
        }
    }
}

function checkCollide() {
    var poly = createPoly();
    for (var i = submarine.pos.x - 10; i < submarine.pos.x + 120; i++) {
        var j = (head + i) % data.length;
        if (submarine.pos.y < height/2) { // upper half
            if (collideRectPoly(rect_width*i, 0, rect_width, height/2 - data[j], poly)) {
                submarine.applyForce(createVector(0, 0.2));
                if (freq > 10)
                    freq--;
                else
                    finishGame();
                filter.process(song, freq, 0.5);
            }
                
        }
        else { // lower half
            if (collideRectPoly(rect_width*i, height/2 + data[j], rect_width, height/2 - data[j], poly)) {
                submarine.applyForce(createVector(0, -0.2));
                if (freq > 10)
                    freq--;
                else
                    finishGame();
                filter.process(song, freq, 0.5);
            }
        }
    }
}

function startGame() {
    if (!start) {
        song.jump(0);
        song.play(); 
        start = true;
        button.style("display", "none");
        freq = 22050;
        nr_shells = 0;
        var shells = [];
        filter.process(song, freq);
        finish = false;
        submarine.reset();
        finishFrameCount = 0;
    }
}

function finishGame() {
    if (start) {
        for (var i = 0; i < data.length; i++) {
            data[i] = 100;
        }
        button = createButton("Try again");
        button.style("display", "block");
        button.mousePressed(startGame);
        button.position(width/2 - 50, height/2 + 170);
        finish = true;
        start = false;
        song.stop();
    }
}

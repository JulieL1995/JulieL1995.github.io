var dolphins = new Set(null);
var dolphin_image, wave;
var number_of_waves = 12;
var analyzer;
var speed = 10;

var particle;
var demoIsPlaying = false;
var fireworks = [];
var oscillators = [];
var gravity;
var demoFreqs = [523.2, 698.4, 830.6, 783.9, 698.4, 1046, 932.3, 783.9, 698.4, 830.6, 783.9, 659.2, 739.9, 523.2];
var oneSixth = 200.0;
var demoTimes = [1, 1.5, 0.5, 1, 2, 1, 3, 3, 1.5, 0.5, 1, 2, 1, 3];
var day = 1;

function preload() {
    song = loadSound('Tsar B - Escalate.mp3');
}

function setup() {
    var canvas = createCanvas(1500, 720);
    canvas.parent("myApp");
    
    dolphin_image = loadImage('dolphin.png');
    wave = loadImage('wave.png');
    imageMode(CENTER);
    
    analyzer = new p5.Amplitude();

    stroke(255);
    strokeWeight(4);
    background(0);
    gravity = createVector(0, 0.2);
    
    osc = new p5.TriOsc();
    osc.amp(0);
    
    frameRate(30);
    fft = new p5.FFT();
    fft.bins = 256;
    
    osc.start();
    
    // buttons for manipulating audio
    var play = createButton("Play");
    play.position(0, height + 100);
    play.mousePressed(function() {
        if (! song.isPlaying()) song.play();
    });
    var pause = createButton("Pause");
    pause.position(50, height + 100);
    pause.mousePressed(function() { song.pause(); });
    
    var playDemoButton = createButton("Play Demo");
    playDemoButton.position(0, height + 100);
    playDemoButton.mousePressed(function() {
        playDemo();
    });
    playDemoButton.hide();
   
    // toggle between day and night
    var button = createButton("Day/Night");
    button.position(width - 100, height + 100);
    button.mousePressed(function() {
        if (day) { 
            day = 0; 
            was_playing = song.isPlaying();
            song.pause(); 
            playDemoButton.show(); 
            pause.hide();
            play.hide();
        }
        else { 
            day = 1; 
            if (was_playing) song.play(); 
            playDemoButton.hide();
            pause.show();
            play.show();
        }
    });
}

function draw() {
    if (day) {
    background(color('#02E9FB'));
    var rms = analyzer.getLevel();
    
    var number_of_dolphins = int(map(rms, 0.0, 1.0, 0, 5));
    
    for (var i = 0; i < number_of_dolphins; i++) {
        var radius = random(100, 600);
        var dolphin = { xPos: - radius, yPos: 0, r: radius};
        dolphins.add(dolphin);
    }
    
    for ( d of dolphins.keys()) {
        var toDraw = true;
        d.xPos+= speed;
        if (d.xPos < d.r) {
            d.yPos = sqrt(Math.pow(d.r, 2) - Math.pow(d.xPos, 2));
        }
        else {
            d.xPos-= speed;
            d.yPos-= speed;
            if (d.yPos < -100) {
                dolphins.delete(d);
                toDraw = false;
            }
        }
        
        // draw image
        if (toDraw) {
            push();
            translate(width/2 + d.xPos, height - 10 - d.yPos);
            rotate(map(d.xPos, -d.r, d.r, -PI/4, PI/2));
            image(dolphin_image, 0, 0, 166, 144);
            pop(CLOSE);
        }
        
    }
    }
    else { // night
        background(0, 25); 

        for (var i = fireworks.length - 1; i >= 0; i--){
            fireworks[i].update();
            fireworks[i].show();
            if (fireworks[i].done())
                fireworks.splice(i,1);
        }
    }
    
    // waves for sea
    for (var i = 0; i < number_of_waves; i++) {
        image(wave, i*150 - 10, height - 80, 200,200);
    }

}

function mousePressed() {
    if (!day && !demoIsPlaying) playNote(mouseX, mouseY);
}

function playDemo() {
    demoIsPlaying = true;
    var i = 0;
    var current = 0;
    var last_played_time = 0;
    var interval = setInterval(function(){
        if(last_played_time  == current) {
            var y = 200;
            var x = map(demoFreqs[i], 40 , 1100, 0, width);
            playNote(x, y);
            last_played_time += demoTimes[i];
            i++;
            if (i == demoFreqs.length) {
                clearInterval(interval);
                demoIsPlaying = false;
            }
        }
        current += 0.5;
    },1000/6);
}

function playNote(x, y) {
   if (0 <= x <= width && 0 <= y <= height) {
        fireworks.push(new Firework(x, y));
        osc.freq(map(x, 0, width, 40, 1100));
        // fade in
        osc.fade(map(y, 0, height, 1, 0.01), 0.2);
        // fade out
        setTimeout(function() { osc.fade(0, 0.4); }, 10);
    }  
}

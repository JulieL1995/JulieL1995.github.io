var number_of_flowers = 10;
var stem_width = 10;
var space_between_flowers = 100;
var flower_img;
var grass_img
var song, analyzer, fft;

// https://p5js.org/examples/sound-measuring-amplitude.html
function preload() {
  song = loadSound('./celtic.mp3');
}


function setup() {
  createCanvas(1500, 720);
  flower_img = loadImage("./flower.png");
  grass_img = loadImage("./grass.png");
  
  // audio
  song.loop();
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);
  
  fft = new p5.FFT();
  fft.bins = 16;
  
  frameRate(30);
}

// source: https://p5js.org/examples/form-star.html
function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


function draw() {
    background(color('#02E9FB'));
    noStroke();
    
    // root mean square amplitude
    // https://p5js.org/examples/sound-measuring-amplitude.html
    var rms = analyzer.getLevel();
   
    // sun 
    push();
    var color_sun = color('#FFFF00');
    translate(width - 200, 200);
    rotate(frameCount / 150.0);
    fill(color_sun);
    star(0, 0 , 80+rms*250, 100+rms*250, 40); 
    pop();
    
    // fft
    var spectrum = fft.analyze();
    
    // flowers
    // https://p5js.org/reference/#/p5.FFT
    var color_stem = color('#0DDE17');
    fill(color_stem);
    var x = space_between_flowers;
    var y = 500;
    for (var i = 0; i < number_of_flowers; i++) {
        var h = map(spectrum[i], 0, 255, 0, 8 * stem_width-height);
        rect(x, height, stem_width, h); 
        image(flower_img, x - 5 * stem_width, height + h - 6 * stem_width, 11 * stem_width, 11 * stem_width);
        
        x += space_between_flowers + stem_width;
    }
    
    image(grass_img, 0, -200, 1500, 920);
    
}

// redraw iedere seconde ofzo voor freqs => https://p5js.org/examples/structure-loop.html

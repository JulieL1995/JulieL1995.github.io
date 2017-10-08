var number_of_flowers = 10;
var stem_width = 10;
var space_between_flowers = 100;
var flower_img;
var grass_img
var current_song, analyzer, fft;

var number_of_stars = 512;
var positionsX = [];
var positionsY = [];

var day = 1;

var number_of_songs = 1;
var songs = [];

// https://p5js.org/examples/sound-measuring-amplitude.html
function preload() {
    songs[1] = loadSound('./Niels & Wiels - Skwon Meiske.mp3');
    songs[0] = loadSound('./Tsar B - Escalate.mp3');
}


function setup() {
    var canvas = createCanvas(1500, 720);
    canvas.parent("myApp");
    
    flower_img = loadImage("./flower.png");
    grass_img = loadImage("./grass.png");
    grass2_img = loadImage("./grass_night.png");
    firefly = loadImage("./firefly2.png");
  
    // audio
    analyzer = new p5.Amplitude();
    current_song= 0;
  
    fft = new p5.FFT();
    fft.bins = 256;
    
    // create random positions for the stars
    for( var i = 0; i < number_of_stars; i++) {
        positionsX[i] = random(width);
        positionsY[i] = random(height);
    }
    
    frameRate(30);
    
    // toggle between day and night
    var button = createButton("Day/Night");
    button.position(width - 100, height+100);
    button.mousePressed(function() {
        if (day) day = 0;
        else day = 1;
    });
    
    // buttons for manipulating audio
    var play = createButton("Play");
    play.position(0, height+100);
    play.mousePressed(function() {
        if (! songs[current_song].isPlaying()) songs[current_song].play();
    });
    
    var pause = createButton("Pause");
    pause.position(50, height+100);
    pause.mousePressed(function() { songs[current_song].pause(); });
    
    var rewind = createButton("Rewind");
    rewind.position(110, height+100);
    rewind.mousePressed(function() { songs[current_song].jump(0); });
    
    var control = createFileInput(addSong);
    control.parent("fileChooseInput");
    control.id("input");
    control.attribute("accept","audio/*");
    
    var new_song = createElement('tr', "<td>Niels & Wiels - Skwon Meiske.mp3</td>");
    new_song.parent("#musicTable");
    new_song.attribute("id", "row0");
    new_song.addClass("clickable-row");
    new_song.attribute("onclick", "playmusic(1)");
    new_song = createElement('tr', "<td>Tsar B - Escalate.mp3</td>");
    new_song.parent("#musicTable");
    new_song.attribute("id", "row0");
    new_song.addClass("clickable-row");
    new_song.attribute("onclick", "playmusic(0)");
    new_song.addClass("active");
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
    if (day) { // day
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
    
        image(grass_img, 0, -200, 1550, 920);
    }
    else { // night
        //fade background
        fill(0, 50);
        rect(0,0,width, height);
    
        noStroke();
        
        var rms = analyzer.getLevel();
    
        for( var i = 0; i < number_of_stars; i++) {
            if ( map(rms, 0, 1, 0, number_of_stars) > i) {
                fill(255);
                star(positionsX[i], positionsY[i], 2, 15, 5);
            }
        }
    
        image(grass2_img, 0, -200, 1550, 920);
    }
}

// https://p5js.org/examples/form-triangle-strip.html

function addSong(file) {
        var new_song = createElement('tr', "<td>" + file.name + "</td>");
        new_song.parent("#musicTable");
        new_song.attribute("id", "row" + number_of_songs);
        new_song.addClass("clickable-row");
        new_song.attribute("onclick", "playmusic(" + number_of_songs + ")");
        
        songs[number_of_songs] = loadSound(file);
        
        number_of_songs++;
    
        select("#input").value(null);
}
    
function playmusic(index) {
    select("#row" + current_song).removeClass("active");
    select("#row" + index).addClass("active");
    
    songs[current_song].stop();
    current_song = index;
    songs[current_song].play();
}

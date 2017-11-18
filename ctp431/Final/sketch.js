var bagpipes_img, b_slider, t_slider, smoke_img, c_slider, note_div, s_slider;
var bass, tenor;
var c_volume = 0.0;
var number_of_tones = 8;
var tone_names = ["G1", "A1", "B1", "C1", "D1", "E1", "F1", "G2"];
var tones = [];
var current_tone, current_tone_index;
var tone_colors;
var tone_hole_positions = [];
var tone_settings = [];
var inputs = [];

var song = [];
var song_tones = [];
var song_times = [];
var song_divs = [];
var song_length = 0;
var speed = 1000;
var song_is_playing = false;

function preload() {
    bass = loadSound("samples/bass.wav");
    tenor = loadSound("samples/tenor.wav");
    
    for (var i = 0; i < number_of_tones; i++) {
        tones[i] = loadSound("samples/" + tone_names[i] + ".wav");
    }
}


function setup() {
    var c = createCanvas(1500, 1000);
    c.parent("canvas");
    
    frameRate(30);
    bagpipes_img = loadImage("./bagpipes.png");
    smoke_img = loadImage("./smoke.png");
    
    b_slider = createSlider(0, 100, 0);
    t_slider = createSlider(0, 100, 0);
    c_slider = createSlider(0, 100, 0);
    
    b_slider.position(750, 250);
    t_slider.position(750, 300);
    c_slider.position(750, 350);
    
    bass.setVolume(0.0);
    tenor.setVolume(0.0);
    bass.loop();
    tenor.loop();
    
    // colors for buttons
    tone_colors = [color('#FF0000'), color("#FF9900"), color("#FFFF00"), color("#66FF33"), color("#00FFFF"), color("#0000FF"), color("#9966FF"), color("#FF33CC")];
    
    // finger settings for the tones
    setToneSettings();
    
    // tones
    for (var i = 0; i < number_of_tones; i++) {
            // tone buttons
            var button = createButton(tone_names[i]);
            button.position(650, 400 + i*50);
            button.size(95, 50);
            button.style("background-color", tone_colors[i]);
            button.attribute("onclick", "playNewTone(" + i + ")");
            
            // tone inputs
            inputs[i] = createInput();
            inputs[i].position(750, 410 + i*50);
            inputs[i].size(60, 25);
            inputs[i].attribute("type", "number");
            
            // add buttons
            var add = createButton("Add");
            add.position(820, 410 + i*50);
            add.size(60, 25);
            add.attribute("onclick", "addTone(" + i + ")");
    }
    
    // note div
    note_div = createDiv("");
    note_div.position(650, 810);
    note_div.size(800, 90);
    note_div.style("border-style", "solid");
    note_div.style("overflow", "auto");
    note_div.id("note_div");
    
    // buttons for div
    var play = createButton("Play");
    play.position(1200, 770);
    play.mouseClicked(playSong);
    
    var reset = createButton("Reset");
    reset.position(1250, 770);
    reset.mouseClicked(resetSong);
    
    var stop = createButton("Stop");
    stop.position(1310, 770);
    stop.mouseClicked(function(){ 
        song_is_playing = false; 
    });
    
    // speed slider
    s_slider = createSlider(100, 2000, map(1000, 2000, 100, 100, 2000));
    s_slider.position(1000, 770);
    
        
}

function draw() {
    background(color(255));
    
    textSize(20);
    text("Final Project", 200, 50);
    
    textSize(14);
    // UI setup
    imageMode(CORNER);
    image(bagpipes_img, 100, 200, 500, 700);
    
    fill(color(0));
    ellipse(50, 150, 15, 15);
    text(" = closed hole", 65, 155);
    fill(color(255));
    ellipse(50, 200, 15, 15);
    fill(color(0));
    text(" = open hole", 65, 205);
    
    text("Bass Bourdon", b_slider.x - 100, 265);
    text("Tenor Bourdon", t_slider.x - 100, 315);
    text("Chanter", c_slider.x - 100, 365);
    
    text("Speed", s_slider.x - 40, 785);
    speed = map(s_slider.value(), 100, 2000, 2000, 100);
    
    // set volume different parts
    bass.setVolume(b_slider.value() / 100);
    tenor.setVolume(t_slider.value() / 100);
    if (current_tone) 
        current_tone.setVolume(c_slider.value() / 100);
    
    // tone settings
    noStroke();
    for (var i = 0; i < 7; i++) {
        if (current_tone && current_tone_index >= 0)
            fill(color(tone_settings[current_tone_index][i+1] * 255));
        else
            fill(color(255));
        ellipse(405 - i*tone_hole_positions[i+1][0], 645 + i*tone_hole_positions[i+1][1], 7, 7);
    }
    
    // bourdon volume drawing
    drawVolume(b_slider.value(), t_slider.value(), c_slider.value());
    

    
}

function playNewTone(index){
    if (!song_is_playing) {
        current_tone_index = index;
        if (current_tone) {
            current_tone.stop();
        } 
        current_tone = tones[index];
        current_tone.loop();
        current_tone.setVolume(c_volume);
    }
}

// add a new tone to the song
function addTone(index){
    if (inputs[index].value() > 0) {
        var new_div = createDiv(tone_names[index]);
        new_div.size(inputs[index].value() * 100, 50);
        new_div.style("background-color", tone_colors[index]);
        new_div.style("border", "solid");
        new_div.style("text-align", "center");
        note_div.child(new_div);
        new_div.position(song_length * 100,2.5);
        song_divs.push(new_div);
        
        song_length += parseFloat(inputs[index].value());
        
        for (var i = 0; i < parseFloat(inputs[index].value()); i++) {
            var new_tone = {
                    tone : tones[index],
                    index : index,
                    change : (i == 0)
                };
            song.push(new_tone);
        }
        
    }
    else {
        window.alert("please input an integer number greater than zero");
    }
}

// play the song made by the user
function playSong() {
    if (song_length > 0 && !song_is_playing) {
        song_is_playing = true;
        select("#note_div").elt.scrollLeft = 0;
        var current_tone_div = 0;
        var i = 0;
        var divgroup = 0;
        var myFunction = function() {
            if (!song_is_playing) {
                if (current_tone)
                    current_tone.stop();
                song_divs[current_tone_div - 1].style("background-color", tone_colors[song[i - 1].index]);
                console.log(current_tone_div + " " + i);
                return;
            }
            if ( i < song.length && (i - divgroup*8) >= 8) {
                divgroup++;
                select("#note_div").elt.scrollLeft += 800;
            }
            
            if (i == song.length) {
                current_tone.stop();
                song_divs[current_tone_div - 1].style("background-color", tone_colors[song[i-1].index]);
                song_is_playing = false;
                current_tone_index = -1;
            }
            else if(song[i].change) {
                if (current_tone) {
                    current_tone.stop();
                }
                current_tone = song[i].tone;
                current_tone_index = song[i].index;
                current_tone.setVolume(c_volume);
                current_tone.loop();
                
                if (current_tone_div > 0) song_divs[current_tone_div - 1].style("background-color", tone_colors[song[i-1].index]);
                song_divs[current_tone_div].style("background-color", color(255));
                current_tone_div++;
            }
            
            if (i < song.length) {
                setTimeout(myFunction, speed);
            }
            i++;
        };
        var interval = setTimeout(myFunction, speed); 
    }
}

function resetSong() {
    song = [];
    song_tones = [];
    song_times = [];
    for (var i =0; i < song_divs.length; i++) {
        song_divs[i].remove();
    }
    song_divs = [];
    song_length = 0;
    speed = 1000;
    s_slider.value(1000);
    song_is_playing = false;
    if (current_tone) current_tone.stop();
}

function setToneSettings() {
    // 1 = open
    // 0 = closed
    
    tone_settings[0] = [0, 0, 0, 0, 0, 0, 0, 0];
    tone_settings[1] = [0, 0, 0, 0, 0, 0, 0, 1];
    tone_settings[2] = [0, 0, 0, 0, 0, 0, 1, 1];
    tone_settings[3] = [0, 0, 0, 0, 0, 1, 1, 0];
    tone_settings[4] = [0, 0, 0, 0, 1, 1, 1, 0];
    tone_settings[5] = [0, 0, 0, 1, 0, 0, 0, 1];
    tone_settings[6] = [0, 0, 1, 1, 0, 0, 0, 1];
    tone_settings[7] = [0, 1, 1, 1, 0, 0, 0, 1];
    
    tone_hole_positions[0] = [7, 18];
    tone_hole_positions[1] = [7, 18];
    tone_hole_positions[2] = [7, 18];
    tone_hole_positions[3] = [7, 18];
    tone_hole_positions[4] = [7, 18];
    tone_hole_positions[5] = [7.5, 18.5];
    tone_hole_positions[6] = [8, 20.5];
    tone_hole_positions[7] = [8.5, 21];
}

function drawVolume(volume_b, volume_t, volume_c) {
    imageMode(CENTER);
    
    // bass bourdon
    if (volume_b > 0) {
        if (volume_b > 66) {
            image(smoke_img, 450, 185, 33, 33);
            image(smoke_img, 465, 145, 33, 33);
            image(smoke_img, 480, 105, volume_b - 66, volume_b - 66);
        }
        else if (volume_b > 33) {
            image(smoke_img, 450, 185, 33, 33);
            image(smoke_img, 465, 145, volume_b - 33, volume_b - 33);
        }
        else {
            image(smoke_img, 450, 185, volume_b, volume_b);
        }
    }
    
    // tenor bourdon
    if (volume_t > 0) {
        if (volume_t > 66) {
            image(smoke_img, 385, 285, 33, 33);
            image(smoke_img, 395, 245, 33, 33);
            image(smoke_img, 410, 205, volume_t - 66, volume_t - 66);
        }
        else if (volume_t > 33) {
            image(smoke_img, 385, 285, 33, 33);
            image(smoke_img, 395, 245, volume_t - 33, volume_t - 33);
        }
        else {
            image(smoke_img, 385, 285, volume_t, volume_t);
        }
    }
    
    // chanter
    if (volume_c > 0 && current_tone && current_tone.isPlaying()) {
        if (volume_c > 66) {
            drawRotatedImage(290, 910, 33);
            drawRotatedImage(280, 950, 33);
            drawRotatedImage(270, 990, volume_c - 66);
        }
        else if (volume_c > 33) {
            drawRotatedImage(290, 910, 33);
            drawRotatedImage(280, 950, volume_c - 33);
        }
        else {
            drawRotatedImage(290, 910, volume_c);
        }
    }
    
}

// draw rotated smoke image
function drawRotatedImage(x, y, size) {
    push();
    translate(x, y);
    rotate(PI);
    image(smoke_img, 0, 0, size, size);
    pop(CLOSE);
}


var songs = [];
var song, mic, soundFile, recorder;
var fireworks = [];
var gravity;
var keys = ["s", "d", "f", "g", "h", "j", "k"];
var keycodes = [83, 68, 70, 71, 72, 74, 75];
var buttons = [];
var hidden = [];
var sequence = "";
var players_turn = false;
var sequence_started = false;
var players_sequence = "";
var gameOver = false;
var lost = false;
var level = 3;
var displayMessage = false;
var videoPlay = true;
var video;
var betweenLevels = false;
var listenSound = false;
var state = 0;
var lives = 3;

function preload() {
    for (var i = 0; i < 5; i++) {
        songs[i] = loadSound('./sample' + (i+1).toString() + '.mp3');
    }
    song = loadSound('./song.mp3');
}


function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("myApp");
    
    for (var i = 0; i < songs.length; i++) {
        var button = createButton("type '" + keys[i] + "'");
        button.position(100 + i * 130, 100);
        button.attribute("onmousedown", "clickButton(" + i + ")");
        button.attribute("onmouseup", "releaseButton(" + i + ")");
        buttons.push(button);
        button.hide();
        hidden.push(i >= level);
    }
    
    var link = "../clips/" + localStorage.getItem("title") + "02.mp4"
    video = createVideo(link);
    video.hide();
    video.onended(betweenLevelsF);
    video.play();
    imageMode(CENTER);
    textAlign(CENTER);
    
    gravity = createVector(0, 0.2);
    
    // for final task 
    mic = new p5.AudioIn();
    recorder = new p5.SoundRecorder();
    recorder.setInput(mic);
    soundFile = new p5.SoundFile();
    song.onended(function(){listenSound = false;mic.start();});
        
    textFont('Georgia');
    textSize(20);
}

function draw() {
    if (videoPlay) {
        background(0);
        image(video, width/2, height/2);
    }
    else if (betweenLevels) {
        background(0, 25);
        textAlign(LEFT);
        if (displayMessage) {
            noStroke();
            fill(255);
            text(">> You unlocked a new sound!", width/2 - 140, height/2 - 100);
            
            // some decoration
            if (frameCount % 10 == 0) {
                var x = int(random(0, width));
                var y = int(random(0, height));
                fireworks.push(new Firework(x, y));
            }
            for (var i = fireworks.length - 1; i >= 0; i--){
                fireworks[i].update();
                fireworks[i].show();
                if (fireworks[i].done())
                    fireworks.splice(i,1);
            }
        }
        noStroke();
        fill(255);
        if (level === 3)
            text(">> You unlocked digital images!!", width/2 - 140, height/2 - 100);
        text(">> Click to continue with the game", width/2 - 140, height/2 - 70);
    }
    else {
        gamePlay();
    }
}

function betweenLevelsF() {
    betweenLevels = true;
    if (videoPlay) {
        video.remove();
        videoPlay = false;
    }
    else {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].hide();
        }
    }
    var button = createButton("Continue");
    button.position(width/2 - 60, height/2 - 60);
    button.mouseClicked(function() {
        button.remove();
        startGame();
        betweenLevels = false;
        displayMessage = false;
    });
}

function startGame() {
    for (var i = 0; i < buttons.length; i++) {
        if (!hidden[i]) {
            buttons[i].show();
            var x = width/2 - int(level/2) * 130;
            if (level % 2 == 0) {
                x += i * 130;
            }
            else {
                x += i * 130 - 60;
            }
            buttons[i].position(x, height/2);
        }
    }
}

function gameIsOver() {  
    gameOver = true;
    if (lives > 0) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].hide();
        }
        
        var button =  createButton("Try again");
        button.position(width/2 - 100, height/2);
        button.mouseClicked(function() {
            lost = false;
            gameOver = false;
            players_turn = false;
            button.remove();
            startGame();
        });
    }
    else {
        listenSound = true;
        
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].remove();
        }
        
        var button =  createButton("Try again");
        button.position(width/2 - 100, height/2);
        button.mouseClicked(function() {
            location.href = '../start.html';
        });
    }
}

function gamePlay() {
    if (!players_turn && !displayMessage) {
        background(0);
        noStroke();
        fill(255);
        if(!sequence_started) {
            generateSequence();
            sequence_started = true;
            playSequence();
        }
        else {
            fill(255);
            textAlign(CENTER);
            text(">> Listen carefully which melody the computer plays and then repeat.", width/2, height/2 - 70);
        }
    }
    else if (players_turn && !gameOver) {
        background(0);
        noStroke();
        fill(255);
        text(">> Repeat what the computer did.", width/2, height/2 - 70);
    }
    
    if (gameOver) {
        gameOverF();
    }
    else {
        var hearts = "";
        for (var i = 0; i < lives; i++) {
            hearts += " <3 ";
        }
        text("Lives: " + hearts, width/2, 50);
    }
}

function gameOverF() {
    noStroke();
    fill(255);
    if (lost) {
        if (lives > 0) {
            background(0);
            textAlign(LEFT);
            text(">> Wrong answer", width/2 - 200, height/2 - 100);
            if (lives > 1)
                text(">> You lost one life.  _  </3  _  Only " + lives + " lives left.", width/2 - 200, height/2 - 70);
            else 
                text(">> You lost one life.  _  </3  _  Only " + lives + " life left.", width/2 - 200, height/2 - 70);
            text(">> Listen and try again.", width/2 - 200, height/2 - 40);
        }
        else {        
            background(0);
            textAlign(LEFT);
            text(">> Game Over", width/2 - 250, height/2 - 100);
            text(">> You lost!", width/2 - 250, height/2 - 70);
            text(">> Boohoo. Now you have to start from the beginning again.", width/2 - 250, height/2 - 40);
        }
    }
    else {
        background(0, 25);
        // do the final task
        if (listenSound) {
            textAlign(LEFT);
            text(">> You won!", width/2 - 140, height/2 - 20);
            text(">> Now for the last task...", width/2 - 140, height/2 + 10);
            text(">> Listen carefully...", width/2 - 140, height/2 + 40);
            // some decoration
            if (frameCount % 10 == 0) {
                var x = int(random(0, width));
                var y = int(random(0, height));
                fireworks.push(new Firework(x, y));
            }
            for (var i = fireworks.length - 1; i >= 0; i--){
                fireworks[i].update();
                fireworks[i].show();
                if (fireworks[i].done())
                    fireworks.splice(i,1);
            }
            if (!song.isPlaying())
                song.play();
        }
        else {
            if (!mic.enabled) {
                text(">> Please enable your microphone to move on with the game.", width/2 - 240, height/2);
            }
            else if (state === 0 && mic.enabled) {
                text(">> Now try to repeat!!!", width/2 - 140, height/2 - 30);
                text(">> Come on! I know you can do it!", width/2 - 140, height/2);
                text(">> Recording...", width/2 - 140, height/2 + 30);
                var button =  createButton("Stop recording");
                button.position(width/2 - 60, height/2 + 50);   
                button.mouseClicked(function() {
                    button.remove();
                    recorder.stop();
                    mic.stop();
                    state++;
                });
                recorder.record(soundFile);
                state++;
            }
            else if (state === 1) {
                text(">> Now try to repeat!!!", width/2 - 140, height/2 - 30);
                text(">> Come on! I know you can do it!", width/2 - 140, height/2);
                text(">> Recording...", width/2 - 140, height/2 + 30);
            }
            else if (state === 2) {
                    soundFile.play(); // play the result!
                    var button =  createButton("Continue");
                    button.position(width/2 - 60, height/2 + 50); 
                    button.mouseClicked(function() {
                        location.href = "../end.html";
                    });
                    state++;
            } 
            else {
                text(">> This is how you sounded.", width/2 - 170, height/2 - 50);
                text(">> That was amazing!!!", width/2 - 170, height/2 - 20);
                text(">> Have you ever considered becoming a professional opera singer?", width/2 - 170, height/2 + 10);
                text(">> Click on the button to continue.", width/2 - 170, height/2 + 40);
                
                if (frameCount % 10 == 0) {
                    var x = int(random(0, width));
                    var y = int(random(0, height));
                    fireworks.push(new Firework(x, y));
                }
                for (var i = fireworks.length - 1; i >= 0; i--){
                    fireworks[i].update();
                    fireworks[i].show();
                    if (fireworks[i].done())
                        fireworks.splice(i,1);
                }
            }
        }
    }    
}

function playSample(i) {
    songs[i].play();
    buttons[i].addClass("active");
}

function endSample(i) {
    buttons[i].removeClass("active");
}

function clickButton(i) {
    if (players_turn && !hidden[i]) {
        playSample(i);
        players_sequence += keys[i];
        if(!sequence.startsWith(players_sequence)) {
            lives--;
            lost = true;
            gameIsOver();
        }
        else {
            if (players_sequence.length == sequence.length)  {
                if (level < songs.length) {
                    hidden[level] = false;
                    displayMessage = true;
                    betweenLevelsF();
                    level++;
                    players_turn = false;
                }
                else {
                    gameIsOver();
                    
                }
            }
        }
    }
}

function releaseButton(i) {
    endSample(i);
}

function keyReleased() {
    for(var i = 0; i < keycodes.length; i++) {
        if (keyCode === keycodes[i]) {
            releaseButton(i);
        }
    }
    return false;
}

function keyPressed(){
    for(var i = 0; i < keycodes.length; i++) {
        if (keyCode === keycodes[i]) {
            clickButton(i);
        }
    }
}

function playSequence() {
    var i = 0;
    var index = 0;
    var interval = setInterval(function() {
        if (i < sequence.length) {
            endSample(index);
            index = findIndex(sequence.charAt(i));
            playSample(index);
            i++;
        } 
        else if (i == sequence.length){
            i++;
            endSample(index);
        }
        else {            
            players_turn = true;
            sequence_started = false;
            clearInterval(interval);
        }
    }, 1000);
}

function findIndex(letter) {
    for (var i = 0; i < keys.length; i++){
        if(keys[i] === letter)
            return i;
    }
}

function generateSequence() {
    sequence = "";
    players_sequence = "";
    for (var i = 0; i < level + 1; i++) {
        sequence += keys[int(random(0, level))];
    }
}

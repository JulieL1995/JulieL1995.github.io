var videoPlay = true;
var video;
var titles = ["baby", "cat", "starwars", "matrix", "panda"];

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("myApp");
    
    video = createVideo("./clips/Opening.mp4");
    video.hide();
    video.onended(function() {
        videoPlay = false;
        var button = createButton("Start");
        button.position(width/2 - 60, height/2);
        button.mouseClicked(function() {
            var i = int(random(0, titles.length));
            var title = titles[i];
            localStorage.setItem("title", title);
            location.href = './Level1/level1.html';
        });
    });
    video.play();
    imageMode(CENTER);
    textAlign(CENTER);

}

function draw() {
    background(color(0));
    
    if (videoPlay) {
        image(video, width/2, height/2);
    }
    else {
        textSize(18);
        textFont('Georgia');
        fill(255);
        text(">> Bring back the digital content! Click 'Start' to start with the first level of the game: unlock text!", width/2, height/2 - 50);
    }
}

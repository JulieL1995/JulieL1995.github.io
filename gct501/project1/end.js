var videoPlay = true;
var video;
var titles = ["baby", "cat", "starwars", "matrix", "panda"];

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("myApp");
    
    var link = "./clips/" + localStorage.getItem("title") + "03.mp4";
    video = createVideo(link);
    video.hide();
    video.onended(function() {
        videoPlay = false;
        var button = createButton("Retry");
        button.position(width/2 - 60, height/2);
        button.mouseClicked(function() {
            location.href = 'start.html';
        });
    });
    video.play();
    imageMode(CENTER);
    textAlign(CENTER);

    textFont('Georgia');
    textSize(20);
}

function draw() {
    background(color(0));
    
    if (videoPlay) {
        image(video, width/2, height/2);
    }
    else {
        textAlign(LEFT);
        fill(255);
        text(">> You unlocked all the digital information! Yey! You can be very proud of yourself.", width/2 - 290, height/2 - 70);
        text(">> Now go play outside... or play the game again if you want to!", width/2 - 290, height/2 - 40);
    }
}

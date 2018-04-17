var img = [];
var imgs = [];
var img_nr =-1;
var clicked = false;
var xpos = 0;
var ypos = 0;
var rect_x = 0;
var rect_y = 0;
var won = false;
var level = 0;
var betweenLevels = false;
var gameOver = false;
var showVideo = false;
var c, painting, colors;
var texts = [">> You unlocked black and white images!", ">> You unlocked color images!", ">> You unlocked high resolution images!"];
var finished = false;
var showVideo = true;
var started = false;
var video;
var circles;

function preload() {
    
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("myApp");
    img[0] = loadImage('./blackwhite.jpeg');
    img[1] = loadImage('./color1.jpeg');
    img[2] = loadImage('./color2.jpeg');
    painting = loadImage('./painting.jpg');
    setPieces();
    c = 0;
    textAlign(CENTER);
    colors = ["#000000", "#B404AE", "#0000FF", "#04B404", "#FFFF00", "#FF0000", "#FFFFFF"]; 
    
    rect_x = width/2 - 250;
    rect_y = height/2 - 375;
    
    pixelDensity(1);
    circles = [];
    
    var link = "../clips/" + localStorage.getItem("title") + "01.mp4"
    video = createVideo(link);
    video.hide();
    video.onended(function() {
        showVideo = false;
        imageMode(CORNER);
        var button = createButton("Continue");
        button.position(width/2 - 60, height/2 - 60);
        button.mouseClicked(function() {
            button.remove();
            started = true;
        });
    });
    video.play();
    imageMode(CENTER);
    textAlign(CENTER);
    textFont('Georgia');
    textSize(18);
}

function draw() {
    if (!gameOver)
        background(0);
        
    
    if (showVideo) {
        image(video, width/2, height/2);
    }
    else if (!started) {
        fill(255);
        textAlign(LEFT);
        text(">> You unlocked all the text!! Now continue to unlock images!", width/2 - 240, height/2 - 100);
    }
    else if (!won) {
        noStroke();
        fill(255);
        text(">> Put the image back together.", rect_x + 120, 40);
        
        noFill();
        stroke(color(255));
        rect(rect_x, rect_y, 500, 750);
        line(rect_x, rect_y + 250, rect_x + 500, rect_y + 250);
        line(rect_x, rect_y + 500, rect_x + 500, rect_y + 500);
        line(rect_x + 250, rect_y, rect_x + 250, rect_y + 750);
    
        if (clicked && img_nr != -1) {
            imgs[img_nr].posx = mouseX - xpos + imgs[img_nr].prevposx;
            imgs[img_nr].posy = mouseY - ypos + imgs[img_nr].prevposy;
        }
        
        for (var i = 0; i < imgs.length; i++) {
            if (img_nr != i) {
                image(img[level], imgs[i].posx, imgs[i].posy, imgs[i].width, imgs[i].height, (i % 2)*imgs[i].width, int(i / 2) * imgs[i].height, imgs[i].width, imgs[i].height);
            }
        }
        if (img_nr != -1) {
            image(img[level], imgs[img_nr].posx, imgs[img_nr].posy, imgs[img_nr].width, imgs[img_nr].height, (img_nr % 2)*imgs[img_nr].width, int(img_nr / 2) * imgs[img_nr].height, imgs[img_nr].width, imgs[img_nr].height);
        }
    }
    else if (betweenLevels) {        
        // decoration
        decorate();        
        
        fill(0)
        rect(width/2 - 170, height/2 - 75, 340, 200);
        
        fill(255);
        textAlign(LEFT);
        text(texts[level-1], width/2 - 160, height/2 - 35);
        if (level < 3) 
            text(">> Continue to unlock more content.", width/2 - 160, height/2 - 15);
        else
            text(">> You won! Click the button to continue.", width/2 - 160, height/2 - 15);
    }
    else if (gameOver) {
        image(painting, 0, 30, width/2, 2*height/3);
        if (!finished) {
            noStroke();
            fill(255);
            textAlign(CENTER);
            text(">> Now for the final challenge... Try to copy this painting as best as you can!", 3*width/4 , 3*height/4);
            
            fill(color("#FFA500"));
            rect(0, (2*height/3) + 38, width/2 + 4, width/14 + 4);
            for (var i = 0; i < colors.length; i++) {
                fill(colors[i]);
                rect(i*(width/14) + 2, (2*height/3) + 40, width/14, width/14);
            }
        }
        else {
            fill(0);
            rect(0, (2*height/3) + 38, width/2 + 4, width/14 + 5);
            rect(0, 3*height/4 -20, width, 35);
            fill(255);
            textAlign(LEFT);
            text(">> Amazing! Which one is the real one? Which one did you make? I don't know. They look so much alike!", 50, (2*height/3) + 55);
            text(">> Click continue to go on with the game", 50, (2*height/3) + 75);
        }
        
    }
}

function setPieces() {
    var ids = [];
    imgs = [];
    for (var i = 0; i < 6; i++) {
        imgs[i] = {
            prevposx: 0,
            prevposy: 0,
            posx: 0,
            posy: 0,
            width: 250,
            height: 250
        };
    }
    
    for (var i = 0; i < 6; i++) {
        var id = setPosition(i, ids);
        ids.push(id);
    }
}

function mousePressed() {
    if (!gameOver) {
        img_nr = findImageNumber(mouseX, mouseY);
        if (img_nr != -1) {
            clicked = true;
            xpos = mouseX;
            ypos = mouseY;
        }
    }
    else {
        c = findColor(mouseX, mouseY);
    }
}

function mouseReleased() {
    if (!gameOver) {
        clicked = false;
        if (img_nr != -1) {
            setInGrid();
            imgs[img_nr].prevposx = imgs[img_nr].posx;
            imgs[img_nr].prevposy = imgs[img_nr].posy;
            img_nr = -1;
            won = checkGrid();
            
            if (won) {
                toNextLevel();
            }            
        }
    }
}

function findImageNumber(x, y) {
    for (var i = 0; i < imgs.length; i++) {
        if (x >= imgs[i].posx && x <= imgs[i].posx + imgs[i].width && y >= imgs[i].posy && y <= imgs[i].posy + imgs[i].height) {
            return i;
        }
    }
    return -1;
}

function setPosition(index, usedPositons) {
    var used = true;
    var id;
    while (used) {
        used = false;
        id = int(random(0, imgs.length));
    
        for (var i = 0; i < usedPositons.length; i++) {
            if (id === usedPositons[i])
                used = true;
        }
    }
    
    imgs[index].posx = (width/2 - 600) + ((id + 1) % 2) * 950;
    imgs[index].posy = 30 + int(id/2) * 270;
    imgs[index].prevposy = imgs[index].posy;
    imgs[index].prevposx = imgs[index].posx;
    
    return id;    
}

function setInGrid() {
    // check if center of image is in vakje
    var x = imgs[img_nr].posx + 125;
    var y = imgs[img_nr].posy + 125;
    
    var c = getColumn(x);
    var r = getRow(y);
    
    if (c != -1 && r != -1) {
        // check if place is free and move if necessary
        placeFree(c, r);
    
        // move nice in vakje
        imgs[img_nr].posx = rect_x + c * imgs[img_nr].width; 
        imgs[img_nr].posy = rect_y + r * imgs[img_nr].height;
    }
}

function getColumn(x) {
    if (x >= rect_x) {
        if (x <= rect_x + imgs[img_nr].width) {
            return 0;
        }
        else if (x <= rect_x + 2*imgs[img_nr].width) {
            return 1;
        }
    }
    return -1;
}

function getRow(y) {
    if (y >= rect_y) {
        if (y <= rect_y + imgs[img_nr].height)
            return 0;
        else if (y <= rect_y + 2 * imgs[img_nr].height)
            return 1;
        else if (y <= rect_y + 3 * imgs[img_nr].height)
            return 2;
    }
    return -1;
}

function checkGrid() {
    for (var i = 0; i < 6; i++) {
        if (imgs[i].posx != rect_x + (i % 2) * imgs[i].width)
            return false;
        if (imgs[i].posy != rect_y + int(i / 2) * imgs[i].height)
            return false;
    }
    return true;
}

function placeFree(col, row) {
    var x = rect_x + col * imgs[img_nr].width; 
    var y = rect_y + row * imgs[img_nr].height;
    
    for (var i = 0; i < imgs.length; i++) {
        if (i != img_nr) {
            if (x == imgs[i].posx && y == imgs[i].posy) {
                // move image
                imgs[i].posx = imgs[img_nr].prevposx;
                imgs[i].posy = imgs[img_nr].prevposy;
                imgs[i].prevposx = imgs[img_nr].prevposx;
                imgs[i].prevposy = imgs[img_nr].prevposy;
            }
        }
    }
}

function toNextLevel() {
    level++;
    imgs = [];
    if(level < 4) {
        betweenLevels = true;
    
        img[level-1].loadPixels();
        circles = [];
    
        var button = createButton("Continue");
        button.position(width/2 - 60, height/2);
        button.mouseClicked(function() {
            button.remove();
            betweenLevels = false;
            if (level < 3) {
                setPieces();
                won = false;
            }
            else {
                toNextLevel();
            }
            loop();
            stroke(0);
        });
    }
    else {
        // final
        background(0);
        var button = createButton("Finish");
        button.position(width/4, (2*height/3) + 50 + width/14);
        button.mouseClicked(function() {
                finished = true;
                removeElements();
                var button = createButton("Continue");
                button.position(width/4, (2*height/3) + 50 + width/14);
                button.mouseClicked(function() {
                    location.href = '../Level2/level2.html';
                });
            });
        fill(color('#F5F5DC'));
        rect(width/2 + 2, 30, width/2 - 2, 2*height/3);
        gameOver = true;
    }
}

function mouseDragged() { 
    if (gameOver && !finished) {
        if (mouseX > width/2 + 2 && pmouseX > width/2 + 2 && mouseY > 30 && pmouseY > 30 && pmouseY < 2*height/3 && mouseY < 2*height/3) {
            strokeWeight(10);
            stroke(colors[c]);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
}

function findColor(x, y) {
    if (x < width/2 && y > 2*height/3 + 40 && y < 2*height/3 + 40 + width/14) {
        for (var i = 0; i < colors.length; i++) {
            if (x < (i+1) * width/14)
                return i;
        }
    } 
    return c;
}

function decorate() {        
  var total = 25;
  var count = 0;
  var attempts = 0;

  while (count < total) {
    var newC = newCircle();
    if (newC !== null) {
      count++;
    }
    
    attempts++;
    if (attempts > 1000) {
      noLoop();
      break;
    }
  }

  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    if (circle.growing) {
      if (circle.edges()) {
        circle.growing = false;
      } 
      else {
        for (var j = 0; j < circles.length; j++) {
          var other = circles[j];
          if (circle !== other) {
            var d = dist(circle.x, circle.y, other.x, other.y);
            var distance = circle.r + other.r;

            if (d - 1 < distance) {
              circle.growing = false;
              break;
            }
          }
        }
      }
    }

    circle.show();
    circle.grow();
  }
}

function newCircle() {
  var x = random(0, img[level-1].width);
  var y = random(0, img[level-1].height);

  var xx = (x * height/img[level-1].height) + width/2 - 680 * height/img[level-1].height;
  var yy = y * height/img[level-1].height;
  
  var valid = true;
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var d = dist(xx, yy, circle.x, circle.y);
    if (d - 2 < circle.r) {
      valid = false;
      break;
    }
  }
  
  if (valid) {
    var index = (int(x) + int(y) * img[level-1].width) * 4;
    var r = img[level-1].pixels[index];
    var g = img[level-1].pixels[index+1];
    var b = img[level-1].pixels[index+2];
    var c = color(r,g,b);
    
    var newC = new Circle(xx, yy, color(c));
    circles.push(newC);
    /*if (newC !== null) {
    var c1 = new Circle(xx - 550, yy, color(c));
    var c2 = new Circle(xx + 550, yy, color(c));
    
    circles.push(c1);
    circles.push(c2);
    }*/
    return newC;
  } 
  else {
    return null;
  }
}

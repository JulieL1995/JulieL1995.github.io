//Copyright from Mingi Yeom at mingiyeom@kaist.ac.kr

//window: (left,top) = (0,0)
//date formet: word hint    (divided by whitespace)

TEXTSIZE = 32
WIDTH = 1600
HEIGHT = 900
MAXLIFE = 6
ALPHABETNUM = 26
FRAME = 30

//Inheritance == class Hangman:FakeShell{ ... }; (in cpp style)
var Hangman = function () {
  //initalize
  FakeShell.apply ( this, arguments );
  
  //
  //has already animation
  var off = 0;
  var life = MAXLIFE;
  var picture = [life];
  var animation = [life];
  var flag = 0;
  var maxStage = 2;
  var goStage = 1;
  var nowStage = 0;
  var word = '';
  var hint = '';
  var requestHint = 0;
  var dataTable;
  var alphabetUsed = [ALPHABETNUM];
  var discovered;
  this.init = function(){
    for(var i=0;i<life;++i) animation[i] = 1;
    for(var j=0;j<ALPHABETNUM;++j) alphabetUsed[j] = 0;
    discovered = [];
    life = MAXLIFE;
    requestHint = 0;
  }
  this.announce2 = function(){
    this.add_admin('====================');
    this.newline();
    this.add_admin('Hangman game is ');
    this.newline();
    this.add_admin('   player guess answer');
    this.newline();
    this.add_admin('      by suggesting letters');
    this.newline();
    this.add_admin('====================');
    this.newline();
    
  }
  this.announce =function(){
    this.newline();
    this.add_admin('     ===============');
    //this.add_admin('*=================================*');
    this.newline();
    this.add_admin('      || H A N G M A N ||')
    //this.add_admin('  _    _          _   _  _____ __  __          _   _ ');
    //this.add_admin('  _    _           _   _  ____ __ __            _   _ ');
    //this.newline();
    //this.add_admin(' | |  | |   /\   | \ | |/ ____|  \/  |   /\   | \ | |');
    //this.add_admin(' | |    | |   /\\     | \\  |  |/  ___|   \\/   |    /\\     | \\ |   |');
    //this.newline();
    //this.add_admin(' | |__| |  /  \  |  \| | |  __| \  / |  /  \  |  \| |');
    //this.add_admin(' | |__| |  /  \\    |   \\|  | |   __|  \\  /  |   /  \\    |  \\|   |');
    //this.newline();
    //this.add_admin(' |  __  | / /\ \ | . ` | | |_ | |\/| | / /\ \ | . ` |');
    //this.add_admin(' |  __  | / /\\ \\   |  . `  |  | |_  |  |\\/|  |  / /\\ \\   | . `  |');
    //this.newline();
    //this.add_admin(' | |  | |/ ____ \| |\  | |__| | |  | |/ ____ \| |\  |');
    //this.add_admin(' |  |  |  |/ __  \\ |  |\\   |  |__| |  |  |  | / __  \\ |  |\\   |');
    //this.newline();
    //this.add_admin(' |_|  |_/_/    \_\_| \_|\_____|_|  |_/_/    \_\_| \_|');
    //this.add_admin(' |_|  |_/_/    \\_\\_| \\_|\\____|_|  |_/_/     \\_\\_| \\_|');
    this.newline();
    this.add_admin('     ===============');
    this.newline();
    this.newline();
    this.add_admin('-----------------------------------');
    this.newline();
    this.add_admin('Welcome to hangman!!');
    this.newline();
    this.add_admin('If you want to start game,');
    this.newline();
    this.newline();
    this.add_admin('Write: \'play hangman\'');
    this.newline();
    this.add_admin('-----------------------------------');
    this.newline();
    this.newline();
    this.newline();
    this.add_admin('>> ');
  }
    
  this.command = function(input){
    if(off==1) return 0;
      
    //default
    input = typeof input !== 'undefined' ? input : this.getlast();
    
    if(flag==1) return 0;
    
    var realinput = input.substring(3,input.length);
    var inputLow = realinput.toLowerCase();
    switch(inputLow){
      case 'game':
        //this.add
        break;
      case 'play hangman':
        this.access();
        
        break;
      default:
        this.newline();
        this.add_admin('\''+realinput+'\' is not recognized as an internal or external command,');
        this.newline();
        this.add_admin('operable program or batch file.');
        
        break;
    }
    return 0;
  }
  
  this.cmd_whole = function(input){
    //default
    if(off==1) return 0;
    
    input = typeof input !== 'undefined' ? input : this.getlast();
    if(goStage>maxStage){
      background(0,0,0);
      off = 1;
      location.href = '../Level3/level3.html';
    }
    else if(goStage>nowStage && flag == 1){
      ++nowStage;
      this.clean();
      this.init();
      //reinit
      
      //this.announce();
      if(goStage==1) this.announce2();
      word = '';
      
    }
    else if(goStage==nowStage){
      this.cmd();
    }
    return 0;
  }
  
  this.cmd = function(input){
    //default
    input = typeof input !== 'undefined' ? input : this.getlast();
    
    if(word==''){
     return 0; 
    }
    else{
      var realinput = input.substring(3,input.length);
      if(realinput.length==1){
        var realinputASCII = realinput.charCodeAt(0);
        //find keyword
        if(((97<=realinputASCII)&&(realinputASCII<=122))||((65<=realinputASCII)&&(realinputASCII<=90))){
          var inputLow = realinput.toLowerCase();
          realinputASCII = inputLow.charCodeAt(0);
          if(alphabetUsed[realinputASCII-97]===0){
            alphabetUsed[realinputASCII-97] = 1;
            var collect = 0;
            var answerchar = 0;
            for(var i=0;i<word.length;++i){
              if(word[i].toLowerCase()==inputLow){
                discovered[i] = 1;
                ++collect;
                //break;
              }
              if(discovered[i]==1) ++answerchar;
            }
            if(answerchar==word.length){
              ++goStage;
              if(maxStage>=goStage){
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Congratulation!!! Collect Answer!');
              this.newline();
              this.newline();
              this.add_admin('The next level will open');
              this.newline();
              this.add_admin('Write \'Next Level\' to go next level');
              this.newline();
              this.add_admin('====================');
              }
              else{
                
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Congratulation!!! Collect Answer!');
              this.newline();
              this.newline();
              this.add_admin('The next stage will open');
              this.newline();
              this.add_admin('Write \'Next Stage\' to go next level');
              this.newline();
              this.add_admin('====================');
              }
            }
            if(collect === 0) {
              this.newline();
              this.add_admin('\''+ inputLow +'\' is wrong guess!');
              --life;
              if(life ===0){
                --nowStage;
                this.newline();
                this.newline();
                this.add_admin('====================');
                this.newline();
                this.add_admin('Add anykey to start stage!');
                this.newline();
                this.add_admin('====================');
                this.newline();
              }
            }
          }
          else{
            this.newline();
            this.add_admin('This is alreay used');
          }
        }
        else{
          --life;
          this.newline();
          this.add_admin('\''+ realinput +'\' is wrong guess!');
          if(life ===0){
              --nowStage;
              
              this.newline();
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Add anykey to start stage!');
              this.newline();
              this.add_admin('====================');
              this.newline();
          } 
        }
      }
        //answer!
      else if(realinput===word){
        for(var j=0;j<word.length;++j){
           discovered[j] = 1;
        }
        
        ++goStage;
        if(maxStage>=goStage){
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Congratulation!!! Collect Answer!');
              this.newline();
              this.newline();
              this.add_admin('The next level will open');
              this.newline();
              this.add_admin('Write \'Next Level\' to go next level');
              this.newline();
              this.add_admin('====================');
              }
              else{
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Congratulation!!! Collect Answer!');
              this.newline();
              this.newline();
              this.add_admin('The next stage will open');
              this.newline();
              this.add_admin('Write \'Next Stage\' to go next level');
              this.newline();
              this.add_admin('====================');
              }
      }
        //request hint!
      else if(realinput=='need hint'){
        this.newline();
        this.add_admin('This is hint');
        requestHint = 1;
       }
       else if(realinput!=''){
          --life;
          this.newline();
          this.add_admin('\''+ realinput +'\' is wrong guess!');
          if(life ===0){
              --nowStage;
              
              this.newline();
              this.newline();
              this.add_admin('====================');
              this.newline();
              this.add_admin('Add anykey to start stage!');
              this.newline();
              this.add_admin('====================');
              this.newline();
          }
      }
    }
    print(realinput);
    return 0;
  }
  
  //only use onces
  this.exit = function(){ flag = 0;}
  this.access = function(){ flag = 1; print('access');}
  
  //functions, after access function
  this.play = function(_word,_hint,_WposX,_WposY,_Wtextsize,_HposX,_HposY,_Htextsize){
    if(flag===0)
      return 0;
    
    this.show();
    this.play_alphabetcollect(1380*windowWidth/1902,250*windowHeight/936,40*windowWidth/1902);
    this.play_quiz(_word,_hint,_WposX,_WposY,_HposX,_HposY,_Wtextsize,_Htextsize);
    //play_characterimage();
    //play_hint();
    return 0;
  }
  this.play_quiz = function(_word,_hint,_WposX,_WposY,_HposX,_HposY,_Wtextsize,_Htextsize){
    _word = typeof _word !== 'undefined' ? _word : '' ;
    _hint = typeof _hint !== 'undefined' ? _hint : '' ;
    //not started
    if(word===''){
      word = _word;
      hint = _hint;
      discovered = [word.length];
      for(var i=0;i<word.length;++i) discovered[i]=0;
      print(word);
    }
    
    stroke(0,0,0);
    fill(255,255,255);
    _Wtextsize = _Wtextsize/nowStage;
    textSize(_Wtextsize);
    for(var j=0;j<word.length;++j){
      if(discovered[j]==1)
        text(word[j], _WposX+j*(_Wtextsize*1.3), _WposY);
      text('_', _WposX+j*(_Wtextsize*1.3), _WposY+_Wtextsize*0.08);
    }
    
    stroke(0,0,0);
    fill(255,255,255);
    textSize(_Htextsize);
    text('*-- Hint! --* (Type: \'need hint\')',_HposX,_HposY);
    if(requestHint == 1){
      textSize(_Htextsize*1.5);
      text('  Class: '+hint.toUpperCase(),_HposX,_HposY+2 * _Htextsize*1.1);
    }
    
  }
  
  this.play_alphabetcollect = function(_posX, _posY, _textsize){
    stroke(0,0,0);
    fill(255,255,255);
    textSize(_textsize);
    
    //A-Z
    for(var i=0;i<ALPHABETNUM;++i){
      if(alphabetUsed[i]===0)
        text(String.fromCharCode(65+i), _posX+(i%7)*(_textsize*1.3), _posY+parseInt(i/7)*(_textsize*1.3));
      text('_', _posX+(i%7)*(_textsize*1.3), _posY+parseInt(i/7)*(_textsize*1.3)+_textsize*0.08);
    }
  }
  this.play_characterimage = function (){
    if(flag===0) return 0;
    //for(var i=MAXLIFE; i>=life; --i){
    //  //if(animation === 0) animation[i]=0
    //  
    //}
    return 0;
  }
  this.show = function(){
    image(img[life], 800*windowWidth/1902, 40*windowHeight/936,504*windowWidth/1902,432*windowHeight/936);
  }
  this.getOff = function(){
    return off;
  }
  this.getStage = function(){
    return nowStage;
  }
};
  var f = function(){};
  f.prototype = FakeShell.prototype;
  Hangman.prototype = new f();
  var c = new Hangman();
  c.constructor // Object
  Hangman.prototype.constructor = Hangman;
  c.constructor // Child
//

//fake cmd setup
function FakeShell(posX, posY, _width, _height, textsize, erasercolor) {
  //stochastic
  var textlinenum = parseInt(_height/textsize)+1;
  
  var textstartpoint = 0;
  var textline = [textlinenum];
  var textcolor = '#ffffff';
  var textmaxlen = 20;
  var textsafe = 0;
  var lock = 1;
  
  this.initalize = function () {
    textSize(textsize);
    for (var i=0;i<textlinenum;++i){
      textline[i] = '';
    }
  }
  this.getlast = function(){
    return textline[textstartpoint];
  }
  this.unlock = function(){
    if(lock == 1) lock = 0;
  }
  
  this.clean = function(){
    for(var i=0;i<textlinenum;++i)
      textline[i] = '';
    
    //fill(0,0,0);
    //
  }
  
  this.refresh = function(){
    //color
    noStroke();
    fill(0,0,0);
    
    quad(posX, posY, posX+_width, posY, posX+_width, posY+ _height, posX, posY+ _height);
    
    stroke(0,0,0);
    fill(textcolor);
    textSize(textsize);
    for (var i=0;i<textlinenum;++i){
      text(textline[i], posX, posY+ _height-textsize*(1.2)*(i+1));
    }
    //fill(erasercolor);
    //quad(posX, 0, posX+_width, 0, posX+_width, posY, posX, posY);
    
  }
  this.add_admin = function(_key){
    var _textmaxsize = textmaxlen
    if(textline[textstartpoint].length<_textmaxsize)
      textline[textstartpoint] += _key;
  }
  this.add_user = function(_key){
    var _textmaxsize = textmaxlen+3
    if((lock===0)&&(textline[textstartpoint].length<_textmaxsize))
      textline[textstartpoint] += _key;
  }
  
  this.del = function(_key){
    if(textline[textstartpoint].length>3)
      textline[textstartpoint] = textline[textstartpoint].substring(0,textline[textstartpoint].length-1);
  }
  
  this.get = function(){
    print(textline[textstartpoint]);
  }
  
  //[head,tail)
  this.newline = function(head,tail){
    
    //default
    head = typeof head !== 'undefined' ? head : 0 ;
    tail = typeof tail !== 'undefined' ? tail : textlinenum ;
    
    for(var i=tail;i>0&&textstartpoint===0;--i){
      textline[i] = textline[i-1];
    }
    if(textstartpoint>0) --textstartpoint;
    
    //clear
    textline[textstartpoint]='';
    
  }

}


var myHangman;
var table = [2];
var words = [2];
var hints = [2];
var img=[6];
function preload(){
   table[0] = loadTable('assets/quiz1.csv', 'csv','header');
   table[1] = loadTable('assets/quiz2.csv', 'csv','header');
   img[0] = loadImage('assets/man0.png');
   img[1] = loadImage('assets/man1.png');
   img[2] = loadImage('assets/man2.png');
   img[3] = loadImage('assets/man3.png');
   img[4] = loadImage('assets/man4.png');
   img[5] = loadImage('assets/man5.png');
   img[6] = loadImage('assets/man6.png');
}

function setup() {
  //textFont('Georgia');
  frameRate(FRAME);
  myHangman = new Hangman(80*windowWidth/1902, 0, windowWidth, windowHeight-80*windowHeight/936, TEXTSIZE*windowWidth/1902, 0);
  createCanvas(windowWidth, windowHeight);
  myHangman.init();
  myHangman.initalize();
  
  for(var i=0;i<2;++i){
    words[i] = table[i].getColumn('answer');
    hints[i] = table[i].getColumn('hint');
  }
  //myHangman.play_quiz(random(words),random(hints),1060,440,60,200,200, 15);
}

function draw() {
  print('('+windowWidth+', '+windowHeight+')')
  
  if (myHangman.getOff()===0){
    background(0,0,0);
    
    if(frameCount===1){
      myHangman.announce();
      myHangman.unlock();
   }
  
    myHangman.refresh();
    myHangman.play(random(words[max(myHangman.getStage()-1,0)]),
    random(hints[max(myHangman.getStage()-1,0)]),680*windowWidth/1902,700*windowHeight/936,90*windowWidth/1902,1370*windowWidth/1902,510*windowHeight/936,25*windowWidth/1902);
  }
}


function keyTyped() {
  if (keyCode === ENTER) {
    //is it command?
    myHangman.command();
    myHangman.cmd_whole();
    
    myHangman.newline();
    myHangman.add_user('>> ');
  }
   else{
  myHangman.add_user(key);
  }
  
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    myHangman.del();
  }
}

function mouseClicked() {
  print('('+mouseX+', '+mouseY+')')
}

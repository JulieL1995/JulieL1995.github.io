    var context = new (window.AudioContext || window.webkitAudioContext)();

    var number_of_samples = 5;
    var buffers = new Array(number_of_samples); // 0 : kick, 1 : snare, 2 : hihat, 3 : omg, 5 : music
    var volume_id = new Array("kickVol","snareVol","hihatVol", "omgVol", "musicVol");
    var volume_label_id = new Array("kickVolLabel","snareVolLabel","hihatVolLabel", "omgVolLabel", "musicVolLabel");
    var urls = ["hit.mp3","whut.mp3","gasp.mp3","omg.mp3","celtic.mp3"];
    var gain_nodes = new Array(number_of_samples);

    for (i  = 0; i < number_of_samples; i++) {
        gain_nodes[i] = context.createGain();
        var vol = document.getElementById(volume_id[i]).value;
        gain_nodes[i].gain.value = db2gain(vol);
        document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + vol + 'dB'; 
    }
    
    for (i = 0; i < number_of_samples; i++) {
        (function(i) {
                var request = new XMLHttpRequest();
                request.open("Get",urls[i],true);   //  <---- replace this file with yours
                request.responseType = "arraybuffer";
                request.onload = function(){
                    context.decodeAudioData(request.response, function(buffer){buffers[i] = buffer;});
                }
                request.send();
        })(i);
    }

    window.onload=function(){
        window.addEventListener('keydown', function (key) {
            keyboardDown(key);
        }, false);

        window.addEventListener('keyup', function (key) {
            keyboardUp(key);
        }, false);
    }

    // plays sound
    // i = index in array buffers
    function playdrum(i) {
      var source = context.createBufferSource();
	  source.buffer = buffers[i];
	  source.start();
	  
	  source.connect(gain_nodes[i]);
	  gain_nodes[i].connect(context.destination);
    }

    function changegain(i,changedvalue){
        gain_nodes[i].gain.value = db2gain(changedvalue);
        document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + changedvalue + 'dB'; 
    }

    // db_gain is in decibel
    function db2gain(db_gain) {
        var gain = 1.0;
        gain = 10**(db_gain/20);
        return gain;
    }

    // keyboard mapping 
    function keyboardDown(key) {
        switch (key.keyCode) {
            case 65: //'a'
                var kickpad = document.getElementById("kickPad"); 
                kickpad.className = 'active';
                simulateClick(kickpad);
                break;
            case 83: //'s'
                var snarepad = document.getElementById("snarePad"); 
                snarepad.className = 'active';
                simulateClick(snarepad);
                break;
            case 76: //'l'
                var hihatpad = document.getElementById("hihatPad"); 
                hihatpad.className = 'active';
                simulateClick(hihatpad);
                break;
            case 79: //'o'
                var omgpad = document.getElementById("omgPad");
                omgpad.className = 'active';
                simulateClick(omgpad);
                break;
        }
    }

    function keyboardUp(key) {
        switch (key.keyCode) {
            case 65: //'a'
                var kickpad = document.getElementById("kickPad"); 
                kickpad.className = '';
                break;
            case 83: //'s'
                var snarepad = document.getElementById("snarePad"); 
                snarepad.className = '';
                break;
            case 76: //'l'
                var hihatpad = document.getElementById("hihatPad"); 
                hihatpad.className = '';
                break;
            case 79: //'o'
                var omgpad = document.getElementById("omgPad");
                omgpad.className = '';
                break;
        }
    }

    // simulated mousedown on buttons
    function simulateClick(element) {
        var event = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }
    
    var music_source = null;
    function playmusic() {
        if (!music_source) {
            music_source = context.createBufferSource();
            music_source.buffer = buffers[4];
            music_source.start();
	  
            music_source.connect(gain_nodes[4]);
            gain_nodes[4].connect(context.destination);
        }
    }

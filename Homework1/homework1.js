    var context = new (window.AudioContext || window.webkitAudioContext)();

    // beatbox samples
    var number_of_samples = 4;
    var buffers = new Array(number_of_samples); // 0 : kick, 1 : snare, 2 : hihat, 3 : omg
    var volume_id = new Array("kickVol","snareVol","hihatVol", "omgVol");
    var volume_label_id = new Array("kickVolLabel","snareVolLabel","hihatVolLabel", "omgVolLabel");
    var urls = ["kick.mp3","snare.mp3","hihat.mp3","omg.mp3"];
    var gain_nodes = new Array(number_of_samples);

    // background music
    var number_of_songs = 2;
    var buffer_music = new Array(number_of_songs);
    var url_music = ["celtic.mp3", "hiphop.mp3"];
    var gain_node_music = null;
    var current_song = -1;
    var current_sourceBuffer = null;

    // stuff for beatbox samples
    for (i  = 0; i < number_of_samples; i++) {
        gain_nodes[i] = context.createGain();
        var vol = document.getElementById(volume_id[i]).value;
        gain_nodes[i].gain.value = db2gain(vol);
        document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + vol + 'dB'; 
    }
    
    for (i = 0; i < number_of_samples; i++) {
        (function(i) {
                var request = new XMLHttpRequest();
                request.open("Get",urls[i],true);   
                request.responseType = "arraybuffer";
                request.onload = function(){
                    context.decodeAudioData(request.response, function(buffer){buffers[i] = buffer;});
                }
                request.send();
        })(i);
    }

    // stuf for music samples
    gain_node_music = context.createGain();
    gain_node_music.gain.value = db2gain(-12);
    document.getElementById("musicVolLabel").innerHTML = 'Volume:  -12dB'; 
    
    for (i = 0; i < number_of_songs; i++) {
        (function(i) {
                var request = new XMLHttpRequest();
                request.open("Get",url_music[i],true);   
                request.responseType = "arraybuffer";
                request.onload = function(){
                    context.decodeAudioData(request.response, function(buffer){buffer_music[i] = buffer;});
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
        
        var control = document.getElementById("fileChooseInput");
		control.addEventListener("change", addSong, false);
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
    
    function playmusic(i) {
            if (current_sourceBuffer) {
                current_sourceBuffer.disconnect();
                var song0 = document.getElementById("row" + current_song);
                song0.className = "clickable-row";
            }
            var song1 = document.getElementById("row" + i);
            song1.className = "active clickable-row";
            current_song = i;
            document.getElementById("currentSongPlaying").innerHTML = song1.innerHTML + " is playing";
            
            var music_source = context.createBufferSource();
            music_source.buffer = buffer_music[i];
            current_sourceBuffer = music_source;
            music_source.start(0,0);
	  
            music_source.connect(gain_node_music);
            gain_node_music.connect(context.destination);
    }
    
    function gain2db(gain_value) {
        var result = 1.0;
        result = 20.0 * Math.log(gain_value) / Math.log(10.0);
        return result;
    } 
    
    function volumeUp() {
        var current_vol_db = gain2db(gain_node_music.gain.value);
        if (Math.floor(current_vol_db+1) <= 0) {
            gain_node_music.gain.value = db2gain(current_vol_db + 1);
            document.getElementById("musicVolLabel").innerHTML = 'Volume:  ' + Math.floor(current_vol_db+1) + 'dB'; 
        }
    }
    
    function volumeDown() {
        var current_vol_db = gain2db(gain_node_music.gain.value);
        if (Math.floor(current_vol_db-1) >= -24) {
            gain_node_music.gain.value = db2gain(current_vol_db - 1);
            document.getElementById("musicVolLabel").innerHTML = 'Volume:  ' + Math.floor(current_vol_db-1) + 'dB';
        }
    }
    
    function pause() {
        if (current_sourceBuffer)
            context.suspend();
    }

    function play() {
        if (current_sourceBuffer) {
            context.resume();
        }
    }
    
    function replay() {
        if (current_song >= 0)
            playmusic(current_song);
    }
    
    function addSong(e) {
        var file = e.target.files[0];
        var fileReader = new FileReader();
        fileReader.onload = fileLoaded;
        fileReader.readAsArrayBuffer(file);
        
        var table = document.getElementById("musicTable");
        var new_song = table.insertRow(number_of_songs);
        new_song.innerHTML = "<td>" + document.getElementById("fileChooseInput").value + "</td>";
        new_song.setAttribute("id", "row"+number_of_songs);
        new_song.setAttribute("class", "clickable-row");
        new_song.setAttribute("onclick", "playmusic("+number_of_songs+")");
        number_of_songs++;
        document.getElementById("fileChooseInput").value = null;
    }
    
    function fileLoaded(e) {
        context.decodeAudioData(e.target.result, function(buffer) { buffer_music.push(buffer); });
    }
    

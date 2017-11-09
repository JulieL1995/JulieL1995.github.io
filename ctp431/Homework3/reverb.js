var Reverb = function(context, parameters, delay) {

	this.context = context;
    //this.input = context.createGain();
    
    // create nodes
    this.reverb = context.createConvolver();
    var myBuffer;
    var request = new XMLHttpRequest();
    request.open("GET", "./Homework3/cathedral.mp3", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        context.decodeAudioData( request.response, 
            function(buffer) { myBuffer = buffer; } );
    }
    request.send();
    this.reverb.buffer = myBuffer;
    
    this.dryGain = context.createGain();
    this.wetGain = context.createGain();
    
    // connect
    //this.input.connect(this.reverb);
    delay.wetGain.connect(this.reverb);
    delay.dryGain.connect(this.reverb);
    this.reverb.connect(this.wetGain);
    delay.wetGain.connect(this.dryGain);
    delay.dryGain.connect(this.dryGain);
    
    this.wetGain.gain.value = parameters.reverbWetDry;
    this.dryGain.gain.value = (1-parameters.reverbWetDry);
    
    this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);

    /*
     var audio = document.getElementById('music');
    var context = new AudioContext();
    var source = context.createMediaElementSource(audio);
    var convolver = context.createConvolver();
    var irRRequest = new XMLHttpRequest();
    irRRequest.open("GET", "hall.mp3", true);
    irRRequest.responseType = "arraybuffer";
    irRRequest.onload = function() {
        context.decodeAudioData( irRRequest.response, 
            function(buffer) { convolver.buffer = buffer; } );
    }
    irRRequest.send();
// note the above is async; when the buffer is loaded, it will take effect, but in the meantime, the sound will be unaffected.

    source.connect( convolver );
    convolver.connect( context.destination );
     */

	this.parameters = parameters;
}


Reverb.prototype.updateParams = function (value) {

	this.parameters.reverbWetDry = value;

}


 

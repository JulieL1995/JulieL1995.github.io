var Reverb = function(context, parameters, delay) {

	this.context = context;
    
    // create nodes
    var reverb = context.createConvolver();
    var request = new XMLHttpRequest();
    request.open("GET", "./Homework3/cathedral.mp3", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        context.decodeAudioData( request.response, 
            function(buffer) { 
                reverb.buffer = buffer; 
                
            } );
    }
    request.send();
    
    this.dryGain = context.createGain();
    this.wetGain = context.createGain();
    
    // connect
    
    delay.dryGain.connect(reverb);
    delay.wetGain.connect(reverb);
    
    reverb.connect(this.wetGain);
    
    delay.wetGain.connect(this.dryGain);
    delay.dryGain.connect(this.dryGain);
    
    this.wetGain.gain.value = parameters.reverbWetDry;
    this.dryGain.gain.value = 1 - parameters.reverbWetDry;
    
    this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);

	this.parameters = parameters;
}


Reverb.prototype.updateParams = function (value) {

	this.parameters.reverbWetDry = value;
    this.wetGain.gain.value = value;
    this.dryGain.gain.value = 1 - value;

}


 

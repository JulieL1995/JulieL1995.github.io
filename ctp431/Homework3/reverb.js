var Reverb = function(context, parameters, delay) {

	this.context = context;
    this.input = context.createGain();
    
    // create nodes
    this.reverb = context.createConvolver();
    var myBuffer;
    var request = new XMLHttpRequest();
    request.open("GET", "./Homework3/cathedral.mp3", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        context.decodeAudioData( request.response, 
            function(buffer) { 
                if (!buffer){window.alert("problem with buffer");}
                myBuffer = buffer; 
                
            } );
    }
    request.send();
    this.reverb.buffer = myBuffer;
    
    
    this.dryGain = context.createGain();
    this.wetGain = context.createGain();
    
    // connect
    delay.wetGain.connect(this.input);
    //delay.dryGain.connect(this.input);
    this.input.connect(this.reverb);
  /*  this.reverb.connect(this.wetGain);
    delay.wetGain.connect(this.dryGain);
    delay.dryGain.connect(this.dryGain);
    
    this.wetGain.gain.value = parameters.reverbWetDry;
    this.dryGain.gain.value = 1 - parameters.reverbWetDry;
    
    this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);*/
  
    this.reverb.connect(this.context.destination);

	this.parameters = parameters;
}


Reverb.prototype.updateParams = function (value) {

	this.parameters.reverbWetDry = value;
    this.wetGain.gain.value = value;
    this.dryGain.gain.value = 1 - value;

}


 

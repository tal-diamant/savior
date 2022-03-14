//***************************
//        FUNCTIONS
//***************************

//--------------------
//  Math functions
//--------------------

//generates a random number between 0 (inclusive) and the chosen number (exclusive).
function random(integer){
	var  rNumber = Math.random() * integer;
	return rNumber;
}

//generates a random integer between 0 (inclusive) and the chosen integer (inclusive).
function irandom_inc(integer){
	var  rNumber = Math.floor(Math.random() * (integer+1));
	return rNumber;
}

//generates a random integer between 0 (inclusive) and the chosen integer (exclusive).
function irandom(integer){
	var  rNumber = Math.floor(Math.random() * integer);
	return rNumber;
}

//generates a random integer between int1 (inclusive) and int2 (inclusive).
function irandom_range(int1,int2){
	var diff = int2-int1+1 //*
	var rNumber = Math.floor(Math.random() * diff)+ int1; 
	return rNumber;
}

//generates a random integer between int1 (inclusive) and int2 (inclusive) and gives it a random sign (+,-)
function random_sign(int1,int2){
	var diff = int2-int1+1;
	var rNumber = Math.floor(Math.random() * diff)+ int1;
	if(random(1)){
		return rNumber;
	} else {
		return -rNumber;
	}
}

//distance between 2 points
function distance(x1,y1,x2,y2){
	var dis;
	dis = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
	return dis;
}

//-----------------------
//   Other functions
//-----------------------


//easily draw text to the screen
function draw_text(string,x,y){
	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText(string,x,y);
}

//track mouse position
function track_mouse(event){
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

//play sounds (using a sound object instance)
function play_sound(sound){
	var temp, path;
	temp = new Audio();
	info = sound.split(" "); //the sound parameter is a single string containing 2 pieces of information. we split it up into an array with 2 elements so we can use each piece by itself.
	temp.src = info[0];
	temp.volume = Number(info[1]);
	temp.play();
}

//-------------------
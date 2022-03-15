var assets = [
	{ type: 'img', name: 'name1', url: './data/images/slash.png' },
	{ type: 'img', name: 'name2', url: './data/images/enemy_ready.png' },
	{ type: 'img', name: 'name3', url: './data/images/enemy_hit.png' },
	{ type: 'img', name: 'name4', url: './data/images/enemy.png' },
	{ type: 'img', name: 'name5', url: './data/images/attack_signal.png' },
	{ type: 'img', name: 'name6', url: './data/images/grass_field.jpg' },
	{ type: 'img', name: 'name7', url: './data/images/enemy_def.png' },
	{ type: 'audio', name: 'name1', url: './data/sounds/back.wav', volume: 0.1 },
	{ type: 'audio', name: 'name2', url: './data/sounds/defeat.mp3', volume: 0.3 },
	{ type: 'audio', name: 'name3', url: './data/sounds/defense.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/enemy_defense.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/enemy_dies.wav', volume: 0.2 },
	{ type: 'audio', name: 'name3', url: './data/sounds/hurt.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/navigate.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/select.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/slash.wav', volume: 0.1 },
	{ type: 'audio', name: 'name3', url: './data/sounds/victory.mp3', volume: 0.3 },
	{ type: 'audio', name: 'name3', url: './data/music/combat.mp3', volume: 0.3 },
];

function preload() {
	//create image and audio objects
	var img = new Image();
	var aud = new Audio();
	
	//keeps track of pregression
	var i = 0;

	//add listeners to the objects
	img.addEventListener("load", loadAsset);
	aud.addEventListener("canplaythrough", loadAsset);
	
	//load first asset
	loadAsset();

	function loadAsset() {
		//when all assets are loaded
		if(i >= assets.length) {
			loadedSofar = 100;
			assetsLoaded = true;
			return;
		}

		//name the asset for convinience
		var asset = assets[i]

		//show progress on screen (this will not not be part of the final function)
		loadedSofar = Math.floor(i/assets.length*100);
		
		//increment i as we're done with it for the remainder of this function run
		i++;

		//differentiate between the loading of different resources
		if(asset.type === 'img') {
			img.src = asset.url
		} else if(asset.type === 'audio') {
			aud.src = asset.url
		}
	}
}

function drawLoadingBar() {
	var width = 700, height = 60, x = c.width/2-width/2, y = c.height/2-200;
	var loaded = loadedSofar/100;
	
	ctx.fillStyle = "grey";
	ctx.fillRect(x,y,width,height);
	ctx.fillStyle = "lightgreen";
	ctx.fillRect(x,y,width*loaded,height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(x,y,width,height);
	
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	draw_text(loadedSofar+"% / 100%",c.width/2,y+20);
}

function promptUserToClick() {
	var y = c.height/2-200;
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	draw_text("Click anywhere to start",c.width/2,y+100);	
}
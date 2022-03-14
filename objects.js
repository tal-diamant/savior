

function Player(){
	this.maxHealth = 100;
	this.health = 100;
	this.finalDamage = 0;
	this.incomingDamage = 0;
	this.damage = 5;
	this.hitReady = 1;
	this.hitCooldown = fps*1.5;
	
	this.obj_class = "player";
	this.hurtHud = 0;
	this.hurtHudWidth = 60;
	this.alphaVal = 1;
	this.color = "red";
	this.fadeRate = 1/fps;
	this.dynamicW = 500;
	this.lastPressed = "";
	this.x = c.width/2;
	this.y = c.height -100;
	this.dmgNmbrsList = [];
	this.alarm = [-1,-1];
	this.defChance = 0; //becomes active for a short time after you get the attack signal
	this.defend = 0; //changes when pressing defend succesfuly
	this.defended = 0; //changes to show the defence Hud
	this.incomingAtkType = 0;
	
	//methods
	
	//1
	this.update = function(){
		this.display_health();
		this.x = c.width/2;
		this.y = c.height -100;
		if(this.alarm[1] > 0){
			this.display_cooldown();
		}
		//this.debugText();
		if( (this.hurtHud == 1) || (this.defended == 1) ){
			this.fade(this.defended);
		}
		this.countdown();
	}
	
	//2
	this.display_health = function (){
		var width = 500, height = 30;
		if(width*this.health/this.maxHealth < this.dynamicW) {this.dynamicW -= 1;}
		
		ctx.fillStyle = "grey";
		ctx.fillRect(c.width/2-width/2,c.height-100,width,height);
		ctx.fillStyle = "rgb(170,0,0)";
		ctx.fillRect(c.width/2-width/2,c.height-100,this.dynamicW,height);
		ctx.fillStyle = "red";
		ctx.fillRect(c.width/2-width/2,c.height-100,width*this.health/this.maxHealth,height);
		ctx.strokeStyle = "black";
		ctx.strokeRect(c.width/2-width/2,c.height-100,width,height);
	}
	
	//3
	this.hurt = function(){
		this.hurtHud = 1;
		if(this.health > 0){
			this.incomingDamage = enemy.damage;
			this.finalDamage = this.incomingDamage;
			this.health -= this.finalDamage;
			this.dmgNumbers();
			play_sound(sound.hurt);
		}
		if(this.health < 0){
			this.health = 0;
		}
	}
	
	
	//4
	this.fade = function(def){
		switch(def){
			case 0:
				if(this.alphaVal > 0.017){
					this.alphaVal -= this.fadeRate;
					this.display_hurtHud();
				} else {
					this.hurtHud = 0;
					this.alphaVal = 1;
				}
			break;
			
			case 1:
				if(this.alphaVal > 0.017){
					this.alphaVal -= this.fadeRate;
					this.display_defHud();
				} else {
					this.defended = 0;
					this.alphaVal = 1;
				}
			break;
		}
	}
	
	//5
	this.display_hurtHud = function(){
		ctx.fillStyle = "rgba(255,0,0,"+this.alphaVal.toString()+")";
		ctx.fillRect(0,0,c.width,this.hurtHudWidth); //top bar
		ctx.fillRect(0,this.hurtHudWidth,this.hurtHudWidth,c.height); //left bar
		ctx.fillRect(c.width-this.hurtHudWidth,this.hurtHudWidth,this.hurtHudWidth,c.height-this.hurtHudWidth); //right bar
		ctx.fillRect(this.hurtHudWidth,c.height-this.hurtHudWidth,c.width-this.hurtHudWidth*2,this.hurtHudWidth); //bottom bar
	}
	
	//6
	this.attacked = function(atk_type){
		this.defChance = 1;
		modeIndicator.change_sprite(this.defChance);
		this.incomingAtkType = atk_type;
		this.alarm[0] = fps*1;
	}
	
	//7
	this.input = function(event){
		this.lastPressed = event.keyCode;
		if( ((event.keyCode - 96) >= 1) && ((event.keyCode - 96) <= 9) ){
			if(this.health > 0){
				//launch attack based on player input
				if( (this.defChance == 0) && (this.hitReady == 1) ){
					enemy.get_attacked((event.keyCode - 96));
					instances.push(new Slash());
					play_sound(sound.slash);
					this.hitReady = 0;
					this.alarm[1] = this.hitCooldown;
				}
				//check if player defends succesfuly
				if( ((event.keyCode-96) == this.incomingAtkType) && (this.defChance == 1) ){
					this.defend = 1;
					this.incomingAtkType = 0;
				} else if( ((event.keyCode-96) != this.incomingAtkType) && (this.defChance == 1) ){
					this.defChance = 0;
					modeIndicator.change_sprite(this.defChance);
				}
			}
		}		
	}
	
	//8
	this.debugText = function(){
		ctx.textAlign = "start";
		draw_text("Key Code: "+this.lastPressed.toString(),30,20);
	}
	
	//9
	this.dmgNumbers = function(){
		instances.push(new DamageNumbers(player,this.finalDamage));
	}
	
	//10
	this.countdown = function(){
		var i;
		for(i = 0;i < this.alarm.length;i++){
			if(this.alarm[i] > 0){
				this.alarm[i] -= 1;
			} else if(this.alarm[i] == 0){
				this.alarms(i);
				this.alarm[i] = -1;
			}
		}
	}
	
	//11
	this.alarms = function(i){
		switch(i){
			
			//alarm[0]
			case 0:
				this.defChance = 0;
				modeIndicator.change_sprite(this.defChance);
				if(this.defend == 1){
					this.blocked();
					this.defend = 0;
				} else{
					this.hurt();
				}
			break;
			
			//alarm[1]
			case 1:
				this.hitReady = 1;
			break;
		}
	}
	
	//12
	this.display_defHud = function(){
		ctx.fillStyle = "rgba(0,0,255,"+this.alphaVal.toString()+")";
		ctx.fillRect(0,0,c.width,this.hurtHudWidth); //top bar
		ctx.fillRect(0,this.hurtHudWidth,this.hurtHudWidth,c.height); //left bar
		ctx.fillRect(c.width-this.hurtHudWidth,this.hurtHudWidth,this.hurtHudWidth,c.height-this.hurtHudWidth); //right bar
		//ctx.fillRect(this.hurtHudWidth,c.height-this.hurtHudWidth,c.width-this.hurtHudWidth*2,this.hurtHudWidth); //bottom bar
	}
	
	//13
	this.blocked = function(){
		this.defended = 1;
		play_sound(sound.defense);
	}
	
	//14
	this.display_cooldown = function(){
		var width = 300, height = 15;
		var dynamicWidth = width - ((this.alarm[1]/(this.hitCooldown))*width);
		
		ctx.fillStyle = "grey";
		ctx.fillRect(c.width/2-width/2,c.height-60,width,height);
		ctx.fillStyle = "rgb(100,255,100)";
		ctx.fillRect(c.width/2-width/2,c.height-60,dynamicWidth,height);
		ctx.strokeStyle = "black";
		ctx.strokeRect(c.width/2-width/2,c.height-60,width,height);
	}
}

function Enemy(){
	//game related
	this.maxHealth = 100;
	this.health = 100;
	this.hitReady = 1;
	this.attacking = 0;
	this.damage = 34;
	this.incomingDamage = 0;
	this.finalDamage = 0;
	this.name = "Renegade Soldier";
	
	//backstage code
	this.imgW = 232;
	this.x = c.width/2-this.imgW/2;
	this.y = c.height/2+20;
	this.alphaVal = 1;
	this.alarm = [-1,-1,-1,-1,-1]; //5 alarms (0 - 4)
	this.random_hit;
	this.dynamicW = 700;
	this.obj_class = "enemy";
	this.alphaVal2 = 1;
	this.fadeRate = 2/fps;
	
	//image stuff
	this.img = new Image();
	this.img.src = image_lib.enemy;
	this.ball_img = new Image();
	this.ball_img.src = image_lib.signal_attack;
	
	//methods
	
	//1
	this.update = function(){
		this.display();
		this.display_health();
		this.hit();
		this.timer();
		if(this.attacking == 1 && this.alphaVal > 0){
			this.signal_attack();
		}
		if(this.health == 0){
			this.death_fade();
		}
	}
	
	//2
	this.display = function(){
		this.x = c.width/2-this.imgW/2, this.y = c.height/2+20;
		ctx.globalAlpha = this.alphaVal2;
		ctx.drawImage(this.img,this.x,this.y);
		ctx.globalAlpha = 1;
	}
	
	//3
	this.display_health = function (){
		var width = 700, height = 60;
		if(width*this.health/this.maxHealth < this.dynamicW) {this.dynamicW -= 1;}
		
		ctx.fillStyle = "grey";
		ctx.fillRect(c.width/2-width/2,100,width,height);
		ctx.fillStyle = "rgb(170,0,0)";
		ctx.fillRect(c.width/2-width/2,100,this.dynamicW,height);
		ctx.fillStyle = "red";
		ctx.fillRect(c.width/2-width/2,100,width*this.health/this.maxHealth,height);
		ctx.strokeStyle = "black";
		ctx.strokeRect(c.width/2-width/2,100,width,height);
		
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		draw_text(this.name,c.width/2,115);
	}
	
	//4
	this.hit = function(){
		if( (this.hitReady == 1) && (player.health > 0) && (this.health > 0) ){
			this.attacking = 1;
			this.random_hit = irandom(9)+1;
			player.attacked(this.random_hit);
			this.hitReady = 0;
			this.img.src = image_lib.enemyReady;
			this.alarm[0] = fps*1;
			this.alarm[1] = fps*2;
		}
	}
	
	//5
	this.signal_attack = function(){
		switch(this.random_hit){
			case 7:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x,this.y-50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 8:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+100,this.y-50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 9:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+200,this.y-50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 4:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x,this.y+50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 5:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+100,this.y+50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 6:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+200,this.y+50);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 1:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x,this.y+150);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 2:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+100,this.y+150);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
			case 3:
				ctx.globalAlpha = this.alphaVal
				ctx.drawImage(this.ball_img,this.x+200,this.y+150);
				ctx.globalAlpha = 1;
				this.alphaVal -= 1/60;
			break;
		}
	}
	
	//6
	this.timer = function(){
		for(i = 0;i < 5;i++){
			if(this.alarm[i] > 0){
				this.alarm[i] -= 1;
			} else if (this.alarm[i] == 0){
				this.alarm[i] = -1;
				this.alarms(i);
			}
		}
	}
	
	//7
	this.alarms = function(i){
		switch(i){
			case 0:
				this.attacking = 0;
				this.alphaVal = 1;
				this.img.src = image_lib.enemyHit;
				this.alarm[2] = Math.floor(fps * 0.1);
			break;
			
			case 1:
				this.hitReady = 1;
			break;
			
			case 2:
				this.img.src = image_lib.enemy;
			break;
			
			case 3:
				
			break;
			
			case 4:
				
			break;
		}
	}
	
	//8
	this.get_attacked = function(atk_type){
		if(this.health > 0){
			if( atk_type != (irandom(9)+1) ){
				this.incomingDamage = player.damage;
				this.finalDamage = this.incomingDamage;
				this.health -= this.finalDamage;
				this.dmgNumbers();
			} else {
				this.display_defense();
				play_sound(sound.enemy_defense);
			}
			if(this.health <= 0){
				this.change_name();
				play_sound(sound.enemy_dies);
			}
		}
		if(this.health < 0){
			this.health = 0;
		}
	}
	
	//9
	this.dmgNumbers = function(){
		instances.push(new DamageNumbers(enemy,this.finalDamage));
	}
	
	//10
	this.display_defense = function(){
		instances.push(new Enemy_Defence());
	}
	
	//11
	this.death_fade = function(){
		if(this.alphaVal2 > this.fadeRate){
			this.alphaVal2 -= this.fadeRate;
		}
	}
	
	//12
	this.change_name = function(){
		this.name = "";
	}
}

function DamageNumbers(damagedPerson/*instance*/,dmg/*integer*/){
	this.damage = dmg;
	this.x = damagedPerson.x - 20;
	this.y = damagedPerson.y - 30;
	this.life = fps*1;
	this.obj_class = "damage_numbers";
	
	//methods
	
	//1
	this.update = function(){
		this.draw_numbers();
		this.move();
		this.decay();
	}
	
	//2
	this.draw_numbers = function(){
		if(damagedPerson == enemy){
			ctx.textAlign = "start";
			draw_text("-"+this.damage.toString(),this.x+117,this.y-10);
		} else {
			ctx.textAlign = "start";
			draw_text("-"+this.damage.toString(),this.x,this.y);
		}
	}
	
	//3
	this.move = function(){
		this.y -= 1;
	}
	
	//4
	this.decay = function(){
		if(this.life > 0){
			this.life -= 1;
		} else {
			this.destroy_self();
		}
	}
	
	//5
	this.destroy_self = function(){
		var i;
		for(i = 0;i < instances.length;i++){
			if(instances[i].obj_class == "damage_numbers"){
				if(instances[i].life <= 0){
					instances.splice(i,1);
				}
			}
		}
	}
}

function Slash(){
	//properties
	this.obj_class = "slash";
	this.frame = 0;
	this.x = enemy.x;
	this.y = enemy.y;
	this.frameRate = fps/3; //frames per second
	this.frameRateCalculator = Math.ceil(fps/this.frameRate);
	this.counter = 0;
	
	//image stuff
	this.img = new Image();
	this.img.src = image_lib.slash;
	
	//methods
	
	//1
	this.update = function(){
		this.display();
		this.frames_per_second();
	}
	
	//2
	this.display = function(){
		var width = 232;
		ctx.drawImage(this.img,this.frame*width,0,width,this.img.naturalHeight,this.x,this.y,width,this.img.naturalHeight);
	}
	
	//3
	this.change_frame = function(){
		this.frame += 1;
		if(this.frame == 3){
			this.destroy_self();
		}
	}
	
	//4
	this.destroy_self = function(){
		var i;
		for(i = 0;i < instances.length;i++){
			if(instances[i].obj_class == "slash"){
				instances.splice(i,1);
			}
		}
	}
	
	//5
	this.frames_per_second = function(){
		if(this.counter == this.frameRateCalculator){
			this.change_frame();
			this.counter = 0;
		} else {
			this.counter += 1;
		}
	}
}

function Enemy_Defence(){
	//properties
	this.obj_class = "enemy_defense";
	this.alphaValue = 1;
	this.fadeRate = 1/fps; // 1/fps = complete fade after 1 second
	this.x = enemy.x -35;
	this.y = enemy.y -25;
	
	//image stuff
	this.img = new Image();
	this.img.src = "./data/images/enemy_def.png";
	
	//methods
	
	//1
	this.update = function(){
		this.display();
		this.fade();
	}
	
	//2
	this.display = function(){
		ctx.globalAlpha = this.alphaValue;
		ctx.drawImage(this.img,this.x,this.y);
		ctx.globalAlpha = 1;
	}
	
	//3
	this.fade = function(){
		if(this.alphaValue > this.fadeRate){
			this.alphaValue -= this.fadeRate;
		} else {
			this.destroy_self();
		}
	}
	
	//4
	this.destroy_self = function(){
		var i;
		for(i = 0;i < instances.length;i++){
			if(instances[i].obj_class == "enemy_defense"){
				instances.splice(i,1);
			}
		}
	}
}

function Mode_Indicator(){
	//properties
	this.obj_class = "mode_indicator"
	this.x = c.width/2 -146/2;
	this.y = 200;
	
	//image stuff
	this.img = new Image();
	this.sprites = ["./data/images/defence_mode.png","./data/images/attack_mode.png"];
	this.img.src = this.sprites[0];
	this.switcher = 0;
	
	//methods
	
	//1
	this.update = function(){
		if( (player.health > 0) && (enemy.health > 0) ){
			this.display();
		}
	}
	
	//2
	this.display = function(){
		this.x = c.width/2 -146/2;
		this.y = 200;
		ctx.drawImage(this.img,this.x,this.y);
	}
	
	//3
	this.change_sprite = function(defChance){
		if(defChance == 0){
			this.switcher = 1;
		} else {
			this.switcher = 0;
		}
		this.img.src = this.sprites[this.switcher];
	}
}

function Game_Control(){
	//properties
	this.obj_class = "controler";
	this.lastPressed = "";
	this.runOnCreation = 0;
	this.counter = -1;
	
	//images related
	this.backgrounds = ["","url(./data/images/grass_field.jpg)"];
	
	//methods
	
	//0
	this.creation_code = function(){
		if(this.runOnCreation == 0){
			//creation code goes here
			//this.start_combat();
			this.start_menu();
			
			this.runOnCreation = 1;
		}
	}
	
	//1
	this.update = function(){
		//general
		//this.debug_text();
		
		//menu
		if(gameState == 1){
			
		}
		
		//combat
		if(gameState == 2){
			
		}
		
		this.start_timer();
		this.timer();
	}
	
	//2
	this.start_menu = function(){
		instances.push(new Menu());
	}
	
	//3
	this.start_combat = function(){
		enemy = new Enemy();
		player = new Player();
		modeIndicator = new Mode_Indicator();
		instances = [enemy,player,modeIndicator];
		
		c.style.backgroundImage = this.backgrounds[1];
		c.style.backgroundRepeat = "no-repeat";
		c.style.backgroundPosition = "center";
		c.style.backgroundSize = "cover";
		
		music.play(sound.combat);
	}
	
	//4
	this.start_how_to_play = function(){
		instances.push(new How_To_Play(),new Button(30,c.height-110,100,50,"Back","to_menu",1));
	}
	
	//5
	this.start_credits = function(){
		instances.push(new Credits(),new Button(30,c.height-110,100,50,"Back","to_menu",1));
	}
	
	//6
	this.start_game_over = function(){
		var width = c.width/2, height = c.height/2, height2 = 50;
		instances.push(new Game_Over_Box(),
					   new Button(c.width/2-width/2,c.height/2+height/2-110+height2*0,width,height2,"play again","play_again",0),
					   new Button(c.width/2-width/2,c.height/2+height/2-110+height2*1,width,height2,"main menu","main_menu",0));
	}
	
	
	
	//7
	this.end_menu = function(){
		instances = [];
	}
	
	//8
	this.end_combat = function(){
		enemy = undefined;
		player = undefined;
		modeIndicator = undefined;
		instances = [];
		
		c.style.backgroundImage = "";
		//c.style.backgroundRepeat = "no-repeat";
		//c.style.backgroundPosition = "center";
		
		music.stop();
	}
	
	//9
	this.end_how_to_play = function(){
		instances = [];
	}
	
	//10
	this.end_credits = function(){
		instances = [];
	}
	
	//11
	this.end_game_over = function(){
		instances = [];
	}
	
	//12
	this.input = function(event){
		this.lastPressed = event.keyCode;
		
		//menu input
		if(gameState == 1){
			instances[0].input(event);
		}
		
		//combat input
		if(gameState == 2){
			player.input(event);
		}
		
		//how to play input
		if(gameState == 3){
			instances[0].input(event);
		}
		
		//credits input
		if(gameState == 4){
			instances[0].input(event);
		}
		
		//game over input
		if(gameState == 5){
			var i;
			for(i = 0;i < instances.length;i++){
				if(instances[i].obj_class == "game_over"){
					instances[i].input(event);
				}
			}
		}
	}
	
	//13
	this.debug_text = function(){
		ctx.textAlign = "start";
		ctx.textBaseline = "top";
		draw_text("Key Code: "+this.lastPressed.toString(),30,20);
		draw_text("Instances = "+instances.toString(),30,50);
		draw_text("Instances = "+instances.length.toString(),30,80);
	}
	
	//14
	this.change_room = function(fromRoom,toRoom){
		switch(toRoom){
			
			//change to menu
			case 1:
				gameState = 1;
				if(fromRoom == 3){
					this.end_how_to_play();
				}
				if(fromRoom == 4){
					this.end_credits();
				}
				if(fromRoom == 5){
					this.end_combat();
					this.end_game_over();
				}
				this.start_menu();
			break;
			
			//change to combat
			case 2:
				gameState = 2;
				if(fromRoom == 1){
					this.end_menu();
				}
				if(fromRoom == 5){
					this.end_combat();
					this.end_game_over();
				}
				this.start_combat();
			break;
			
			//change to how to play
			case 3:
				gameState = 3;
				this.end_menu();
				this.start_how_to_play();
			break;
			
			//change to credits
			case 4:
				gameState = 4;
				this.end_menu();
				this.start_credits();
			break;
			
			//change to game over
			case 5:
				gameState = 5;
				this.start_game_over();
			break;
		}
	}
	
	//15
	this.start_timer = function(){
		if(gameState == 2){
			if( ((player.health <= 0) || (enemy.health <= 0)) && (control_switch[0] == 0) ){
				this.counter = fps;
				control_switch[0] = 1;
			}
		}
	}
	
	//16
	this.timer = function(){
		if(this.counter > 0){
			this.counter -= 1;
		} else if(this.counter == 0){
			this.game_ended();
			this.counter = -1;
		}
	}
	
	//17
	this.game_ended = function(){
		this.change_room(gameState,5);
	}
	
	//18
	this.touch_input = function(event){
		this.lastPressed = event.keyCode;
		
		//menu input
		if(gameState == 1){
			instances[0].input(event);
		}
		
		//combat input
		if(gameState == 2){
			player.input(event);
		}
		
		//how to play input
		if(gameState == 3){
			instances[0].input(event);
		}
		
		//credits input
		if(gameState == 4){
			instances[0].input(event);
		}
		
		//game over input
		if(gameState == 5){
			var i;
			for(i = 0;i < instances.length;i++){
				if(instances[i].obj_class == "game_over"){
					instances[i].input(event);
				}
			}
		}
	}

	//19
	this.mouse_input = function(){
		var i;
		for(i = 0;i < instances.length;i++){
			if(instances[i].obj_class == "button"){
				if(instances[i].mouseOn == true){
					instances[i].execute();
					break;
				}
			}
		}
	}
}

function Menu(){
	//propeties
	this.obj_class = "menu"
	this.menuItem = 0; // 0.start game, 1.how to play, 2.credits
	this.created = false;
	
	//methods
	
	//0
	this.creation_code = function(){
		if(this.created == false){
			var height = 50, startPos = c.height/2-(height*3)/2;
			instances.push(new Button(0,startPos+height*0,c.width,height,"Button 1","start_game",0));
			instances.push(new Button(0,startPos+height*1,c.width,height,"Button 2","how_to_play",0));
			instances.push(new Button(0,startPos+height*2,c.width,height,"Button 3","credits",0));
		}
		this.created = true;
	}
	
	//1
	this.update = function(){
		this.creation_code();
		this.draw_menu();
		this.track_mouse();
		this.draw_title();
	}
	
	//2
	this.draw_menu = function(){
		var height = 50, txtWidth = 90, totalHeight = height*3;
		ctx.fillStyle = "rgba(255,255,255,0.3)";
		ctx.fillRect(0,c.height/2-totalHeight/2+height*this.menuItem,c.width,height);
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		draw_text("Start Game",c.width/2,c.height/2-totalHeight/2+10);
		draw_text("How to play",c.width/2,c.height/2-totalHeight/2+10+height*1);
		draw_text("Credits",c.width/2,c.height/2-totalHeight/2+10+height*2);
	}
	
	//3
	this.input = function(event){
		
		//enter
		if(event.keyCode == 13){
			play_sound(sound.select);
			if(this.menuItem == 0){
				game_control.change_room(gameState,2); //move to combat room
			} else if(this.menuItem == 1){
				game_control.change_room(gameState,3);//move to "how to play" room
			} else if(this.menuItem == 2){
				game_control.change_room(gameState,4);//move to credits room
			}
		}
		
		//up arrow
		if(event.keyCode == 38){
			play_sound(sound.navigate);
			if(this.menuItem > 0){
				this.menuItem -= 1;
			} else {
				this.menuItem = 2;
			}
		}
		
		//down arrow
		if(event.keyCode == 40){
			play_sound(sound.navigate);
			if(this.menuItem < 2){
				this.menuItem += 1;
				
			} else {
				this.menuItem = 0;
			}
		}
	}
	
	//4
	this.draw_title = function(){
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		draw_text("Savior",c.width/2,100);
		draw_text("( This game requires a keyboard )",c.width/2,150, 20, "black");
	}
	
	//5
	this.track_mouse = function(){
		var i, height = 50, startPos = c.height/2-(height*3)/2;
		for(i = 0;i < 3;i++){
			if( (mouse_y >= startPos+height*i) && (mouse_y <= startPos+height*(i+1)) ){
				if(this.menuItem != i){
					play_sound(sound.navigate);
					this.menuItem = i;
				}
			}
		}
	}
	
	/*
	//6
	this.touch_input = function(event){
		var x = event.touches[0].pageX;
		var y = event.touches[0].pageY;
		if(1the touche point is within the menu rectangle){
			//check which rectangle is it (start game,how to play,credits)
			//and then preform the correct action
		}
		
	}
	*/
}

function How_To_Play(){
	//properties
	this.obj_class = "how_to_play";
	
	//methods
	
	//1
	this.update = function(){
		this.draw_instructions();
	}
	
	//2
	this.draw_instructions = function(){
		var height = 40, startPos = 60, textSize = 28;
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		draw_text("Instructions",c.width/2,10);
		ctx.textAlign = "start";
		draw_text_block(`Welcome to Savior.
			Savior is a skill based, semi-turn-based fighting game.
			- Use Num keys 1 - 9 to defend against and attack your
			. enemy.
			- Every time the enemy is about to attack, a red circle
			. will apear in 1 of 9 places, each place corresponds
			. to one of the Num keys. Aditionally, you will have
			. limited time to defend yourself and if you press the
		  	. wrong key, you will lose your chance to defend against
		  	. that attack.
		  	- Notice the indicator under the enemy's health bar to
		  	. know when you can attack and when you can defend.
			- After you attack a green bar will apear under your
			. health bar to indicate the cooldown duration between hits,
			..you can only attack again once it's filled.
			  
			Good Luck :)`,10,startPos,textSize);
		
		draw_text("Esc/backspace = back to main menu",30,c.height-50,textSize);
	}
	
	//3
	this.input = function(event){
		if( (event.keyCode == 27) || (event.keyCode == 8) ){
			play_sound(sound.back);
			game_control.change_room(gameState,1);
		}
	}
}

function Credits(){
	//properties
	this.obj_class = "credits";
	
	//methods
	
	//1
	this.update = function(){
		this.draw_credits();
	}
	
	//2
	this.draw_credits = function(){
		var height = 40, startPos = 150, textSize = 30;
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		draw_text("Credits",c.width/2,60);
		draw_text_block(`Art - Tal
			Programming - Tal
			Sounds - Tal, some Super Mario game,
			and Dark Souls
			Music - some Donkey Kong game
			Softwares used for art: MS paint, Krita
			Softwares used for programming: Notepad++,
			Sublime Text 3
			Softwares used for audio: Bfxr
			Browser used for testing: Google Chrome
			Help resources used: https://www.w3schools.com,
			https://www.developphp.com, Internet
			`, c.width/2, startPos, textSize);
		
		ctx.textAlign = "start";
		draw_text("Esc/backspace = back to main menu",30,c.height-50);
	}
	
	//3
	this.input = function(event){
		if( (event.keyCode == 27) || (event.keyCode == 8) ){
			play_sound(sound.back);
			game_control.change_room(gameState,1);
		}
	}
}

function Game_Over_Box(){
	//properties
	this.obj_class = "game_over";
	if(player.health <= 0){
		this.lostWon = 0; //player lost
	} else {
		this.lostWon = 1; //plyer won
	}
	this.menuItem = 0;
	this.sound_switch = 0;
	
	//methods
	
	//1
	this.update = function(){
		this.track_mouse();
		this.draw_box();
		this.lost_won_sound();
	}
	
	//2
	this.draw_box = function(){ //dialogue box
		var width = c.width/2, height = c.height/2, height2 = 50;
		
		//the box
		ctx.fillStyle = "rgb(239,228,176)";
		ctx.fillRect(c.width/2-width/2,c.height/2-height/2,width,height);
		ctx.strokeStyle = "black";
		ctx.strokeRect(c.width/2-width/2,c.height/2-height/2,width,height);
		
		//message
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		if(this.lostWon == 1){
			draw_text("Congratulations! you won! :D",c.width/2,c.height/2-height/2+50);
		} else {
			draw_text("Too bad, you lost... :(",c.width/2,c.height/2-height/2+50);
		}
		
		// continue or quit
		ctx.fillStyle = "rgba(164,112,40,0.4)";
		ctx.fillRect(c.width/2-width/2,c.height/2+height/2-110+height2*this.menuItem,width,height2);
		draw_text("Play again",c.width/2,c.height/2+height/2-100);
		draw_text("Main menu",c.width/2,c.height/2+height/2-50);
	}
	
	//3
	this.input = function(event){
		//enter
		if(event.keyCode == 13){
			play_sound(sound.select);
			if(this.menuItem == 0){
				game_control.change_room(gameState,2); //play again
				control_switch[0] = 0;
			} else{
				game_control.change_room(gameState,1); //main menu
				control_switch[0] = 0;
			}
		}
		
		//up arrow
		if(event.keyCode == 38){
			play_sound(sound.navigate);
			if(this.menuItem == 0){
				this.menuItem = 1;
			} else {
				this.menuItem -= 1;
			}
		}
		
		//down arrow
		if(event.keyCode == 40){
			play_sound(sound.navigate);
			if(this.menuItem == 0){
				this.menuItem += 1;
			} else {
				this.menuItem = 0;
			}
		}
	}
	
	//4
	this.lost_won_sound = function(){
		if(this.sound_switch == 0){
			music.stop();
			if(this.lostWon == 0){
				play_sound(sound.defeat);
			} else{
				play_sound(sound.victory);
			}
			this.sound_switch = 1;
		}
	}
	
	//5
	this.track_mouse = function(){
		var i, width = c.width/2, height = c.height/2, height2 = 50;
		for(i = 0; i < 2;i++){
			if( (mouse_x >= c.width/4) && (mouse_x < c.width/4+width) && (mouse_y >= (c.height*0.75-110)+height2*i) && (mouse_y < (c.height*0.75-110)+height2*(i+1)) ){
				if(this.menuItem != i){
					play_sound(sound.navigate);
					this.menuItem = i;
				}
			}
		}
	}
}

function Sound(){
	this.obj_class = "sound_library";
	
	//sounds (path volume)
	this.back = "./data/sounds/back.wav 0.1";
	this.defeat = "./data/sounds/defeat.mp3 0.3";
	this.defense = "./data/sounds/defense.wav 0.1";
	this.enemy_defense = "./data/sounds/enemy_defense.wav 0.1";
	this.enemy_dies = "./data/sounds/enemy_dies.wav 0.2";
	this.hurt = "./data/sounds/hurt.wav 0.1";
	this.navigate = "./data/sounds/navigate.wav 0.1";
	this.select = "./data/sounds/select.wav 0.1";
	this.slash = "./data/sounds/slash.wav 0.1";
	this.victory = "./data/sounds/victory.mp3 0.3";
	
	//music (path volume)
	this.combat = "./data/music/combat.mp3 0.3";
}

function Music_Manager(){
	this.obj_class = "music_player";
	this.current;
	this.info;
	
	this.play = function(track){
		this.current = new Audio();
		this.info = track.split(" ");
		this.current.src = this.info[0];
		this.current.loop = true;
		this.current.volume = Number(this.info[1]);
		this.current.play();
	}
	
	this.stop = function(){
		if(this.current != undefined){
			this.current.pause();
			this.current = undefined;
		}
	}
}

function Image_Library(){
	//properties
	this.obj_class = "image_library";
	
	this.slash = "./data/images/slash.png";
	this.enemyReady = "./data/images/enemy_ready.png";
	this.enemyHit = "./data/images/enemy_hit.png";
	this.enemy = "./data/images/enemy.png";
	this.signal_attack = "./data/images/attack_signal.png";
}

function Button(x,y,width,height,text,name,visible){
	
	//properties
	this.obj_class = "button";
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.text = text;
	this.visible = visible;
	this.mouseOn = false;
	this.name = name;
	
	//methods
	
	//1
	this.update = function(){
		this.mouse_on();
		this.draw_self();
	}
	
	//2
	this.draw_self = function(){
		if(this.visible){	
			if(this.mouseOn){
				ctx.fillStyle = "rgba(240,255,220,0.5)";
			} else{
				ctx.fillStyle = "rgba(170,255,150,0.4)";
			}
			ctx.fillRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle = "black";
			ctx.strokeRect(this.x,this.y,this.width,this.height);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = (this.height*0.6).toString()+"px Arial";
			ctx.fillText(this.text,this.x+this.width/2,this.y+this.height/2);
		}
	}
	
	//3
	this.mouse_on = function(){
		if( (mouse_x > this.x) && (mouse_x < (this.x+this.width)) && (mouse_y > this.y) && (mouse_y < this.y+this.height) ){
			this.mouseOn = true;
		} else{
			this.mouseOn = false;
		}
	}
	
	//4
	this.execute = function(){
		executioner.execute(this.name);
	}
}

function Buttons_Executer(){
	
	this.execute = function(name){
		switch(name){
			case "start_game":
				play_sound(sound.select);
				game_control.change_room(gameState,2); //move to combat room
			break;
			
			case "how_to_play":
				play_sound(sound.select);
				game_control.change_room(gameState,3); //move to how to play
			break;
			
			case "credits":
				play_sound(sound.select);
				game_control.change_room(gameState,4); //move to credits
			break;
			
			case "to_menu":
				play_sound(sound.back);
				game_control.change_room(gameState,1); //move to main menu
			break;
			
			case "play_again":
				play_sound(sound.select);
				game_control.change_room(gameState,2); //move to combat room
				control_switch[0] = 0;
			break;
			
			case "main_menu":
				play_sound(sound.back);
				game_control.change_room(gameState,1); //move to main menu
				control_switch[0] = 0;
			break;
		}
	}
	
}


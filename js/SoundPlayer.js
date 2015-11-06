/**
 * @author lufy
 */
function SoundPlayer(){
	var self = this;
	self.loadIndex = 0;
	self.jump = new LSound();
	self.jump.parent = self;
	self.gameover = new LSound();
	self.gameover.parent = self;
	self.background = new LSound();
	self.background.parent = self;
}
SoundPlayer.prototype.loadSound = function(){
	var self = this;
	if(LGlobal.canTouch && self.loadIndex > 0 && self.loadIndex < 2)self.loadIndex = 2;
	if(self.loadIndex == 0){
		self.loadIndex++;
		self.backgroundLoad();
	}else if(self.loadIndex == 1){
		self.loadIndex++;
		self.jump.addEventListener(LEvent.COMPLETE,self.jumpLoadComplete);
		self.jump.load("./music/jump.mp3");
	}else if(self.loadIndex == 2){
		self.loadIndex++;
		self.gameover.addEventListener(LEvent.COMPLETE,self.gameoverLoadComplete);
		self.gameover.load("./music/gameover.mp3");
	/*
		self.loadIndex++;
		self.get.addEventListener(LEvent.COMPLETE,self.getLoadComplete);
		self.get.load("./music/get.mp3");
	}else if(self.loadIndex == 3){
		self.loadIndex++;
		self.fly.addEventListener(LEvent.COMPLETE,self.flyLoadComplete);
		self.fly.load("./sound/fly.mp3");*/
	}
};
SoundPlayer.prototype.playSound = function(name){
	var self = this;

	switch(name){
		case "jump":
			if(!self.jumpIsLoad)return;
			self.jump.close();
			self.jump.play(0,1);
			break;
		case "gameover":
			if(!self.gameoverIsLoad)return;
			self.gameover.close();
			self.gameover.play(0,1);
			break;
		case "background":
			if(!self.backgroundIsLoad)return;
			self.background.close();
			self.background.play(0,100);
			break;
	}
};
SoundPlayer.prototype.backgroundLoad = function(){
	var self = this;
	self.background.addEventListener(LEvent.COMPLETE,self.backgroundLoadComplete);
	self.background.load("./music/bg.mp3");
};
SoundPlayer.prototype.backgroundLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.backgroundIsLoad = true;
	self.play(0,100);
};
SoundPlayer.prototype.jumpLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.jumpIsLoad = true;
};
SoundPlayer.prototype.gameoverLoadComplete = function(event){
	var self = event.currentTarget;
	self.parent.gameoverIsLoad = true;
};
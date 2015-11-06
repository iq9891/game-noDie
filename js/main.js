var game = {
	myData: {
		top: {
			playX: 82,	//上面小人起始的x
			h: 377		//上面小人起始的y
		},
		bot: {
			playX: 82,	//下面小人起始的x
			h: 662		//下面小人起始的y
		},
		iTemSpeed: 3,		//障碍物移动的速度
		aMinStepDif: 100,	//障碍物添加间隔参数最小值
		aMaxStepDif: 200,	//障碍物添加间隔参数最大值
		aItemW: 25,		//障碍物随机宽度度最大值
		aItemH: 60,	//障碍物随机高度最大值
		rectColor: ["#880088", "#f867f3", "#6778f8", "#76fd41"],	//障碍物随机颜色
		aPlayNowPos: {
			top: 170,//上面小人跳起来的y坐标
			bot: 455 //下面小人跳起来的y坐标
		},
		bTopPlayerTop: true,	//上面小人是否向上,
		bBotPlayerTop: true,	//下面小人是否向上
		bTopDown: false,	//上面是否按下
		bBotDown: false,	//下面是否按下
		tip: "哇，你坚持了"
	},
	oMusicLoaded: {},		//下载后的音乐对象
	oMusic: {},		//音乐对象
	gameTime: 1,	//游戏3分钟 
    start: function () {

        var _this = this;

        _this.allLayer = new LSprite();
        onFrameLayer.addChild(_this.allLayer);
		
		//音乐类
		_this.oSound = new SoundPlayer();

		//_this.loadSound("music0");
		_this.loadSound("music1");
		_this.loadSound("music2");

		//播放音乐
		//_this.playPiano("music0");
		
		//添加开始界面
		_this.startFn(imglist["name"], imglist["start"]);

    },
	startFn: function(oImgA, oImgB){

		var _this = this;
		

        _this.startLayer = new LSprite();
		_this.startLayer.graphics.drawRect(0,"",[0,0,LGlobal.width,LGlobal.height],true);
        _this.allLayer.addChild(_this.startLayer);	

		if(_this.itemTopLayer){
			_this.scoreLayer = new LSprite();
			_this.scoreLayer.x = LGlobal.width / 2;
			_this.startLayer.addChild(_this.scoreLayer);
			_this.score = new LTextField();
			_this.score.color = "#ffffff";
			_this.score.font = "HG行書体";
			_this.score.size = 16;
			_this.score.textAlign = "center";
			_this.score.y = 350;
			_this.score.text = _this.myData.tip + hour + "分" + minute + "秒";
			_this.scoreLayer.addChild(_this.score);
		}		

        _this.nameLayer = new LSprite();
		_this.nameLayer.addChild(new LBitmap(new LBitmapData( oImgA )));
		_this.nameLayer.x =  Tool.sc({w:120}).x;
		if(_this.itemTopLayer){
			_this.nameLayer.y =  250;
		}else{
			_this.nameLayer.y =  350;
		}
        _this.startLayer.addChild(_this.nameLayer);	

        _this.btnLayer = new LSprite();
		_this.btnLayer.addChild(new LBitmap(new LBitmapData( oImgB )));
		_this.btnLayer.x =  Tool.sc({w:120}).x;
		_this.btnLayer.y =  400;
        _this.startLayer.addChild(_this.btnLayer);	
		
		if(_this.itemTopLayer){ //游戏结束以后
			//over的时候重置
			startAllBtn = false;
			intDiff = 0;
			day=0;
			hour=0;
			minute=0;
			second=0;
			_this.itemTopLayer.removeAllChild();
			_this.itemBotLayer.removeAllChild();
			_this.gameLayer.removeChild(_this.playLayer1);
			_this.gameLayer.removeChild(_this.playLayer2);
			_this.gameLayer.removeAllChild(_this.times);
			_this.playPiano("music1");
			//_this.oSound.playSound("gameover");
		};

		//添加开始游戏点击事件
		_this.btnLayer.addEventListener(LMouseEvent.MOUSE_UP, function(event){
			
			_this.allLayer.removeChild(_this.startLayer);

			//进入游戏页面
			_this.gameFn();

			//开始游戏按钮
			startAllBtn = true;

			//加载音乐
			_this.oSound.loadSound();
			_this.oSound.playSound("background");

		});


	},
	gameFn: function(){

        var _this = this;


		//车轮左右是否可以滑动
		_this.bSteeringMove = false;


		_this.allLayer.graphics.drawLine(5, "#ff0000", [0, 375, LGlobal.width, 375]);
		_this.allLayer.graphics.drawLine(5, "#ff0000", [0, 660, LGlobal.width, 660]);

        _this.gameLayer = new LSprite();
		_this.gameLayer.graphics.drawRect(0,"",[0,0,LGlobal.width,LGlobal.height],false);
        _this.allLayer.addChild(_this.gameLayer);
		
		//添加主人公
		_this.playFn();

		//添加障碍物层
        _this.itemTopLayer = new LSprite();
        _this.gameLayer.addChild(_this.itemTopLayer);
        _this.itemBotLayer = new LSprite();
        _this.gameLayer.addChild(_this.itemBotLayer);

		//添加点击事件
		_this.gameLayer.addEventListener(LMouseEvent.MOUSE_DOWN, function(event){
			if(event.offsetY < _this.myData.top.h){
				_this.myData.bTopDown = true;
			}else{
				_this.myData.bBotDown = true;
			}
			//_this.oSound.playSound("jump");
			_this.playPiano("music2");
		});

		//添加时间
		_this.timeFn();

	},
	playFn: function(){

        var _this = this;

		_this.playList = LGlobal.divideCoordinate(42,38,1,2);
		_this.playData = new LBitmapData(imglist["player"],0,0,21,38);
		_this.playLayer1 = new LAnimationTimeline(_this.playData, _this.playList); 
		_this.playLayer1.x = _this.myData.top.playX;
		_this.playLayer1.y = _this.myData.top.h - 38;
		_this.playLayer1.speed = 5;
		_this.gameLayer.addChild(_this.playLayer1);

		_this.playLayer2 = new LAnimationTimeline(_this.playData, _this.playList); 
		_this.playLayer2.x = _this.myData.bot.playX; 
		_this.playLayer2.y = _this.myData.bot.h - 38;
		_this.playLayer2.speed = 5;
		_this.gameLayer.addChild(_this.playLayer2);

	},
	createItem: function(aW, aH, aAreaH, oParent){

        var _this = this,
			aNewData = {
				w: aW,
				h: aH,
				aAreaH: aAreaH
			},
			oRandColor = _this.myData.rectColor[Tool.rand(_this.myData.rectColor.length)];
		
        _this.itemPerLayer = new LSprite();//
		_this.itemPerLayer.graphics.drawRect(0, "", [0, 0, aNewData.w, aNewData.h], true, oRandColor);
		_this.itemPerLayer.x = LGlobal.width;
		_this.itemPerLayer.y = aNewData.aAreaH - aNewData.h;
        oParent.addChild(_this.itemPerLayer);

	},
	timeFn: function(){

        var _this = this;
		
		_this.times = new LTextField();
		_this.times.color = "#000000";
		_this.times.font = "HG行書体";
		_this.times.size = 16;
		_this.times.x = 380;
		_this.times.y = 30;
		_this.times.text = "00:00";
		_this.gameLayer.addChild(_this.times);

		//_this.diffFn(0);
		//_this.gameOverFn();

	},
	diffFn: function (intDiff){

        var _this = this,
			day=0,
			hour=0,
			minute=0,
			second=0;//时间默认值		

		_this.oTim = setInterval(function(){
			if(intDiff > 0){
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			
			/*if(intDiff < 0){
				//console.log("游戏结束");
				clearInterval(_this.oTim);
				_this.times.text = "00:00";
				
				_this.bLose = true;

			}else{*/
				
				_this.times.text = minute + ":" + second;
				//console.log(intDiff);
				intDiff++;

			//}

		}, 1000);
	},
	playPiano: function (music){
		
        var _this = this;

		_this.oMusic = _this.oMusicLoaded[music];
		console.log(_this.oMusic.playing);
			_this.oMusic.play();
		if(!_this.oMusic.playing){
			_this.oMusic.close();
		}else{
			_this.oMusic.play();
		}

	},
	loadSound: function(music){

        var _this = this;

		_this.oMusic = new LSound();
		_this.oMusic.load(imglist[music]);
		_this.oMusicLoaded[music] = _this.oMusic;

	}
};
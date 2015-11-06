var imgData = [
			{ type: "js", path: "./js/jquery-1.8.3.min.js" },
			{ type: "js", path: "./js/Tool.js" },
			{ type: "js", path: "./js/main.js" },
			{ type: "js", path: "./js/SoundPlayer.js" },
			{ name: "player", path: "./images/player.png" },
			{ name: "gameover", path: "./images/gameover.png" },
			{ name: "start", path: "./images/start.png" },
			{ name: "reStart", path: "./images/restart.png" },
			{ name: "name", path: "./images/name.png" },
			//{ name:"music0",path:"./music/bg.mp3",type:"sound" },
			{ name:"music1",path:"./music/gameover.mp3",type:"sound" },
			{ name:"music2",path:"./music/jump.mp3",type:"sound" }
		],
		imglist,
		_win = window,
		_doc = document,
		aTopStep = 0,	//上面随机间隔
		aBotStep = 0,	//下面随机间隔
		aTopStepDif = 0,	//上面随机间隔对比参数
		aBotStepDif = 0,	//下面随机间隔对比参数
		startAllBtn = false, //开始游戏按钮
		twoRotating = false,
			day=0,
			hour=0,
			minute=0,
			second=0,
			intDiff = 0; 

function doScroll() {
    if (_win.pageYOffset === 0) {
        _win.scrollTo(0, 1);
    }
}

_win.addEventListener('load', function () {
    setTimeout(doScroll, 100);
}, false);

_win.onorientationchange = function () {
    setTimeout(doScroll, 100);
};
_win.onresize = function () {
    setTimeout(doScroll, 100);
};

_doc.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

LInit(16.6, "legend", 480, 755, main); //16.6

_win.addEventListener("onorientationchange" in _win ? "orientationchange" : "resize", function () {
	if (_win.orientation == 180 || _win.orientation == 0) {

		$(".rotating,.b-modal").hide().css({
			"opacity": 0,
			"zIndex": 1
		});

	}
	if (_win.orientation == 90 || _win.orientation == -90) {

		setTimeout(function () {

			if (twoRotating) {
				$(".rotating,.b-modal").show().css({
					"opacity": 1,
					"zIndex": 10
				});
				$('.b-modal').css({
					"opacity": 0.6
				});

			} else {

				twoRotating = true;

				$('.rotating').bPopup({
					onOpen: function () {
						$('.rotating').css({
							"zIndex": 10
						});

					},
					onClose: function () {

						$('.rotating').css({
							"zIndex": 1
						});

					},
					opacity: 0.6
				});

			}

		}, 1000);

	}
}, false);



//设置全屏
LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
LGlobal.align = LStageAlign.TOP_MIDDLE;
LSystem.screen(LStage.FULL_SCREEN);

function main() {
    var loadingLayer = new LoadingSample4("","rgba(255,255,255,0)");
    addChild(loadingLayer);
    LLoadManage.load(
		imgData,
		function (progress) {
		    loadingLayer.setProgress(progress);
		},
		function (result) {
		    imglist = result;
		    removeChild(loadingLayer);
		    loadingLayer = null;
		    gameInit();
		}
	);
};
function gameInit(event) {

    var _this = this;
    onFrameLayer = new LSprite();

    addChild(onFrameLayer);

    //调试模式
    LGlobal.setDebug(true);

	aTopStepDif = Tool.rand(game.myData.aMinStepDif, game.myData.aMaxStepDif),	//上面随机间隔对比参数
	aBotStepDif = Tool.rand(game.myData.aMinStepDif, game.myData.aMaxStepDif),	//下面随机间隔对比参数

    //游戏初始
    game.start();

    //添加游戏关键帧
    onFrameLayer.addEventListener(LEvent.ENTER_FRAME, function () {
        onframe(game);
    });

};


function onframe(game) {

	if(startAllBtn){//游戏开始按钮判断

		var _this = game,
			aTopI = 0,
			aTopL = _this.itemTopLayer.childList.length,
			aBotI = 0,
			aBotL = _this.itemBotLayer.childList.length;

		//播放音乐
		//_this.playPiano("music0");

		if(aTopStep++ >= aTopStepDif){
			aTopStep = 0;
			aTopStepDif = Tool.rand(game.myData.aMinStepDif, game.myData.aMaxStepDif);
			_this.createItem(
					Tool.rand(10, game.myData.aItemW),
					Tool.rand(10, game.myData.aItemH),
					_this.myData.top.h, 
					_this.itemTopLayer
			);
		}
		for(aTopI = 0; aTopI < aTopL; aTopI++){
			if(_this.itemTopLayer.childList[aTopI]){
				if(!_this.itemTopLayer.childList[aTopI].hitTestObject(_this.playLayer1)){
					_this.itemTopLayer.childList[aTopI].x -= _this.myData.iTemSpeed;
				}else{
					//游戏结束
					_this.startFn(imglist["gameover"], imglist["reStart"]);
				}
			}
		}
		
		if(aBotStep++ >= aBotStepDif){
			aBotStep = 0;
			aBotStepDif = Tool.rand(game.myData.aMinStepDif, game.myData.aMaxStepDif);
			_this.createItem(
					Tool.rand(10, game.myData.aItemW),
					Tool.rand(10, game.myData.aItemH),
					_this.myData.bot.h,
					_this.itemBotLayer
			);
		}
		
		for(aBotI = 0; aBotI < aBotL; aBotI++){
			if(_this.itemBotLayer.childList[aBotI]){
				if(!_this.itemBotLayer.childList[aBotI].hitTestObject(_this.playLayer2)){
					_this.itemBotLayer.childList[aBotI].x -= _this.myData.iTemSpeed;
				}else{
					//游戏结束
					_this.startFn(imglist["gameover"], imglist["reStart"]);
				}
			}
		}
		

		if(_this.myData.bTopDown){
			if(_this.myData.bTopPlayerTop){
				if(_this.playLayer1.y <= _this.myData.aPlayNowPos.top){
					_this.myData.bTopPlayerTop = false;
				}else{
					_this.playLayer1.y-=10;
				}
			}else{
				if(_this.playLayer1.y >= _this.myData.top.h - 38){
					_this.myData.bTopDown = false;
					_this.myData.bTopPlayerTop = true;
				}else{
					_this.playLayer1.y+=10;
				}
			}
		}
		if(_this.myData.bBotDown){
			if(_this.myData.bBotPlayerTop){
				if(_this.playLayer2.y <= _this.myData.aPlayNowPos.bot){
					_this.myData.bBotPlayerTop = false;
				}else{
					_this.playLayer2.y-=10;
				}
			}else{
				if(_this.playLayer2.y >= _this.myData.bot.h - 38){
					_this.myData.bBotDown = false;
					_this.myData.bBotPlayerTop = true;
				}else{
					_this.playLayer2.y+=10;
				}
			}
		}
		

		if(intDiff > 0){
			day = Math.floor(intDiff / (60 * 60 * 24));
			hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
			minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
			second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		}
		if (minute <= 9) minute = '0' + minute;
		if (second <= 9) second = '0' + second;
		
		_this.times.text = hour + ":" + minute;
		intDiff++;


	}//游戏开始按钮判断
};
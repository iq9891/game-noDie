/**
 * Created with EditPlus.
 * User: leemagnum
 * Date: 14-5-17
 * Time: 上午10:18
 * 工具对象.
 */
var Tool = {
	//水平居中
	//obj.w --- objWidth
	//obj.h --- objHeight
	sc: function(obj){
		
		var oL = obj.w ? ((LGlobal.width - obj.w) / 2) : 0,
			oT = obj.h ? ((LGlobal.height - obj.h) / 2) : 0;

		return {x: oL, y: oT};
	},
	//垂直靠下
	//obj.h --- objHeight
	cb: function(obj){
		
		oT = obj.h ? (LGlobal.height - obj.h) : 0;

		return {y: oT};
	},
	oMath: Math,
	toAngle: function(radian){
		//弧度转角度
		return radian*180/this.oMath.PI;
	},
	toRad: function(angle){
		//角度转弧度
		return angle * this.oMath.PI / 180;
	},
	rand: function (under, over){ //over上限(最大),under下限(最小)
		switch(arguments.length){ 
			case 1: return parseInt(Math.random()*under); 
			case 2: return parseInt(Math.random()*(over-under+1) + under); 
			default: return 0; 
		}
	}
};

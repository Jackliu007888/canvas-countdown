var Window_Width = 1024;
var Window_height = 768;
var Radius = 8;
var Margin_Top = 60;
var Margin_Left = 30;
//定义倒计时截止时间，注意月份-1
const endTime = new Date(2017,8,24,08,30,00);
var curShowTimeSeconds = 0 ;

var balls = [];//定义数组，存储小球
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#6699CC","#FFBB33","#FF8800","#FF4444","#CC000C"];//定义小球颜色数组

window.onload = function () {
    Window_Width = document.body.clientWidth;
    Window_height =  document.body.clientHeight +100   ;
    Margin_Left = Math.round(Window_Width /30);
    Margin_Top = Math.round(Window_height / 35);
    Radius = Math.round(Window_Width * 4 / 5 / 108 ) - 1 ;

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = Window_Width;
    canvas.height = Window_height;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    //用setInterval方法，制作动画,20帧
    setInterval(
        function () {
            render(context);
            update();
        },50
    );
};
//倒计时的时间  单位是秒
function getCurrentShowTimeSeconds() {
    var curTime = new Date();//获取当前的时间
    var ret = endTime.getTime() - curTime.getTime();//ret=截止时间 - 当前时间
    ret = Math.round(ret/1000);//毫秒变成秒
    // console.log(ret);
    // console.log(curTime);
    // console.log(endTime);
    return ret >= 0 ? ret : 0;//大于0返回ret；小于等于0返回0
}
//更新时间以及产生崩裂小球
function update() {

    var nextShowTimeSeconds = getCurrentShowTimeSeconds();//定义下一刻的时间
    var nextDays = parseInt(nextShowTimeSeconds /(3600*24));
    var nextHours = parseInt((nextShowTimeSeconds - 24*3600*nextDays) / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds -24*nextDays*3600- nextHours* 3600)/60);
    var nextSeconds = nextShowTimeSeconds % 60;
    var curDays = parseInt(curShowTimeSeconds /(3600*24));
    var curHours = parseInt((curShowTimeSeconds  - 24*3600*curDays)/ 3600);
    var curMinutes = parseInt((curShowTimeSeconds -24*curDays*3600 - curHours* 3600)/60);
    var curSeconds = curShowTimeSeconds %60;

    //与当前时间对比是否相等，不相等就将下一时刻的值赋给curShowTimeSeconds,实现时间的更新
    if (nextSeconds != curSeconds){
        if(parseInt(curDays/10) != parseInt(nextDays/10)){
            addBalls(Margin_Left + 38 *(Radius +1)  ,Margin_Top,parseInt(nextDays/10))
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(Margin_Left + 54 *(Radius +1)  ,Margin_Top,parseInt(nextDays%10))
        }
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls(Margin_Left  ,Margin_Top+ 22 *(Radius +1),parseInt(nextHours/10))
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(Margin_Left + 15*(Radius + 1),Margin_Top+ 22 *(Radius +1),parseInt(nextHours%10))
        }
        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls(Margin_Left + 39*(Radius + 1),Margin_Top+ 22 *(Radius +1),parseInt(nextMinutes/10))
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
            addBalls(Margin_Left + 54*(Radius + 1),Margin_Top+ 22 *(Radius +1),parseInt(nextMinutes%10))
        }
        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls(Margin_Left + 78*(Radius + 1),Margin_Top+ 22 *(Radius +1),parseInt(nextSeconds/10))
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls(Margin_Left + 93*(Radius + 1),Margin_Top+ 22 *(Radius +1),parseInt(nextSeconds%10))
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();

}
//更新小球方法
function updateBalls() {
    for (var i = 0;i < balls.length; i++){
        balls[i].x += balls[i].vx;// x = x + vx*t
        balls[i].y += balls[i].vy;// y = y + vy*t
        balls[i].vy += balls[i].g; //vy = vt + g*t
            //碰撞检测  到底端弹起又下落 设置阻力
        if (balls[i].y >= Window_height - Radius - 30){
            balls[i].y = Window_height -Radius -40;
            balls[i].vy = -balls[i].vy * 0.5;
        }
    }
    var cnt = 0;//cnt表示留在画布中小球的个数
    for (var i = 0;i <balls.length;i++) {
        if ((balls[i].x + Radius) > 0 && (balls[i].x - Radius < Window_Width)) {
            balls[cnt++] = balls[i];  // 将符合条件的小球balls[i] 保留在balls[cnt]里，所以balls[0] -- balls[cnt]都是留在画布中的小球，再将cnt以外的小球清除
        }
    }
        while (balls.length >Math.min(500,cnt)){   // Math.min(300,cnt)
            balls.pop();
            // console.log(balls.length)；
        }


}
//产生随机方向颜色小球方法
function addBalls(x,y,num) {
    for (var i = 0; i < digit[num].length ;i++){
        for (var j = 0;j < digit[num].length ; j++) {
            if (digit[num][i][j] == 1) {
                var aball = {
                    x: x + j * 2 * (Radius + 1) + (Radius + 1),
                    y: y + i * 2 * (Radius + 1) + (Radius + 1),
                    g: 1.5 + Math.random(),//1.5-2.5
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //-4,+4
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]//随机的颜色
                };
                balls.push(aball);//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
            }
        }
    }
}
//绘制时间数字方法，绘制崩裂小球
function render(cxt) {
    cxt.clearRect(0,0,Window_Width,Window_height);//对整个屏幕清除
    var days = parseInt(curShowTimeSeconds /(3600*24));
    var hours = parseInt((curShowTimeSeconds - 24*3600*days) / 3600);
    var minutes = parseInt((curShowTimeSeconds -24*days*3600 - hours* 3600)/60);
    // console.log(days);
    // console.log(hours);


    var seconds = curShowTimeSeconds % 60;

    //计算每个数字的位置x，y，每个数字的取得方式  小时：分钟：秒
    renderDigit(Margin_Left,Margin_Top+ 22 *(Radius +1),parseInt(hours/10),cxt);
    renderDigit(Margin_Left+ 15 *(Radius +1),Margin_Top+ 22 *(Radius +1),parseInt(hours%10),cxt);
    renderDigit(Margin_Left+ 30 *(Radius +1),Margin_Top+ 22 *(Radius +1),10,cxt);
    renderDigit(Margin_Left+ 39 *(Radius +1),Margin_Top+ 22 *(Radius +1),parseInt(minutes/10),cxt);
    renderDigit(Margin_Left+ 54 *(Radius +1),Margin_Top+ 22 *(Radius +1),parseInt(minutes%10),cxt);
    renderDigit(Margin_Left+ 68 *(Radius +1),Margin_Top+ 22 *(Radius +1),10,cxt);
    renderDigit(Margin_Left+ 78 *(Radius +1),Margin_Top+ 22 *(Radius +1),parseInt(seconds/10),cxt);
    renderDigit(Margin_Left+ 93 *(Radius +1),Margin_Top+ 22 *(Radius +1),parseInt(seconds%10),cxt);
    renderDigit(Margin_Left+ 38 *(Radius +1),Margin_Top,parseInt(days/10),cxt);
    renderDigit(Margin_Left+ 54 *(Radius +1),Margin_Top,parseInt(days%10),cxt);
    renderDigit(Margin_Left+ 80 *(Radius +1),Margin_Top,11,cxt);

    //绘制崩裂小球
    for (var i = 0;i < balls.length;i++){
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,Radius,0,2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }
}
//绘制时间小球方法
function renderDigit(x,y,num,cxt) {
    cxt.fillStyle = "rgb(0,102,153)";

    for (var i = 0; i < digit[num].length ;i++){
        for (var j = 0;j < digit[num].length ; j++){
            if (digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x + j * 2 *(Radius + 1)+(Radius + 1),y + i * 2 *(Radius + 1)+(Radius + 1),Radius,0,2*Math.PI);
                cxt.closePath();

                 cxt.fill();
            }
        }
    }
}










/**
 * Created by Administrator on 2016/11/9.
 */

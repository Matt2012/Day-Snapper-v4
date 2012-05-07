var appcRed = '#CA120D';
var appcGrey = '#CCCCCC';



var screenWidth =  Ti.Platform.displayCaps.platformWidth;
var screenHeight = Ti.Platform.displayCaps.platformHeight;
 
function GetHeight(value) {
    var temp = (value * 100) / 480;
    return parseInt((screenHeight * temp) / 100);
}
 
function GetWidth(value) {
    var temp = (value * 100) / 320;
    return parseInt((screenWidth * temp) / 100);
}



module.exports = {
	appcRed: appcGrey,
	appcDarkGray: '#787878',
	appcLightGray: '#343434',
	windowBackground: '/images/back.png',
	
	//style objects
	headerText: {
		left:5,
		color:'#ffffff',
		font: {
			fontSize:18,
			fontWeight:'bold'
		}
	}
};
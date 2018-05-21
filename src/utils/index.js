/**
 * 時間格式化
 * @return {String}
 */
export function formatTime(time) {
	time = Number(time) * 1000
	let oldDate = new Date(time)
	let newDate = new Date()
	let dayNum  = ''
	let getTime = (newDate.getTime() - oldDate.getTime())/1000

	if(getTime < 60 * 5){
		dayNum = `刚刚`
	}else if(getTime >= 60 * 5 && getTime < 60 * 60){
		dayNum = parseInt(getTime / 60) + '分钟前'
	}else if(getTime >= 3600 && getTime < 3600 * 24){
		dayNum = parseInt(getTime / 3600) + '小时前'
	}else {
		let year   = oldDate.getFullYear()
		let month  = oldDate.getMonth() + 1
		let day    = oldDate.getDate()
		dayNum     = `${year}-${month}-${day}`
	}
	return dayNum
}

export function format2Time(time) {
	time = Number(time) * 1000
	let oldDate = new Date(time)
	let newDate = new Date()
	let dayNum  = {
		today: false,
		value: ''
	}
	let newYear = newDate.getFullYear()
	let newMonth = newDate.getMonth() + 1
	let newDay   = newDate.getDate()

	let oldYear = oldDate.getFullYear()
	let oldMonth = oldDate.getMonth() + 1
	let oldDay   = oldDate.getDate()

	if (newYear === oldYear && newMonth === oldMonth && newDay === oldDay) {
		dayNum.today = true
		dayNum.value = ['今', '天']
		dayNum.key = "today"
	} else {
		dayNum.today = false
		dayNum.value = [oldDay, oldMonth]
		dayNum.year = `${oldMonth}-${oldDay}`
	}
	dayNum.year = oldYear
	dayNum.month = oldMonth
	dayNum.day = oldDay
	return dayNum
}

export function utf16toEntities(str) { 
	var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则 
	str = str.replace(patt, function(char){ 
			var H, L, code; 
			if (char.length===2) { 
				H = char.charCodeAt(0); // 取出高位 
				L = char.charCodeAt(1); // 取出低位 
				code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法 
				return "&#" + code + ";"; 
			} else { 
				return char; 
			} 
		}); 
	return str; 
}

/**
 *
 *用于反解开EMOJI编码后的字符串
*/
export function uncodeUtf16(str){
    var reg = /\&amp;#.*?;/g;
    var result = str.replace(reg,function(char){
        var H,L,code;
        if(char.length == 13 ){
            code = parseInt(char.match(/[0-9]+/g));
            H = Math.floor((code-0x10000) / 0x400)+0xD800;
            L = (code - 0x10000) % 0x400 + 0xDC00;
            return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
        }else{
            return char;
        }
    });
    return result;
}


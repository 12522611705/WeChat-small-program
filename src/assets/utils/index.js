/**
 * 对象排序
 * @param {Object} obj 需要排序的对象
 * @param {Number} reverse 排序方式 1：正序 -1：倒序
 */
export const orderBy = (obj, reverse = 1) => {
	let arr = [], newObj = {}
	for (let item in obj) {
		arr.push(item)
	}
	arr = (reverse === -1) ? arr.sort().reverse() : arr.sort()
	arr.map((key) => {
		newObj[key] = obj[key]
	})
	return newObj
}

export const throttle = function (fn, wait) {
	let timeID = null
	let context
	let args
	let later = function () {
		clearTimeout(timeID)
		// 触发函数
		fn && fn.apply(context, args)
		// clear
		context = args = timeID = null
	}
	return function (...params) {
		// save
		context = this
		args = params

		// clear first
		clearTimeout(timeID)
		timeID = setTimeout(later, wait)
	}
}


export const debounce = (func, wait, immediate) => {
	var timeout, args, context, timestamp, result

	// 生成later函数
	var later = () => {
		var last = new Date().getTime() - timestamp

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}
	return (...params) => {
		// save context
		context = this
		// save args
		args = params
		// save timestamp
		timestamp = new Date().getTime()

		var callNow = immediate && !timeout

		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}
		return result
	}
}
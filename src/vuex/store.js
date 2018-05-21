import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'
Vue.use(Vuex)

export default {
	install(Vue, options) {
		// let modules = getComp()
		Vue.prototype.$store = new Vuex.Store({
			state,
			mutations,
			actions,
			getters,
			// modules
		})
	}
}


// const getComp = () => {
// 	let compArr = {}
// 	;(r => {
// 		return r.keys().map(key => {
// 			let fileName = key.replace('./', '')
// 			let name = fileName.replace('.js', '')
// 			let comp = require(`./module/${fileName}`)
// 			compArr[name] = comp.default
// 		})
// 	})(require.context('./module', true, /\.js/))
// 	return compArr
// }
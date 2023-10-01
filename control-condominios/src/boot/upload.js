import env from '../utils/env'
import toFormData from '../utils/toFormData'
import httpAsync from '../utils/httpAsync'
import { openURL } from 'quasar'
import { reject } from 'lodash'

export default ({ Vue }) => {
	Vue.prototype.$files = (url) => ({
		put(file) {
			return new Promise(async (resolve, reject) => {
				try {
					await httpAsync('cargas_masivas/upload').post(
						toFormData({
							path: url,
							file,
						})
					)
					resolve(url)
				} catch (e) {
					reject(e)
				}
			})
		},
		get() {
			openURL(env.apiUrl + '/' + url)
		},
	})
}

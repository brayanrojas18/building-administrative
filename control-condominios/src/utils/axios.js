import axios from 'axios'
import { Notify } from 'quasar'
import { SessionStorage } from 'quasar'
import env from '../utils/env'

const instance = axios.create({
	baseURL: env.apiUrl,
})

instance.interceptors.response.use(
	function(response) {
		return response.data
	},
	function(error) {

		var data = error

		if (error.response) {

			if (error.response.status == 401) {
				return Promise.reject(data.response.data.error)
			}

			data = error.response.data.error
			Notify.create(error.response.data.error.message)
		}

		return Promise.reject(data)
	}
)

instance.interceptors.request.use(
	function(config) {

		var token = SessionStorage.getItem('token')
		if (token) {
			if (!config.headers) config.headers = {}
			config.headers['access-token'] = token
		}

		var selected = SessionStorage.getItem('selected')
		if (selected) {
			if (!config.params) config.params = {}
			if (!config.params.hasOwnProperty('conf')) config.params['conf'] = {}
			config.params['conf'] = selected
		}

		return config
	},
	function(error) {
		return Promise.reject(error)
	}
)

export default instance

import catchErrors from './catchErrors'
import Storage from './Storage'
import axios from '../utils/axios'
import env from '../utils/env'
import Vue from 'vue'

var loading = false

export default function(url, config = {}) {
	const save_store = (data, url) => {}
	const http = async (method, data, params = {}) => {
		return new Promise(async (resolve, reject) => {
			const processResult = (result) => {
				resolve(result.data)
			}

			const processErrors = (error) => {
				catchErrors(error)
				reject(null)
			}

			const request = {
				method: method,
				url: env.apiUrl + url,
				params: params,
				data: data,
			}

			try {
				const result = await axios(request)
				processResult(result)
			} catch (error) {
				processErrors(error)
			}
		})
	}

	return {
		get: async (data) => {
			return await http('get', null, data)
		},
		post: async (data, params) => {
			return await http('post', data, params)
		},
		put: async (data, params) => {
			return await http('put', data, params)
		},
		delete: async function(data, params) {
			return await http('delete', data, params)
		},
	}
}

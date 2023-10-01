export function getUser ({commit, state, dispatch}, id) {

	return new Promise(async (resolve,reject) => {

		this._vm.$axios.get('http://localhost:4000/api/usuarios/'+id+'?')
		.then(res => {
			resolve(res)
		}).catch(error => reject(error))

	})

}


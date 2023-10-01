import { SessionStorage } from 'quasar'

export function setUser (state, user) {
	state.user = user
	if (user && user.condominium)
		state.condominium = user.condominium

};

export async function token (state, token){

	state.tokenLogin = token
};


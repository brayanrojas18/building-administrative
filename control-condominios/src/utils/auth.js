import httpAsync from './httpAsync'
import Storage from './Storage'

export default {
	isLogued: ()=> Storage.get('token'),
	auth: (email,password)=> httpAsync('auth').post({ email: email, password: password }),
	saveToken: token=>Storage.set('token',token),
	getToken: token=>Storage.get('token'),
	logout: ()=>{
		Storage.remove('token')
		Storage.remove('cookieAc')
	}
}
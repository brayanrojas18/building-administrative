import Vue from 'vue'
import axios from 'axios'
import {SessionStorage, Notify} from 'quasar'
import env from '../utils/env'


// Vue.prototype.$axios = axios

var baseURL = env.apiUrl

const instance = axios.create({
  baseURL,
});

instance.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {

  var data = error

  if (error.response) {
    
    if(error.response.status == 401){
    	return Promise.reject(data.response.data.error)
    }

    data = error.response.data.error
   
  } else if (error.request) {
    console.log('Error Request', error.request);
  } else {
    console.log('Error message', error.message);
  }

  return Promise.reject(data);
});

instance.interceptors.request.use(function (config) {

  var user = SessionStorage.getItem('user')
  if(user){
  	if(!config.params)
  		config.params = {}
  	config.params.access_token = user.id
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

export default async ({ Vue }) => {
  Vue.prototype.$axios = instance

  Vue.prototype.$gql = (gql, variables = null) => {

    return new Promise((resolve,reject) => {

      var params = {}

      var token = SessionStorage.getItem('token')
      if(token)
        params.access_token = token

      axios({
        url: baseURL + '/graphql',
        method: 'post',
        data: {
          query: gql,
          variables
        },
        params
      }).then(res => {
        if(!res.data.erros)
          resolve(res.data.data)
        else
          reject(res.data.errors)
      }).catch(error => reject(error))

    })

  }
}


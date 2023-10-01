import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import {SessionStorage, Notify} from 'quasar'
import env from '../utils/env'
import {mapState} from 'vuex';

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

instance.interceptors.request.use(async function (config) {

  if (config.method == 'get') {
    var where = {}
    if (config.filter){
      for(let i = 0; i < Object.keys(config.filter).length; i++) {
        where[Object.keys(config.filter)[i]] = config.filter[Object.keys(config.filter)[i]]
      }
    }
    config.url = config.url + '?filter=' + JSON.stringify({
      where
    })
  }

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
  Vue.prototype.$axios2 = instance
}


import _ from 'lodash'
import auth from "./auth";
import Vue from 'vue'
import router from '../router'


export default function(error){
    
    const bus = new Vue({})

    if(error.response){
        //console.log(error.response)
        if(typeof error.response.data == 'string'){
            // toast.error(error.response.data)
            //console.log('aqui')
            // alert(error.response.data)
            auth.logout()
            //console.log(bus)
            // bus.$router.push('/login')
            window.location.href = '/#/login'
            // bus.$message({
            //     title: 'Error',
            //     message: error.response.data.length > 500 ? 'Algo ha salido mal...' : error.response.data,
            //     type: 'error'
            // });
            bus.$q.notify(error.response.data.length > 500 ? 'Algo ha salido mal...' : error.response.data)
            // triggers.call('UserActions')
        }
        else{
            //console.log('aqui2')
            _.forEach(error.response.data,(val,key)=>{
                var msg = val
                if(typeof val !='string')
                    msg = val[0]
                // toast.error(msg)
                // bus.$message({
                //     title: 'Error',
                //     message: msg,
                //     type: 'error'
                // });
                bus.$q.notify(msg)
                // alert(msg)
            })
        }
    }
    else if(error.request){
        //console.log('aqui3')
        // toast.error(counterpart('errors.connect'))
        // alert('Error')
        // bus.$message({
        //     title: 'Error',
        //     message: 'Error',
        //     type: 'error'
        // });
        bus.$q.notify('Error')
        // bus.$router.push('/login')
        auth.logout()
        window.location.href = '/#/login'
    }
    else if(error.message!='manual_cancel'){
        // toast.error(error.message)
        // alert(error.message)
        // bus.$message({
        //     title: 'Error',
        //     message: error.messag,
        //     type: 'error'
        // });
        bus.$q.notify(error.message)
    }
}

import _ from 'lodash'

export default function(data){

    var d = new FormData()

    _.forEach(data,(val,key)=>{
        d.append(key,val)
    })

    return d
}

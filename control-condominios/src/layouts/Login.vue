<template>
  <q-layout id="fondo" class="flex flex-center" view="lHh Lpr lFf">
    
    <div class="row q-gutter-xl">
      <div class="items-center column q-pr-lg">
        <div>
          <img src="~assets/logo.png" style="width: 20vw"/> 
        </div>
        <div class="q-gutter-md column q-pt-md" style="width: 400px">
          <q-input @keyup.enter="Login()" outlined dark type="email" color="white" v-model="email" label="Email">
            <template v-slot:prepend>
              <q-icon name="person" size="md" color="white" class="q-ml-xs"/>
            </template>
          </q-input>
          <q-input @keyup.enter="Login()" outlined dark :type="isPwd ? 'password' : 'text'" color="white" v-model="password" label="Contraseña" >
            <template v-slot:prepend>
              <q-icon name="vpn_key" size="md" color="white" class="q-ml-xs"/>
            </template>
            <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
          </q-input>
          <div class="row">
            <div>
              <q-btn color="grey" flat size="sm" label="Ingresar por primera vez" style="width: 180px" @click="New"/>
            </div>
            <div>
              <q-btn color="grey" flat size="sm" label="¿Olvidó su contraseña?" style="width: 180px"/>
            </div>
          </div>
          <div>
            <q-btn id="btn" @click="Login" :loading="loading" style="width: 50%" class="float-right">
              <div class="text-center text-weight-bolder">
                Acceder
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="column text-white q-pl-lg justify-center" style="margin-top: 200px">
        <div class="text-center text-weight-bolder text-h2 q-mb-xs">
          Bienvenido
        </div>
        <div class="text-lef text-weight-bolder text-title q-mb-xs">
          Al acceder pordras mantener un control<br>
          de pago sobre tus condominios<br>
          y todas las regulaciones
        </div>
        <div class="row">
          <q-btn color="white" flat size="sm" label="preguntas frecuentes"/>
          <q-btn color="white" flat size="sm" label="contactar soporte"/>
        </div>
      </div>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';

export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      email: null,
      password: null,
      isPwd: true,
    }
  },
  computed: {
    ...mapState('example',['user'])
  },
  methods:{
    ...mapMutations('example', ['token', 'setUser']),
    ...mapActions('example', ['getUser']),
    async Login(){

      this.loading = true

      const credentials = {

        email: this.email,
        password: this.password
      }
      
      const promise = this.$axios.post('usuarios/login?', credentials);
      promise.catch(e => {
        this.loading = false
        this.$q.notify({
          message: 'Esta cuenta no existe, o verifica tu conexión',
          type: 'negative',
        })
      });
      promise.then( response => {
        this.token(response)
        this.getUser(response.userId).then(async res => {
          this.$q.sessionStorage.set('userData', res)
          this.$q.sessionStorage.set('user', response)
          this.setUser(res)

          if (res.role == 'admin-general') {
            this.$router.push('/admin')
            this.loading = false
          }
          if (res.role == 'admin') {
            var activo = await this.$axios2.get('condominios/' + res.condominium)
            if (activo && !activo.active) {
              this.$q.dialog({
                title: 'Alerta!',
                message: 'Este condominio está bloqueado. Comuniquese con su administrador para mas información'
              }).onOk(() => {})
              this.loading = false
              return
            }else{
              this.$router.push('/dashboard')
            }
          }
          if (res.role == 'user') {
            var activo = await this.$axios2.get('condominios/' + res.condominium)
            if (activo && !activo.active) {
              this.$q.dialog({
                title: 'Alerta!',
                message: 'Este condominio está bloqueado. Comuniquese con su administrador para mas información'
              }).onOk(() => {})
              this.loading = false
              return
            }else{
              this.$router.push('/admin')
            }
          }

          this.saludo(res)
        })
      });
    },
    saludo(user) {
      var fecha = new Date(); 
      var hora = fecha.getHours();
      var texto = ''
      var icon
     
      if(hora >= 0 && hora < 12){
        texto = "Buenos Días";
        icon = 'wb_sunny'
      }
     
      if(hora >= 12 && hora < 18){
        texto = "Buenas Tardes";
        icon = 'brightness_4'
      }
     
      if(hora >= 18 && hora < 24){
        texto = "Buenas Noches";
        icon = 'nightlight'
      }

      this.$q.notify({
        message: texto + ' ' +  user.first_name + ' ' + user.last_name,
        color: 'positive',
        icon: icon,
        position:'bottom-left',
      })
    },
    async New() {
      this.$q.dialog({
        title: 'Enviar contraseña por correo',
        message: 'Por favor escriba su email',
        prompt: {
          model: '',
          type: 'email',
          isValid: val => val.length > 0,
        },
        cancel: true,
        persistent: true
      }).onOk(async data => {
        var filter = {
          where: {
            role: 'user',
            email: data
          }
        }
        var validarEmail = await this.$axios.get('usuarios?filter=' + JSON.stringify(filter))
        if (!validarEmail.length) {
          this.$q.dialog({
            title: 'ERROR ENCONTRADO :(',
            message: '<span class="text-weight-bold text-grey-8">Según el email ingresado no se encuentra usuario con el mismo. Por favor ingrese la dirección de correo que le haya sido creada o cargada. En caso de no saberla comuniquese con su</span> <strong>ADMINISTRADOR</strong>',
            html: true
          })
        }else{
          this.$axios.post('request-password-reset?email=' + data, {
            email: data
          }).then(res => {
            this.$q.dialog({
              title: 'Clave enviada',
              message: 'Revise su email y siga las instrucciones'
            })
          })
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  mounted() {
    if(this.$route.path == '/login' && this.$q.sessionStorage.has('userData')){
      this.$q.sessionStorage.remove('userData')
      this.$q.sessionStorage.remove('user')
      if(!close)
        window.location.reload(false);
    }
  }
}
</script>

<style type="text/css">
  #fondo{
    background-image: url("~assets/buildingbackground.jpg");
    background-size:100% 100%; 
    background-position: center;
  }
  #btn{
    border-radius: 10px;
    background: linear-gradient(#ff7655, #ffac4a);
    color:#1d1234;
  }
</style>

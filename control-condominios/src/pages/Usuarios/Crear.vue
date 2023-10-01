<template>
  <div class="column">
    <div class="float-left q-ml-md">
      <q-btn icon="keyboard_backspace" to="/usuarios" round flat color="white"/>
    </div>
    <div class="" align="center">
      <q-card class="card q-ma-md q-mt-xl" style="width: 60%">
        <q-card-section>
          <div class="tex-white text-center text-weight-bolder text-h3">
            Nuevo Usuario
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-md justify-center">
            <div class="col-md-4 col-xs-12">
              <q-input 
                ref="first_name"
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.first_name" 
                label="Nombres"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                ref="last_name" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.last_name" 
                label="Apellidos"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                ref="identity_card" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                type="number"
                v-model="form.identity_card" 
                label="Cedula de identidad"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input color="white" v-model="form.birthdate" mask="date"  
                label="Fecha de Nacimiento" ref="birthdate" dark :rules="[val => !!val || 'campo requerido']" >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.birthdate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                ref="house_code" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.house_code" 
                label="Codigo de Casa"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                ref="email" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.email" 
                label="Correo"
                type="email"
              />
            </div>
            <div class="col-md-4 col-xs-12" v-if="!form.id">
              <q-input
                ref="password" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.password" 
                label="Contraseña"
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
              </q-input>
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                ref="phone" 
                dark
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                v-model="form.phone" 
                label="Número de telefono"
                mask="(####) ### - ####"
                unmasked-value
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section align="center">
          <q-btn style="width: 200px" class="q-my-md color-orange" @click="save()" :loading="loading">
            <div class="text-center text-weight-bolder text-white">
              Guardar
            </div>
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
  data () {
    return {
      form:{
        birthdate: this.$moment().format('YYYY/MM/DD')
      },
      loading:false,
      isPwd: true,
    }
  },
  watch:{
  },
  computed: {
  },
  methods:{
    async save() {
      if (!this.form.id) {
        if (!this.$refs.first_name.validate() || !this.$refs.last_name.validate() || !this.$refs.identity_card.validate() || 
          !this.$refs.email.validate() || !this.$refs.password.validate() || !this.$refs.house_code.validate() ||
          !this.$refs.birthdate.validate() || !this.$refs.phone.validate()) {
          this.loading = false
          return this.$q.notify({
            message: 'Campo requerido',
            color: 'negative'
          })
        }
        
        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          .test(this.form.email)){
            this.loading = false
            return this.$q.notify({
            message: 'La dirección de correo no es valida',
            color: 'negative'
          })
        } 

        var filter = {
          where: {
            role: 'user',
            email: this.form.email
          }
        }
        var validarEmail = await this.$axios.get('usuarios?filter=' + JSON.stringify(filter))
        if (validarEmail.length) {
          this.$q.dialog({
            title: 'ALERTA!',
            message: '<span class="text-weight-bold text-grey-8">Se a encontrado en el sistema un usuario con la misma dirección de correo que intenta ingresar</span>',
            html: true
          })
          return 
        }

        var validar = false
        if(this.form.password.length >= 8){   
          var mayuscula = false;
          var minuscula = false;
          var numero = false;
          var caracter_raro = false;
          
          for(var i = 0;i<this.form.password.length;i++)
          {
            if(this.form.password.charCodeAt(i) >= 65 && this.form.password.charCodeAt(i) <= 90)
            {
              mayuscula = true;
            }
            else if(this.form.password.charCodeAt(i) >= 97 && this.form.password.charCodeAt(i) <= 122)
            {
              minuscula = true;
            }
            else if(this.form.password.charCodeAt(i) >= 48 && this.form.password.charCodeAt(i) <= 57)
            {
              numero = true;
            }
            else
            {
              caracter_raro = true;
            }
          }
          if(mayuscula == true && minuscula == true && caracter_raro == true && numero == true)
          {
            validar = true
          }
        }
        if (!validar) {
          this.loading = false
          return this.$q.notify({
            message: 'La Contraseña debe de tener: Mayusculas, Minusculas, caracter especial y numeros',
            color: 'negative'
          })
        }

        try{
          this.form.role = 'user'
          await this.$axios2.post('usuarios', {...this.form}).then(val => {
            this.loading = false
            this.$q.notify({
              message: 'Usuario guardado',
              color: 'positive'
            })
            this.$router.push('/usuarios')
          })
        }catch(error) {
          this.loading = false
          this.$q.notify({
              message: 'Ups hubo un error',
              color: 'negative'
          })
        }
      }else{
        if (!this.$refs.first_name.validate() || !this.$refs.last_name.validate() || !this.$refs.identity_card.validate() || 
          !this.$refs.email.validate() || !this.$refs.house_code.validate() || !this.$refs.birthdate.validate() || 
          !this.$refs.phone.validate()) {
          this.loading = false
          return this.$q.notify({
            message: 'Campo requerido',
            color: 'negative'
          })
        }
        
        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          .test(this.form.email)){
            this.loading = false
            return this.$q.notify({
            message: 'La dirección de correo no es valida',
            color: 'negative'
          })
        } 

        var validar = false
        if(this.form.password.length >= 8){   
          var mayuscula = false;
          var minuscula = false;
          var numero = false;
          var caracter_raro = false;
          
          for(var i = 0;i<this.form.password.length;i++)
          {
            if(this.form.password.charCodeAt(i) >= 65 && this.form.password.charCodeAt(i) <= 90)
            {
              mayuscula = true;
            }
            else if(this.form.password.charCodeAt(i) >= 97 && this.form.password.charCodeAt(i) <= 122)
            {
              minuscula = true;
            }
            else if(this.form.password.charCodeAt(i) >= 48 && this.form.password.charCodeAt(i) <= 57)
            {
              numero = true;
            }
            else
            {
              caracter_raro = true;
            }
          }
          if(mayuscula == true && minuscula == true && caracter_raro == true && numero == true)
          {
            validar = true
          }
        }
        if (!validar) {
          this.loading = false
          return this.$q.notify({
            message: 'La Contraseña debe de tener: Mayusculas, Minusculas, caracter especial y numeros',
            color: 'negative'
          })
        }
        try{
          this.form.role = 'user'
          await this.$axios2.patch('usuarios/' + this.form.id, {...this.form}).then(val => {
            this.loading = false
            this.$q.notify({
              message: 'Usuario editado',
              color: 'positive'
            })
            this.$router.push('/usuarios')
          })
        }catch(error) {
          this.loading = false
          this.$q.notify({
              message: 'Ups hubo un error',
              color: 'negative'
          })
        }
      }
    },
    async getList(id) {
      this.$q.loading.show()
      await this.$axios2.get('usuarios/' + id, {
        filter: {
          role:'user'
        }
      }).then(val => {
        this.form = val
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    }
  },
  async mounted() {
    if (this.$route.params.id) {
      await this.getList(this.$route.params.id)
    }
  }
}
</script>
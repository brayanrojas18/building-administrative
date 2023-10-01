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
                readonly
                dark 
                color="white" 
                v-model="form.first_name" 
                label="Nombres"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                dark 
                color="white" 
                v-model="form.last_name" 
                label="Apellidos"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                dark 
                color="white" 
                type="number"
                v-model="form.identity_card" 
                label="Cedula de identidad"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input readonly color="white" v-model="form.birthdate" mask="date"  
                label="Fecha de Nacimiento" dark >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date readonly v-model="form.birthdate">
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
                readonly
                dark 
                color="white" 
                v-model="form.house_code" 
                label="Codigo de Casa"
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                dark 
                color="white" 
                v-model="form.email" 
                label="Correo"
                type="email"
              />
            </div>
          </div>
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
      form:{},
      loading:false,
      isPwd: true,
    }
  },
  watch:{
  },
  computed: {
  },
  methods:{
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
    await this.getList(this.$route.params.id)
  }
}
</script>
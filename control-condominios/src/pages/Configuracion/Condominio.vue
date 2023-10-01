<template>
  <div class="flex flex-center">
    <q-card class="card q-ma-md q-mt-xl">
      <q-card-section>
        <div class="tex-white text-center text-weight-bolder text-h3">
          Datos del Condominio
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-gutter-md justify-center">
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="data.name"
              dark
              color="white" 
              label="Nombre del condominio"
            />
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="this.$moment(data.createdAt).format('YYYY-MM-DD')"
              readonly
              dark
              color="white" 
              label="Fecha de inicio"
            />
          </div>
          <div class="col-md-5 col-xs-12">
            <q-select
              v-model="data.admin"
              :options="adminds"
              dark
              color="white" 
              label="Administrador principal"
              map-options
              emit-value
            />
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              readonly
              v-model="data.email"
              dark
              color="white" 
              label="Email del Administrador principal"
            />
          </div>
          <div class="col-md-5 col-xs-12">
            <q-field label="Estado" stack-label dark color="white">
              {{data.active ? 'Activo' : 'Inactivo'}}
            </q-field>
          </div>
          <div class="col-md-5 col-xs-12">
            <q-field label="Total de Usuarios" stack-label dark color="white">
              {{users.length}}
            </q-field>
          </div>
        </div>
      </q-card-section>
      <q-card-section align="center">
        <q-btn class="q-my-md color-orange" align="center" @click="save" :loading="loading">
          <div class="text-center text-weight-bolder text-white">
            Guardar
          </div>
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
  data () {
    return {
      data:{},
      usuarios:[],
      adminds:[],
      users:[],
      loading: false,
    }
  },
  watch:{
    'data.admin'(v) {
      var find = this.usuarios.find(v => v.id == v)
      if (find)
        this.data.email = find.email
    }
  },
  computed: {
    ...mapState('example',['user']),
  },
  methods:{
    async save() {
      this.loading = true
      await this.$axios2.put('condominios/' + this.data.id, {
        ...this.data
      })
      await this.get()
      this.loading = false
      this.$q.notify({
        message: 'Guardado con exito!',
        color: 'positive',
      })
    },
    async get() {
      this.$q.loading.show()
      await this.$axios2.get('condominios').then(async val => {
        this.data = val[0]
        await this.$axios2.get('usuarios', {
          filter: {
            role:'admin'
          }
        }).then(res => {
          this.usuarios = res
          this.adminds = res.map(e => ({
            label: e.first_name + ' ' + e.last_name,
            value: e.id,
          }))
        })
        this.users = await this.$axios2.get('usuarios', {
          filter: {
            role:'user'
          }
        })
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    },
  },
  async mounted() {
    await this.get()
  }
}
</script>

<style type="text/css">
</style>
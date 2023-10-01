<template>
  <div class="flex flex-center">
    <q-card class="card q-ma-md q-mt-xl">
      <q-card-section>
        <div class="text-center text-weight-bolder text-h3">
          Cargas Masivas
        </div>
      </q-card-section>
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            class="text-weight-bolder text-h6"
            expand-separator
            label="Usuarios"
            style="width: 1000px"
            dark
          >
            <q-card class="transparent" align="center">
              <div class=" text-subtitle1 text-weight-bolder text-grey q-ml-md">Carga Masiva de usuarios</div>
              <q-card-section>
                <q-uploader
                  class="text-left"
                  color="purple-10"
                  style="max-width: 300px; color: #000000"
                  label="Cargar Usuarios"
                  @added="getRuta"
                  accept=".xlsx, archive/*"
                  :readonly="file"
                />
                <div class="q-mt-md">
                  <q-btn-group push>
                    <q-btn outline label="Cargar" color="white" @click="uploadUsuarios" :disable="!file_usuarios"/>
                    <q-btn outline label="plantilla" @click="plantillaUsuarios" color="white"/>
                    <q-btn outline label="cancelar" color="white" @click="file_usuarios = null, file = false"/>
                  </q-btn-group>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
    <div>
      <q-dialog v-model="open_error">
        <q-card>
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title class="text-center">
              <span class="text-weight-bold text-h6">
                Errores en el Archivo
              </span>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section>
            <div class="text-weight-bold q-pb-md">
              Errores encontrados en el archivo. Por favor corregir para proceder a cargar la información
            </div>
            <q-list padding dense separator class="rounded-borders" v-for="error in errores" :key="error.message">
              <q-item clickable v-ripple>
                <q-item-section class="text-grey-10 text-subtitle2">
                  <q-item-label>{{error.message}}</q-item-label>
                  <q-item-label caption>{{error.ubicacion}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="grey-5"/>
            </q-list>
            <div class="text-center">
              <q-btn outline label="Entendido" color="primary" v-close-popup @click="errores = []"/>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import { openURL } from "quasar";
export default {
  data () {
    return {
      file: false,
      file_usuarios: null,
      open_error: false,
      errores: [],
    }
  },
  watch:{
  },
  computed: {
    ...mapState('example',['user']),
  },
  methods:{
    async getRuta(ruta) {
      this.file_usuarios = ruta
      this.file = true
    },
    async uploadUsuarios() {
      this.$q.loading.show()
      await this.$files('cargas-masivas/' + this.file_usuarios[0].name).put(this.file_usuarios[0]).then(async ruta => {
        await this.$axios.post('cargas_masivas/read', {
          type: 'usuarios',
        }).then(res => {
          if (res.result.length) {
            this.errores = res.result
            this.open_error = true
          }
          if (res.result == true) {
            this.$q.notify({
              message:"Archivo cargado exitosamente!",
              color: "positive"
            })
          }
        }).catch(e => {
          this.$q.loading.hide()
          this.$q.notify({
            message: "hubo un error",
            color: 'negative'
          })
        })
      }).catch(e => {
        this.$q.loading.hide()
        this.$q.notify({
          message: "hubo un error",
          color: 'negative'
        })
      })    

      this.file = false
      this.file_usuarios = null
      this.$q.loading.hide()
    },
    async plantillaUsuarios() {
      this.$q.loading.show()
      await this.$axios.post('plantillas/download', {
        type: 'usuarios',
      }).then(res => {
        openURL(this.$env.fileUrl + res.result);
        this.$q.notify({
          message: "Plantilla descargada!",
          color: 'positive'
        })
        this.$q.loading.hide()
      }).catch(e => {
        console.log(e, 'e')
        this.$q.notify({
          message: "hubo un error",
          color: 'negative'
        })
        this.$q.loading.hide()
      })
    }
  },
  async mounted() {
  }
}
</script>

<style type="text/css">
</style>
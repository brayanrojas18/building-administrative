<template>
  <div class="flex flex-center">
    <q-card class="card q-ma-md q-mt-xl">
      <q-card-section>
        <div class="text-center text-weight-bolder text-h3">
          Reportes
        </div>
      </q-card-section>
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            class="text-weight-bolder text-h6"
            expand-separator
            label="Adelantos"
            style="width: 1000px"
            dark
          >
            <q-card class="transparent" align="center">
              <div class=" text-subtitle1 text-weight-bolder text-grey q-ml-md">Adelantos Disponibles</div>
              <q-card-section>
                <q-select
		          style="width: 200px"
		          v-model="year"
		          label="Año" 
		          type="number" 
		          ref="year" 
		          :options="years"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
		        <q-select
		          style="width: 200px"
		          v-model="month"
		          label="Mes"
		          ref="month" 
		          :options="[
		            { label: 'Enero', value: 1 },
		            { label: 'Febrero', value: 2 },
		            { label: 'Marzo', value: 3 },
		            { label: 'Abril', value: 4 },
		            { label: 'Mayo', value: 5 },
		            { label: 'Junio', value: 6 },
		            { label: 'Julio', value: 7 },
		            { label: 'Agosto', value: 8 },
		            { label: 'Septiembre', value: 9 },
		            { label: 'Octubre', value: 10 },
		            { label: 'Noviembre', value: 11 },
		            { label: 'Diciembre', value: 12 },
		          ]"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
                <div class="q-mt-md">
	              	<q-btn outline label="Descargar" @click="adelantos" color="white" style="width: 200px"/>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator/>
          <q-expansion-item
            class="text-weight-bolder text-h6"
            expand-separator
            label="Deudas"
            style="width: 1000px"
            dark
          >
            <q-card class="transparent" align="center">
              <div class=" text-subtitle1 text-weight-bolder text-grey q-ml-md">Deudas Disponibles</div>
              <q-card-section>
                <q-select
		          style="width: 200px"
		          v-model="year"
		          label="Año" 
		          type="number" 
		          ref="year" 
		          :options="years"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
		        <q-select
		          style="width: 200px"
		          v-model="month"
		          label="Mes"
		          ref="month" 
		          :options="[
		            { label: 'Enero', value: 1 },
		            { label: 'Febrero', value: 2 },
		            { label: 'Marzo', value: 3 },
		            { label: 'Abril', value: 4 },
		            { label: 'Mayo', value: 5 },
		            { label: 'Junio', value: 6 },
		            { label: 'Julio', value: 7 },
		            { label: 'Agosto', value: 8 },
		            { label: 'Septiembre', value: 9 },
		            { label: 'Octubre', value: 10 },
		            { label: 'Noviembre', value: 11 },
		            { label: 'Diciembre', value: 12 },
		          ]"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
                <div class="q-mt-md">
	              	<q-btn outline label="Descargar" @click="deudas" color="white" style="width: 200px"/>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator/>
          <q-expansion-item
            class="text-weight-bolder text-h6"
            expand-separator
            label="Pagos"
            style="width: 1000px"
            dark
          >
            <q-card class="transparent" align="center">
              <div class=" text-subtitle1 text-weight-bolder text-grey q-ml-md">Pagos Generados</div>
              <q-card-section>
                <q-select
		          style="width: 200px"
		          v-model="year"
		          label="Año" 
		          type="number" 
		          ref="year" 
		          :options="years"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
		        <q-select
		          style="width: 200px"
		          v-model="month"
		          label="Mes"
		          ref="month" 
		          :options="[
		            { label: 'Enero', value: 1 },
		            { label: 'Febrero', value: 2 },
		            { label: 'Marzo', value: 3 },
		            { label: 'Abril', value: 4 },
		            { label: 'Mayo', value: 5 },
		            { label: 'Junio', value: 6 },
		            { label: 'Julio', value: 7 },
		            { label: 'Agosto', value: 8 },
		            { label: 'Septiembre', value: 9 },
		            { label: 'Octubre', value: 10 },
		            { label: 'Noviembre', value: 11 },
		            { label: 'Diciembre', value: 12 },
		          ]"
		          :rules="[val => !!val || 'campo requerido']" 
		          color="white" 
		          dark
		          map-options
		          emit-value
		        />
                <div class="q-mt-md">
	              	<q-btn outline label="Descargar" @click="pagos" color="white" style="width: 200px"/>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import { openURL } from "quasar";
export default {
  data () {
    return {
      year: this.$moment().year(),
      month: Number(this.$moment().format('M'))
    }
  },
  watch:{
  },
  computed: {
    ...mapState('example',['user', 'condominium']),
    years() {
      var anhos = []

      for (var i = this.$moment().year(); i >= 2010; i--) {
        anhos.push({
          label: i,
          value: i,
        })
      }

      return anhos
    }
  },
  methods:{
  	adelantos(){
  		this.$q.loading.show()
		this.$axios.post('reportes/generar', {
			type: 'adelantos',
			year: Number(this.year),
			month: Number(this.month),
			condominium: this.condominium 
		}).then(res => {
			this.$q.loading.hide()
			if (res.result == 'vacio') {
				this.$q.notify({
					message: 'No hay datos segun el mes y año',
					color: 'negative'
				})
			}else{
				openURL(this.$env.fileUrl + res.result)
				this.$q.notify({
					message: 'Reporte descargado con exito',
					color: 'positive'
				})
			}
		}).catch(() => {
			this.$q.loading.hide()
        	this.$q.notify({
        		message:'Ups hubo un error',
        		color:'negative'
      		})
        })
	},
	deudas(){
  		this.$q.loading.show()
		this.$axios.post('reportes/generar', {
			type: 'deudas',
			year: Number(this.year),
			month: Number(this.month),
			condominium: this.condominium 
		}).then(res => {
			this.$q.loading.hide()
			if (res.result == 'vacio') {
				this.$q.notify({
					message: 'No hay datos segun el mes y año',
					color: 'negative'
				})
			}else{
				openURL(this.$env.fileUrl + res.result)
				this.$q.notify({
					message: 'Reporte descargado con exito',
					color: 'positive'
				})
			}
		}).catch(() => {
			this.$q.loading.hide()
        	this.$q.notify({
        		message:'Ups hubo un error',
        		color:'negative'
      		})
        })
	},
	pagos(){
  		this.$q.loading.show()
		this.$axios.post('reportes/generar', {
			type: 'pagos',
			year: Number(this.year),
			month: Number(this.month),
			condominium: this.condominium 
		}).then(res => {
			this.$q.loading.hide()
			if (res.result == 'vacio') {
				this.$q.notify({
					message: 'No hay datos segun el mes y año',
					color: 'negative'
				})
			}else{
				openURL(this.$env.fileUrl + res.result)
				this.$q.notify({
					message: 'Reporte descargado con exito',
					color: 'positive'
				})
			}
		}).catch(() => {
			this.$q.loading.hide()
        	this.$q.notify({
        		message:'Ups hubo un error',
        		color:'negative'
      		})
        })
	}
  },
  async mounted() {
  }
}
</script>

<style type="text/css">
</style>
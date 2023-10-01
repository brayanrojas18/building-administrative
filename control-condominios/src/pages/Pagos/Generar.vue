<template>
  <div>
    <div class="q-pa-xl">
      <div class="q-pb-xs row q-gutter-md">
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
          :disable="full_pay"
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
          :disable="full_pay"
        />
      </div>
      <q-table
        v-if="datos.length"
        class="table"
        dark
        color="white"
        :data="datos"
        :columns="columns"
        :filter="filter"
        row-key="name"
      >
        <template v-slot:top-left>
          <div class="row">
            <div class="q-mr-xs">
              <q-btn label="Generar Pago" outline color="white" @click="generar()" :disable="!month || !year"/>
            </div>
            <div>
              <q-checkbox 
                v-model="full_pay" 
                @input="Pago_total()" 
                label="Pago Automático" 
                color="teal" 
                keep-color 
                :disable="!month || !year"
              />
            </div>
          </div>
        </template>

        <template v-slot:top-right>
          <q-input dark borderless dense debounce="300" v-model="filter" placeholder="Buscar">
            <q-icon slot="append" name="search" />
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr @click="open(props.row)" :props="props" class="cursor-pointer">
            <q-td key="nombre" :props="props">
              {{ props.row.nombre }}
            </q-td>
            <q-td key="apellido" :props="props">
              {{ props.row.apellido }}
            </q-td>
            <q-td key="cedula" :props="props">
              {{ props.row.cedula }}
            </q-td>
            <q-td key="numero_casa" :props="props">
              {{ props.row.numero_casa }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="dialog">
      <q-card class="bg-drawer" style="width: 50%">
        <q-card-section class="text-center text-weight-bolder text-white">
          <div class="text-h6">
            {{form.nombre + ' ' + form.apellido}}
          </div>
          <div class="text-title">
            {{form.cedula}}
          </div>
        </q-card-section>
        <q-card-section class="justify-center q-gutter-md">
          <div align="center">
            <div>
              <q-input
                ref="amount" 
                style="width: 250px"
                v-model="form.amount"
                prefix="Bss"
                label="Monto del mes"
                :rules="[val => !!val || 'campo requerido']" 
                color="white" 
                type="number"
                dark
                class="col-md-3 col-xs-12"
              />
            </div>
            <div v-if="form.descontar_disponibles" class="q-mt-sm">
              <q-checkbox 
                color="teal" 
                keep-color
                class="text-white"
                v-model="form.descontar_adelanto" 
                label="Descontar adelantos" 
              />
            </div>
          </div>
          <q-card-actions align="center">
            <q-btn label="Listo" outline color="white" v-close-popup style="width: 150px"/>
          </q-card-actions>

        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
  data () {
    return {
      year: this.$moment().year(),
      month:  Number(this.$moment().format('M')),
      form: {},
      dialog:false,
      filter: null,
      full_pay: false,
      datos: [],
      columns:[
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'apellido', align: 'left', label: 'Apellido', field: 'apellido', sortable: true },
        { name: 'cedula', align: 'center', label: 'Cedula', field: 'cedula', sortable: true },
        { name: 'numero_casa', align: 'center', label: 'Nº casa', field: 'numero_casa', sortable: true },
      ]
    }
  },
  watch:{
  },
  computed: {
    ...mapState('example',['condominium']),
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
    async get() {
      this.$q.loading.show()
      await this.$axios2.post('pagos/get_users', {
       condominium: this.condominium 
      }).then(res => {
        this.datos = res.result
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    },
    async open(row){
      this.form = row
      this.dialog = true
    },
    async Pago_total() {
      this.$q.loading.show()
      var verific = await this.verific_mensualidad()
      if (verific) return
      await this.$axios.post('pagos/automatico', {
        usuarios: this.datos,
        year: this.year,
        month: this.month,
        full_pay: this.full_pay,
        condominium: this.condominium 
      }).then(async res => {
        this.datos = res.result
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
        this.$q.notify({
          message: "hubo un error",
          color: 'negative'
        })
      })
    },
    async generar() {
      this.$q.loading.show()

      // verificar mensualidad segun mes y año
      var verific = await this.verific_mensualidad()
      if (verific) return

      // verificar pagos generados segun mes y año
      var verific_pay = await this.verific_pagos_generados()
      if (verific_pay) return

      var verific_amount = await this.verific_monto()
      if (verific_amount) return 

      await this.$axios.post('pagos/generar',{
        datos: this.datos,
        year: this.year,
        month: Number(this.month),
      }).then(async res => {
        this.$q.loading.hide()
        this.$q.notify({
          message:"Pago generado exitosamente!",
          color: "positive"
        })
        await this.get()
        this.full_pay = false
      }).catch(e => {
        this.$q.loading.hide()
        this.$q.notify({
          message: "hubo un error",
          color: 'negative'
        })
      })
    },
    async verific_pagos_generados() {
      var pagos = await this.$axios2.get('pagos', {
        filter: {
          year: this.year,
          month: this.month,
        }
      })
      if (pagos.length) {
        this.$q.dialog({
          title: 'Atención',
          message: '<span class="text-weight-bold text-body2">Según el mes y año ya se han generados pagos. Si desa volver a genenrar por favol elimine el anterior</span>',
          html: true
        }).onOk(() => {})
        this.$q.loading.hide()
        return true
      }
      return false
    },
    async verific_mensualidad() {
      var mensualidad = await this.$axios2.get('mensualidades', {
        filter: {
          year: this.year,
          month: this.month,
        }
      })
      if (!mensualidad.length) {
        this.$q.dialog({
          title: 'Atención',
          message: '<span class="text-weight-bold text-body2">No hay mensualidad configurada según el mes y año escogido</span>',
          html: true
        }).onOk(() => {})
        this.full_pay = false
        this.$q.loading.hide()
        return true
      }
      return false
    },
    async verific_monto() {
      var some = this.datos.some(v => v.amount == null)
      if (some){
        this.$q.loading.hide()
        this.$q.notify({
          message: 'Por favor asegurese que los usuarios no tengan el campo "Monto" vacío',
          color: 'negative'
        })
        return true
      }
      return false
    }
  },
  async mounted() {
    await this.get()
  }
}
</script>
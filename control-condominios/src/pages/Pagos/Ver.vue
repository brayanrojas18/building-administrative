<template>
  <div>
    <div class="q-pl-xl q-pt-sm">
      <q-btn flat round icon="arrow_back" color="white" @click="$router.go(-1)"/>
    </div>
    <div class="q-pa-xl">
      <div class="q-pb-xs row q-gutter-md items-center">
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
          disable
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
          disable
        />
        <div>
          <q-btn outline label="Elimnar" @click="remove" color="white"/>
        </div>
      </div>
      <q-table
        class="table"
        dark
        color="white"
        :no-data-label="no_data_message"
        :data="records"
        :columns="columns"
        :filter="filter"
        row-key="name"
        :title="createdAt"
      >
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
    <q-dialog v-model="dialog" @hide="form = {}">
      <q-card class="bg-drawer" style="width: 50%">
        <div class="q-ml-xs q-mt-xs">
          <q-btn flat round icon="reply" color="white" v-close-popup/>
        </div>
        <q-card-section class="text-center text-weight-bolder text-white">
          <div class="text-h6">
            {{form.nombre + ' ' + form.apellido}}
          </div>
          <div class="text-title">
            {{form.cedula}}
          </div>
        </q-card-section>
        <q-card-section class="row q-gutter-md">
          <div>
            <q-input
              style="width: 250px"
              v-model="form.mensualidad_config"
              prefix="Bss"
              label="Monto de mensualidad"
              color="white"
              type="number"
              dark
              class="col-md-3 col-xs-12"
              readonly
            />
          </div>
          <div>
            <q-input
              style="width: 250px"
              v-model="form.amount"
              prefix="Bss"
              label="Monto pagado del mes"
              color="white"
              type="number"
              dark
              class="col-md-3 col-xs-12"
              readonly
            />
          </div>
          <div>
            <q-input
              style="width: 250px"
              v-model="form.adelanto"
              prefix="Bss"
              label="Adelanto del mes"
              color="white"
              type="number"
              dark
              class="col-md-3 col-xs-12"
              readonly
            />
          </div>
          <div>
            <q-input
              style="width: 250px"
              v-model="form.deuda"
              prefix="Bss"
              label="Deuda del mes"
              color="white"
              type="number"
              dark
              class="col-md-3 col-xs-12"
              readonly
            />
          </div>
          <div>
            <q-input
              style="width: 250px"
              v-model="form.descontar_adelanto"
              label="Adelanto Disponibles descontados"
              color="white"
              dark
              class="col-md-3 col-xs-12"
              readonly
            />
          </div>
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
      no_data_message: "",
      year: null,
      month:  null,
      createdAt: null,
      form: {},
      dialog:false,
      filter: null,
      full_pay: false,
      records: [],
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
      await this.$axios2.post('pagos-generados/get_pagos', {
        id: this.$route.params.id,
        condominium: this.condominium
      }).then(res => {
        this.records = res.result
        this.$q.loading.hide()
      }).catch(e => {
        this.no_data_message = "Ha habido un problema para mostrar el pago generado."
        this.$q.loading.hide()
      })
    },
    async get_fecha() {
      await this.$axios2.get('pagos-generados/' + this.$route.params.id).then(res => {
        this.year = res.year
        this.month = Number(res.month)
        this.createdAt = `Pago generado el ${this.$moment(res.createdAt).format('DD-MM-YYYY')}`

        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    },
    async open(row){
      this.form = row
      this.dialog = true
    },
    async remove() {
      this.$q.dialog({
          title: 'Eliminar',
          message: '¿Segúro que quiere eliminar este pago?',
          cancel: 'Cancelar',
          persistent: true,
      }).onOk(async () => {
        this.$q.loading.show()
        await this.$axios2.post('pagos-generados/delete_pago', {
          id: this.$route.params.id
        }).then(res => {
          this.$router.go(-1)
          this.$q.loading.hide()
        }).catch(e => {
          this.$q.loading.hide()
        })
      }).onCancel(() => {
      })
    },
  },
  async mounted() {
    await this.get()
    await this.get_fecha()
  }
}
</script>

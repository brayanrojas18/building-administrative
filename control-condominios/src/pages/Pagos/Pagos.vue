<template>
  <div>
    <div class="q-pa-xl">
      <q-table
        class="table"
        dark
        color="white"
        :data="datos"
        :columns="columns"
        :filter="filter"
        row-key="name"
        title="Pagos Generados"
        :no-data-label="no_data_message"
      >
        <template v-slot:top-right>
          <q-input dark borderless dense debounce="300" v-model="filter" placeholder="Buscar">
            <q-icon slot="append" name="search" />
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td key="year" :props="props">
              {{ props.row.year }}
            </q-td>
            <q-td key="month" :props="props">
              {{ props.row.month }}
            </q-td>
            <q-td key="createdAt" :props="props">
              {{ $moment(props.row.createdAt).format('YYYY-MM-DD')}}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                color="white"
                outline
                label="Ver"
                size="sm"
                :to="'/pagos/ver/' + props.row.id"
              >
                <q-tooltip content-class="color-orange">Ver</q-tooltip>
              </q-btn>
              <q-btn
                color="white"
                outline
                label="Eliminar"
                size="sm"
                @click="remove(props.row.id)"
              >
                <q-tooltip content-class="color-orange">Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
  data () {
    return {
      no_data_message: "No se ha generado ningún pago aún.",
      filter: null,
      datos: [],
      columns:[
        {
          name: 'year',
          required: true,
          label: 'Año',
          align: 'left',
          field: row => row.year,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'month',
          required: true,
          label: 'Mes',
          align: 'center',
          field: 'month',
          sortable: true
        },
        {
          name: 'createdAt',
          required: true,
          label: 'Fecha de creación',
          align: 'center',
          field: 'createdAt',
          sortable: true
        },
        { name: 'actions', align: 'right', label: 'Acciones', field: 'actions', sortable: true }
      ]
    }
  },
  methods:{
    async get() {
      this.$q.loading.show()
      await this.$axios2.get('pagos-generados').then(res => {
        this.datos = res
        this.$q.loading.hide()
      }).catch(e => {
        this.no_data_message = "Ha habido un problema para mostrar los pagos generados."
        this.$q.loading.hide()
      })
    },
    async remove(id) {
      this.$q.dialog({
          title: 'Eliminar',
          message: '¿Segúro que quiere eliminar este pago?',
          cancel: 'Cancelar',
          persistent: true,
      }).onOk(async () => {
        this.$q.loading.show()
        await this.$axios2.post('pagos-generados/delete_pago', {
          id: id
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
  }
}
</script>

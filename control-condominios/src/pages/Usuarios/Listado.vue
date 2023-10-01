<template>
  <div>
    <div class="q-pa-xl">
      <div class="q-pb-md">
        <q-btn label="Nuevo Usuario" to="/usuarios/crear" outline color="white" icon="add"/>
      </div>
      <q-table
        class="table"
        title="Usuarios"
        :data="data"
        :columns="columns"
        :filter="filter"
        row-key="name"
        :no-data-label="no_data_message"
      >
        <template v-slot:top-right>
          <q-input dark borderless dense debounce="300" v-model="filter" placeholder="Buscar">
            <q-icon slot="append" name="search" />
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="first_name" :props="props">
              {{ props.row.first_name }}
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.last_name }}
            </q-td>
            <q-td key="identity_card" :props="props">
              {{ props.row.identity_card }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="createdAt" :props="props">
              {{ $moment(props.row.createdAt).format('YYYY-MM-DD')}}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                  color="white"
                  outline
                  label="Editar" 
                  :to="'/usuarios/crear/' + props.row.id"
                  size="sm"
                >
                  <q-tooltip content-class="color-orange">Editar</q-tooltip>
                </q-btn>
                <q-btn
                  color="white"
                  outline
                  label="Ver" 
                  :to="'/usuarios/ver/' + props.row.id"
                  size="sm"
                >
                  <q-tooltip content-class="color-orange">Ver</q-tooltip>
                </q-btn>
                <q-btn
                  color="white"
                  outline
                  label="Eliminar" 
                  :loading="loading"
                  @click="eliminar(props.row.id)"
                  size="sm"
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
      no_data_message: "No se han registrado usuarios.",
      data: [],
      filter:'',
      loading: false,
      columns: [
        {
          name: 'first_name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.first_name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'last_name', align: 'center', label: 'Apellido', field: 'last_name', sortable: true },
        { name: 'identity_card', align: 'right', label: 'Cedula', field: 'identity_card', sortable: true },
        { name: 'email', align: 'right', label: 'Correo', field: 'email', sortable: true },
        { name: 'createdAt', align: 'right', label: 'Fecha de creación', field: 'createdAt',sortable: true},
        { name: 'actions', align: 'right', label: 'Acciones', sortable: true },
      ],
    }
  },
  watch:{
  },
  computed: {
  },
  methods:{
    async getList() {
      this.$q.loading.show()
      await this.$axios2.get('usuarios', {
        filter: {
          role:'user'
        }
      }).then(val => {
        this.data = val
        this.$q.loading.hide()
      }).catch(e => {
        this.no_data_message = "Ha habido un problema para mostrar los usuarios registrados."
        this.$q.loading.hide()
      })
    },
    async eliminar(id) {
      this.$q.dialog({
          title: 'Eliminar',
          message: '¿Segúro que quiere eliminar este Usuario?',
          cancel: 'Cancelar',
          persistent: true,
      }).onOk(async () => {

        this.loading = true
        await this.$axios2.delete('usuarios/' + id).then(async val => {
          this.$q.notify({
            message:'Usuario Eliminado',
            color:'positive'
          })
          this.loading = false
          await this.getList()
        }).catch(e => {
          this.loading = false
          this.$q.notify('Ups hubo un error')
        })
      }).onCancel(() => {
      })
    }
  },
  async mounted() {
    await this.getList()
  }
}
</script>
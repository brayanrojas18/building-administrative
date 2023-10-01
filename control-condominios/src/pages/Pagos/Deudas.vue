<template>
  <div>
    <div class="q-pa-xl">
      <div
        v-if="!datos.length"
        class="text-center text-white text-weight-bold text-h3"
      >
        No hay deudas disponibles
      </div>
      <q-table
        v-if="datos.length"
        title="Usuarios con Deuda"
        class="table q-mt-md"
        dark
        color="white"
        :data="datos"
        :columns="columns"
        :filter="filter"
        row-key="name"
      >
        <template v-slot:top-right>
          <q-input
            dark
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <q-icon slot="append" name="search" />
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr
            @click="selected(props.row.id)"
            :props="props"
            class="cursor-pointer"
          >
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

      <q-dialog v-model="open">
        <q-card class="bg-drawer" style="width: 700px; max-width: 80vw">
          <q-card-actions>
            <q-btn flat round icon="reply" color="white" v-close-popup />
          </q-card-actions>
          <q-card-section class="q-pt-none">
            <q-table
              class="table q-mt-md"
              dark
              color="white"
              :data="records"
              :columns="columns_adelantos"
              :filter="filter2"
              title="Deudas"
              row-key="name"
            >
              <template v-slot:top-right>
                <q-input
                  dark
                  borderless
                  dense
                  debounce="300"
                  v-model="filter2"
                  placeholder="Buscar"
                >
                  <q-icon slot="append" name="search" />
                </q-input>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" class="cursor-pointer">
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}$
                  </q-td>
                  <q-td key="month" :props="props">
                    {{ props.row.month }}
                  </q-td>
                  <q-td key="year" :props="props">
                    {{ props.row.year }}
                  </q-td>
                  <q-td key="active" :props="props">
                    {{ !props.row.active ? "Disponible" : "Cobrado" }}
                  </q-td>
                  <q-td key="createdAt" :props="props">
                    {{ $moment(props.row.createdAt).format("YYYY-MM-DD") }}
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      v-if="props.row.active"
                      color="white"
                      outline
                      label="Eliminar"
                      size="sm"
                      @click="eliminar(props.row.id)"
                    >
                      <q-tooltip content-class="color-orange"
                        >Eliminar</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      color="white"
                      outline
                      label="Ver"
                      size="sm"
                      @click="ver(props.row)"
                    >
                      <q-tooltip content-class="color-orange"
                        >Ver Más</q-tooltip
                      >
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="view" persistent>
        <q-card class="bg-drawer">
          <q-btn
            flat
            round
            icon="reply"
            color="white"
            @click="(form = {}), (view = false)"
            v-close-popup
            class="q-ml-xs q-mt-xs"
          />
          <q-card-section class="justify-center row q-gutter-md">
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                v-model="form.amount"
                label="Monto"
                type="number"
                color="white"
                dark
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                v-model="form.year"
                label="Año de pago"
                type="number"
                color="white"
                dark
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-select
                readonly
                v-model="form.month"
                label="Mes de pago"
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
                color="white"
                dark
                map-options
                emit-value
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                readonly
                v-model="!form.active ? 'Disponible' : 'Cobrado'"
                label="Estatus"
                color="white"
                dark
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-select
                v-if="form.month_pago"
                readonly
                v-model="form.month_pago"
                label="Mes de cobro"
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
                color="white"
                dark
                map-options
                emit-value
              />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-input
                v-if="form.year_pago"
                readonly
                v-model="form.year_pago"
                label="Año de cobro"
                color="white"
                dark
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      datos: [],
      records: [],
      filter: "",
      filter2: "",
      loading: false,
      open: false,
      view: false,
      form: {},
      columns: [
        {
          name: "nombre",
          required: true,
          label: "Nombre",
          align: "left",
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "apellido",
          align: "center",
          label: "Apellido",
          field: "apellido",
          sortable: true,
        },
        {
          name: "cedula",
          align: "right",
          label: "Cedula",
          field: "cedula",
          sortable: true,
        },
        {
          name: "numero_casa",
          align: "right",
          label: "Correo",
          field: "numero_casa",
          sortable: true,
        },
      ],
      columns_adelantos: [
        {
          name: "amount",
          required: true,
          label: "Monto",
          align: "left",
          field: (row) => row.amount,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "month",
          align: "center",
          label: "Mes",
          field: "month",
          sortable: true,
        },
        {
          name: "year",
          align: "center",
          label: "Año",
          field: "year",
          sortable: true,
        },
        {
          name: "active",
          align: "center",
          label: "Estatus",
          field: "active",
          sortable: true,
        },
        {
          name: "createdAt",
          align: "center",
          label: "Fecha de creación",
          field: "createdAt",
          sortable: true,
        },
        {
          name: "actions",
          align: "right",
          label: "Acciones",
          field: "actions",
          sortable: true,
        },
      ],
    };
  },
  watch: {},
  computed: {
    ...mapState("example", ["condominium"]),
  },
  methods: {
    async getList() {
      this.$q.loading.show();
      await this.$axios2
        .post("deudas/get_users", {
          condominium: this.condominium,
        })
        .then((res) => {
          this.datos = res.result;
          this.$q.loading.hide();
        })
        .catch((e) => {
          this.$q.loading.hide();
        });
    },
    async selected(id) {
      this.$q.loading.show();
      await this.$axios2
        .post("deudas/selected", {
          id: id,
          condominium: this.condominium,
        })
        .then((res) => {
          this.records = res.result;
          this.open = true;
          this.$q.loading.hide();
        })
        .catch((e) => {
          this.$q.loading.hide();
        });
    },
    async eliminar(id) {
      this.$q
        .dialog({
          title: "Eliminar",
          message: "¿Segúro que quiere eliminar este Adelanto?",
          cancel: "Cancelar",
          persistent: true,
        })
        .onOk(async () => {
          await this.$axios2
            .delete("adelantos/" + id)
            .then(async (val) => {
              this.$q.notify({
                message: "Adelanto Eliminado",
                color: "positive",
              });
              await this.getList();
            })
            .catch(() => {
              this.$q.notify({
                message: "Ups hubo un error",
                color: "negative",
              });
            });
        })
        .onCancel(() => {});
    },
    async ver(row) {
      this.form = row;
      this.view = true;
    },
  },
  async mounted() {
    await this.getList();
  },
};
</script>

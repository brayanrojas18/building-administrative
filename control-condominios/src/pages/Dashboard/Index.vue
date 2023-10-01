<template>
  <div>
    <div class="text-weight-bolder text-h2 text-white text-center q-mt-xl">
      DASHBOARD
    </div>
    <div id="div" class="q-pa-md q-mx-md row justify-center items-start q-gutter-md">
      <q-card id="tarjeta">
        <q-card-section class="row q-gutter-md">
          <q-avatar size="80px" font-size="52px" color="teal" text-color="white" icon="house" />
          <div>
            <div class="text-weight-bolder text-h6">
              Total Usuarios
            </div>
            <div class="text-subtitle1 text-weight-bolder">
              {{this.data.total}}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card id="tarjeta">
        <q-card-section class="row q-gutter-md">
          <q-avatar size="80px" font-size="52px" color="positive" text-color="white" icon="attach_money" />
          <div>
            <div class="text-weight-bolder text-h6">
              Total Solventes
            </div>
            <div class="text-weight-bolder">
              Mes Actual
            </div>
            <div class="text-subtitle1">
              {{this.data.total}}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card id="tarjeta">
        <q-card-section class="row q-gutter-md">
          <q-avatar size="80px" font-size="52px" color="negative" text-color="white" icon="money_off" />
          <div>
            <div class="text-weight-bolder text-h6">
              Total Deudores
            </div>
            <div class="text-weight-bolder">
              Mes Actual
            </div>
            <div class="text-subtitle1">
              {{this.data.total}}
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
  name: 'PageIndex',
  data () {
    return {
      rows:[],
      data:{
        total: null
      }
    }
  },
  computed: {
    ...mapState('example',['user'])
  },
  methods:{
    async get() {
      this.$q.loading.show()
      await this.$axios2.get('usuarios').then(val => {
        if (val.length) {
          this.rows = val.filter(v => v.role == 'user')
        }
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    },
    Dashboard() {
      this.data.total = this.rows.length ? this.rows.length : 0
    }
  },
  async mounted() {
    await this.get()
    await this.Dashboard()
  }
}
</script>

<style type="text/css">
  #tarjeta{
    background: rgba(102, 45, 145, 0.2);
    color:#ffffff;
    border-radius: 10px;
    width: 30%;
    margin-top: 30px;
  }
  #div{
    margin-top: 5px;
    border-radius: 20px;
    background: rgba(102, 45, 145, 0.1);
  }
</style>

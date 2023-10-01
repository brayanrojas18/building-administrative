<template>
  <q-page id="fondo">
  	<div class="float-right q-pt-md q-pr-md">
	  	<q-btn color="white" flat round icon="fas fa-ellipsis-v">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="logout()">
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
        </q-btn>
  	</div>
    <div class="q-pa-md">
        <div class="row q-gutter-sm justify-center items-end" v-if="!crear">
        	<div>
        		<img src="~assets/isotipo.png" width="200px">
        	</div>
	        <div class="q-pa-md text-h3 text-white text-weight-bolder">
		  		PANEL DE CONTROL GENERAL
		  	</div>
        </div>

	    <!-- DASHBOARD -->
	    <q-card v-if="dashboard" class="q-mt-md q-mx-xl transparent">
		  <q-btn-group spread id="btns">
		    <q-btn style="height: 70px" push  @click="panel('dashboard')">
		    	<q-icon left size="3em" name="dashboard" />
  				<div class="text-weight-bolder text-h6">Dashboard</div>
		    </q-btn>
		    <q-btn style="height: 70px" push @click="panel('control')">
		    	<q-icon left size="3em" name="supervisor_account" />
  				<div class="text-weight-bolder text-h6">Control</div>
		   	</q-btn>
		  </q-btn-group>
	      <q-card-section>
	        <div class="text-h4 text-center text-white text-weight-bold q-pa-md">CONDOMINIOS ACTUALES</div>

	        <div class="q-pa-md row justify-star q-gutter-xl text-weight-bold">
	        	<q-card bordered id="card" class="col-md-3 col-xs-12" v-for="row in data" :key="row.name">
			      <q-card-section class="row q-gutter-sm items-end">
			      	<div>
			      		<img src="~assets/isotipo_white.png" width="50px">
			      	</div>
			        <div class="text-h6">{{row.name}}</div>
			      </q-card-section>

			      <q-separator inset dark/>

			      <q-card-section>
			        <div>
			        	Administrador: {{row.email}}
			        </div>
			        <div>
			        	N° Casas: {{0}}
			        </div>
			        <div>
			        	Estatus: {{row.active ? 'Activo' : 'Inactivo'}}  
			        	<q-icon :name="row.active ? 'check_circle' : 'cancel'" :color="row.active ? 'light-green-13' : 'negative'" size="sm"/>
			        </div>
			      </q-card-section>
			    </q-card>
	        </div>
	      </q-card-section>
	    </q-card>

	    <!-- CONTROL -->
	    <q-card v-if="control" class="q-mt-md q-mx-xl transparent">
	        <q-btn-group spread id="btns">
			    <q-btn style="height: 70px" push  @click="panel('dashboard')">
			    	<q-icon left size="3em" name="dashboard" />
						<div class="text-weight-bolder text-h6">Dashboard</div>
			    </q-btn>
			    <q-btn style="height: 70px" push @click="panel('control')">
			    	<q-icon left size="3em" name="supervisor_account" />
						<div class="text-weight-bolder text-h6">Control</div>
			   	</q-btn>
		    </q-btn-group>
	        <div class="text-h4 text-center text-white text-weight-bold q-pa-md">ADMINISTRACIÓN DE CONDOMINIOS</div>

	        <div class="q-pa-md">
	        	<div class="q-mb-md">
	        		<q-btn flat color="white" icon-right="add" label="Crear Condominio" @click="panel('crear')"/>
	        	</div>
			    <q-table
			      id="tabla"
			      title="Condominios"
			      :data="data"
			      :columns="columns"
			      :filter="filter"
			      row-key="name"
			    >
			    	<template v-slot:top-right>
				        <q-input dark borderless dense debounce="300" v-model="filter" placeholder="Buscar">
				          <q-icon slot="append" name="search" />
				        </q-input>
				    </template>

				   <template v-slot:body="props">
				        <q-tr :props="props">
				          <q-td key="name" :props="props">
				            {{ props.row.name }}
				          </q-td>
				          <q-td key="email" :props="props">
				            {{ props.row.email }}
				          </q-td>
				          <q-td key="active" :props="props">
				            {{ props.row.active ? 'Activo' : 'Inactivo' }}
				          </q-td>
				          <q-td key="actions" :props="props">
				            <q-btn
			                  color="white"
			                  round
			                  icon="edit"
			                  flat 
			                  @click="editar(props.row.id)"
			                >
			                	<q-tooltip content-class="color-orange">Editar</q-tooltip>
			                </q-btn>
			                <q-btn
			                  color="white"
			                  round
			                  icon="delete"
			                  flat 
			                  @click="eliminar(props.row.id)"
			                >
			                	<q-tooltip content-class="color-orange">Eliminar</q-tooltip>
			                </q-btn>
			                <q-btn
			                  color="white"
			                  round
			                  :loading="loading_estatus"
			                  :icon="props.row.active ? 'block' : 'check_circle_outline'"
			                  flat 
			                  @click="changedStatus(props.row.id, (props.row.active ? false : true))"
			                >
			                	<q-tooltip content-class="color-orange">{{props.row.active ? 'Bloquear' : 'Activar'}}</q-tooltip>
			                </q-btn>
				          </q-td>
				        </q-tr>
				      </template>
			    </q-table>
			</div>
	      </q-card-section>
	    </q-card>


	    <!-- CREAR -->
	    <q-card v-if="crear" class="q-mt-md q-mx-xl transparent">
	    	<div class="q-pt-md q-ml-md">
        		<q-btn flat color="white" icon="reply" label="Volver" @click="form = {}, panel('control')"/>
        	</div>
	       <div class="row items-center">
		       	<div class="q-pa-xl colum">
		        	<div class="text-weight-bolder text-white text-h4">
		        		Datos del condominio
		        	</div>
				    <div id="input" class="text-center" align="center">
				    	<q-input
				    		ref="name"
				    		dark
				    		:rules="[val => !!val || 'campo requerido']" 
				    		color="white" 
				    		v-model="form.name" 
				    		@keyup.enter="save()"	
				    		label="Nombre del  condominio"
				    	/>
				    </div>
				    <div id="input">
				    	<q-input 
				    		ref="first_name"
				    		dark
				    		:rules="[val => !!val || 'campo requerido']" 
				    		color="white" 
				    		v-model="form.first_name" 
				    		@keyup.enter="save()"	
				    		label="Nombre del Administrador"
				    	/>
				    </div>
				    <div id="input">
				    	<q-input
				    		ref="last_name" 
				    		dark
				    		:rules="[val => !!val || 'campo requerido']" 
				    		color="white" 
				    		v-model="form.last_name" 
				    		@keyup.enter="save()"	
				    		label="Apellido del Administrador"
				    	/>
				    </div>
				    <div id="input">
				    	<q-input
				    		ref="email" 
				    		dark
				    		:rules="[val => !!val || 'campo requerido']" 
				    		color="white" 
				    		v-model="form.email" 
				    		@keyup.enter="save()"	
				    		label="Correo"
				    		type="email"
				    	/>
				    </div>
				    <div id="input" v-if="!form.id">
				    	<q-input
				    		ref="password" 
				    		dark
				    		:rules="[val => !!val || 'campo requerido']" 
				    		color="white" 
				    		v-model="form.password" 
				    		@keyup.enter="save()"	
				    		label="Contraseña"
				    		:type="isPwd ? 'password' : 'text'"
				    	>
				    		<template v-slot:append>
					          <q-icon
					            :name="isPwd ? 'visibility_off' : 'visibility'"
					            class="cursor-pointer"
					            @click="isPwd = !isPwd"
					          />
					        </template>
				    	</q-input>
				    </div>
				    <div v-if="form.id">
				    	<q-btn label="Cambiar Contraseña" color="white" outline class="q-my-md" @click="prompt = true" />
				    	<q-dialog v-model="prompt" persistent>
					      <q-card style="min-width: 350px" class="transparent">
					        <q-card-section>
					          <div class="text-h6 text-white">Nueva Contraseña</div>
					        </q-card-section>

					        <q-card-section class="q-pt-none">
					          <q-input
						    		ref="password" 
						    		dark
						    		:rules="[val => !!val || 'campo requerido']" 
						    		color="white" 
						    		v-model="form.password" 
						    		@keyup.enter="save()"	
						    		label="Contraseña"
						    		:type="isPwd ? 'password' : 'text'"
						    	>
						    		<template v-slot:append>
							          <q-icon
							            :name="isPwd ? 'visibility_off' : 'visibility'"
							            class="cursor-pointer"
							            @click="isPwd = !isPwd"
							          />
							        </template>
						    	</q-input>
					        </q-card-section>

					        <q-card-actions align="right">
					          <q-btn class="color-orange text-white" label="Cancelar" v-close-popup @click="form.password = null"/>
					          <q-btn class="color-orange text-white" label="Cambiar" v-close-popup @click="save()"/>
					        </q-card-actions>
					      </q-card>
					    </q-dialog>
				    </div>
				    <q-btn id="input" class="q-my-md color-orange" @click="save()" :loading="loading">
		              <div class="text-center text-weight-bolder text-white">
		                Crear
		              </div>
		            </q-btn>
				</div>
				<div>
					<img src="~assets/logo.png" style="width: 20vw"/>
				</div>
	       </div>
	      </q-card-section>
	    </q-card>
	</div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
    	dashboard: true,
    	control: false,
    	crear: false,
    	filter: null,
    	loading: false,
    	form:{},
    	isPwd: true,
    	data:[],
    	prompt: false,
    	loading_estatus: false,

    	columns: [
        {
          name: 'name',
          required: true,
          label: 'Condominios',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'email', align: 'center', label: 'Usuario Administrador', field: 'email', sortable: true },
        { name: 'active', align: 'right', label: 'Estado', field: 'active', sortable: true },
        { name: 'actions', align: 'right', label: 'Acciones', sortable: true },
      ],
    }
  },
  methods:{
  	panel(val) {
  		if (val == 'dashboard') {
  			this.dashboard = true
  			this.control = false
  			this.crear = false
  		}
  		if (val == 'control') {
  			this.control = true
  			this.dashboard = false
  			this.crear = false
  		}
  		if (val == 'crear') {
  			this.crear = true
  			this.control = false
  			this.dashboard = false
  			this.$q.notify({
  				icon:'announcement',
		        message: 'Recuerda, todos los campos son necesarios',
		        color: 'positive'
		    })
  		}
  	},
  	async save() {
  		
  		this.loading = true
		if (!this.form.id) {
			if (!this.$refs.name.validate() || !this.$refs.first_name.validate() || !this.$refs.last_name.validate() || 
				!this.$refs.email.validate() || !this.$refs.password.validate()) {
				this.loading = false
				return this.$q.notify({
					message: 'Campo requerido',
					color: 'negative'
				})
			}
			
			if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
				.test(this.form.email)){
					this.loading = false
			    return this.$q.notify({
					message: 'La dirección de correo no es valida',
					color: 'negative'
				})
			} 

			var validar = false
			if(this.form.password.length >= 8){		
				var mayuscula = false;
				var minuscula = false;
				var numero = false;
				var caracter_raro = false;
				
				for(var i = 0;i<this.form.password.length;i++)
				{
					if(this.form.password.charCodeAt(i) >= 65 && this.form.password.charCodeAt(i) <= 90)
					{
						mayuscula = true;
					}
					else if(this.form.password.charCodeAt(i) >= 97 && this.form.password.charCodeAt(i) <= 122)
					{
						minuscula = true;
					}
					else if(this.form.password.charCodeAt(i) >= 48 && this.form.password.charCodeAt(i) <= 57)
					{
						numero = true;
					}
					else
					{
						caracter_raro = true;
					}
				}
				if(mayuscula == true && minuscula == true && caracter_raro == true && numero == true)
				{
					validar = true
				}
			}
			if (!validar) {
				this.loading = false
				return this.$q.notify({
					message: 'La Contraseña debe de tener: Mayusculas, Minusculas, caracter especial y numeros',
					color: 'negative'
				})
			}

			try{
	  			var promise = await this.$axios.post('condominios', {
		  			name: this.form.name,
					email: this.form.email,
					active: true,
		  		})

		  		await this.$axios.post('usuarios', {
		  			first_name: this.form.first_name,
					last_name: this.form.last_name,
					email: this.form.email,
					password: this.form.password,
					condominium: promise.id,
					role: 'admin',
		  		}).then(async v => {
		  			await this.$axios.put('condominios/' + promise.id, {
			  			...promise,
			  			admin: v.id,
			  			condominium: promise.id,
			  		})

			  		await this.getList()
			  		this.loading = false
			  		this.panel('control')
			  		this.$q.notify({
				        message: 'Condominio creado!',
				        color: 'positive'
				    })
		  		})
	  		}catch(error) {
	  			this.loading = false
	  			this.$q.notify({
			        message: 'Ups hubo un error',
			        color: 'negative'
			    })
	  		}
		}else{
			if (this.form.password) {
				if (!this.$refs.name.validate() || !this.$refs.first_name.validate() || !this.$refs.last_name.validate() || 
					!this.$refs.email.validate() || !this.$refs.password.validate()) {
					this.loading = false
					return this.$q.notify({
						message: 'Campo requerido',
						color: 'negative'
					})
				}
			}else{
				if (!this.$refs.name.validate() || !this.$refs.first_name.validate() || !this.$refs.last_name.validate() || 
					!this.$refs.email.validate()) {
					this.loading = false
					return this.$q.notify({
						message: 'Campo requerido',
						color: 'negative'
					})
				}
			}
			
	  		if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
				.test(this.form.email)){
	  			this.loading = false
			    return this.$q.notify({
					message: 'La dirección de correo no es valida',
					color: 'negative'
				})
			} 

			var validar = false
			if(this.form.password && this.form.password.length >= 8){		
				var mayuscula = false;
				var minuscula = false;
				var numero = false;
				var caracter_raro = false;
				
				for(var i = 0;i<this.form.password.length;i++)
				{
					if(this.form.password.charCodeAt(i) >= 65 && this.form.password.charCodeAt(i) <= 90)
					{
						mayuscula = true;
					}
					else if(this.form.password.charCodeAt(i) >= 97 && this.form.password.charCodeAt(i) <= 122)
					{
						minuscula = true;
					}
					else if(this.form.password.charCodeAt(i) >= 48 && this.form.password.charCodeAt(i) <= 57)
					{
						numero = true;
					}
					else
					{
						caracter_raro = true;
					}
				}
				if(mayuscula == true && minuscula == true && caracter_raro == true && numero == true)
				{
					validar = true
				}
			}
			if (this.form.password && !validar) {
				this.loading = false
				return this.$q.notify({
					message: 'La Contraseña debe de tener: Mayusculas, Minusculas, caracter especial y numeros',
					color: 'negative'
				})
			}

			try{
	  			var promise = await this.$axios.patch('condominios/' + this.form.id, {
		  			name: this.form.name,
					email: this.form.email,
					active: true,
		  		})
	  			var put
	  			if (this.form.password) {
	  				put = this.$axios.patch('usuarios/' + this.form.admin, {
			  			first_name: this.form.first_name,
						last_name: this.form.last_name,
						email: this.form.email,
						password: this.form.password,
			  		})
	  			}else{
	  				put = this.$axios.patch('usuarios/' + this.form.admin, {
			  			first_name: this.form.first_name,
						last_name: this.form.last_name,
						email: this.form.email,
			  		})
	  			}
		  		put.then(async v => {
			  		await this.getList()
			  		this.loading = false
			  		this.$q.notify({
				        message: 'Condominio actualizado',
				        color: 'positive'
				    })
		  		})
	  		}catch(error) {
	  			this.loading = false
	  			this.$q.notify({
			        message: 'Ups hubo un error',
			        color: 'negative'
			    })
	  		}
		}
  	},
  	getList() {
  		this.$q.loading.show()
  		this.$axios.get('condominios')
  		.then(val => {
  			this.data = val
  			this.$q.loading.hide()
  		}).catch(e => {
  			this.$q.loading.hide()
  		})
  	},
  	async editar(id) {
  		this.$axios.get('condominios/' + id)
  		.then(async val => {
  			this.$axios.get('usuarios/' + val.admin).then(res => {
  				this.form = {...res, ...val}
  				this.crear = true
	  			this.control = false
	  			this.dashboard = false
  			}).catch(e => {
	  			this.$q.notify({
			        message: 'Ups hubo un error',
			        color: 'negative'
			    })
	  		})
  		}).catch(e => {
  			this.$q.notify({
		        message: 'Ups hubo un error',
		        color: 'negative'
		    })
  		})
  	},
  	eliminar(id) {
  		this.$q.dialog({
	        title: 'Eliminar',
	        message: '¿Segúro que quiere eliminar este condominio?',
	        cancel: 'Cancelar',
	        persistent: true,
	    }).onOk(async () => {
	    	this.$q.loading.show()
	  		await this.$axios.delete('condominios/' + id).then(v => {
	  			this.$q.notify({
			        message: 'condominio elimnado',
			        color: 'positive'
			    })
			    this.$q.loading.hide()
			    this.getList()
	  		}).catch(e => {
	  			this.$q.notify({
			        message: 'Ups hubo un error',
			        color: 'negative'
			    })
	  			this.$q.loading.hide()
	  		})
	    }).onCancel(() => {
	    })
  	},
  	changedStatus(id, active) {
  		this.loading_estatus = true
  		this.$q.dialog({
	        title: 'Cambiar Estatus',
	        message: '¿Segúro que quiere' + ' ' + (!active ? 'Bloquear' : 'Activar') + ' ' + 'este condominio?',
	        cancel: 'Cancelar',
	        persistent: true,
	    }).onOk(async () => {
	  		await this.$axios.patch('condominios/' + id, {
				active: active,
	  		}).then(v => {
	  			this.$q.notify({
			        message: 'Estatus Modificado',
			        color: 'positive'
			    })
			    this.loading_estatus = false
			    this.getList()
	  		}).catch(e => {
	  			this.$q.notify({
			        message: 'Ups hubo un error',
			        color: 'negative'
			    })
	  			this.loading_estatus = false
	  		})
	    }).onCancel(() => {
	        this.loading_estatus = false
	    })
  	},
  	async logout() {
      this.$q.sessionStorage.remove('userData')
      this.$q.sessionStorage.remove('user')
      this.$router.push('/login')
      if(!close)
        window.location.reload(false);
    }
  },
  async mounted(){
  	await this.getList()
  }
}
</script>

<style type="text/css">
	#fondo{
	    background-image: url("~assets/fondo_panel.png");
	    background-size:100% 100%; 
	    background-position: center;
	}
	#btns{
	    background: linear-gradient(#ff7655, #ffac4a);
	    color:#ffffff;
  	}
  	#card:hover{
	    background: linear-gradient(#ff7655, #ffac4a);
	    color:#ffffff;
  	}
  	#card{
	    background: rgba(102, 45, 145, 0.2);
	    color:#ffffff;
  	}
  	#tabla{
	    background: rgba(102, 45, 145, 0.5);
	    color:#ffffff;
  	}
  	#input{
	    width: 500px
  	}
</style>

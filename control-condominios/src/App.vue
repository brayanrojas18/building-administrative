<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex';
export default {
  name: 'App',
  computed: {
    ...mapState('example',['user'])
  },
  mounted() {
  	
  	if (Object.keys(this.user).length === 0) {
  	  this.$q.sessionStorage.remove('userData')
      this.$q.sessionStorage.remove('user')
      this.$router.push('/login')
      if(!close)
        window.location.reload(false);
  	}
  }
}
</script>

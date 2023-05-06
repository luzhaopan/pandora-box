<template>
  <div class="about">
    <div>login</div>
    <input type="text" v-model="username"  placeholder="请输入用户名">
    <button @click="handleEnter">enter</button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

onMounted(() => {
  if(sessionStorage.getItem('username')){
    router.push('/')
  }
})

const handleEnter = () => {
  const _username = username.value.trim()
  if(_username.length < 6) {
    alert('用户名长度小于6')
    return
  }
  sessionStorage.setItem('username', _username)
  router.push('/')
}

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

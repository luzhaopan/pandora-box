<template>
  <div>
    <div class="title">基础用法</div>
    <div style="width: 666px">
      <AutoInput v-model="state.value1" />
    </div>

    <div class="title">禁用状态</div>
    <div style="width: 666px">
      <AutoInput v-model="state.value2" disabled />
    </div>

    <div class="title">自定义placeholder</div>
    <div style="width: 666px">
      <AutoInput v-model="state.value2" placeholder="placeholder" />
    </div>

    <div class="title">可清空</div>
    <div style="width: 666px">
      <AutoInput v-model="state.value3" clearable />
    </div>

    <div class="title">change事件</div>
    <div style="width: 666px">
      <AutoInput @change="handleChange" />
    </div>
    <div>当前输入的值：{{ state.currentVal }}</div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import AutoInput from '../components/AutoInput.vue'

const state = reactive({
  currentVal: '',
  value1: '',
  value2: '',
  value3: '',
  value4: ''
})

const handleChange = (val) => {
  state.currentVal = val
}
</script>

<style scoped>
.title {
  margin: 20px 0 10px;
  font-size: 16px;
}
</style>



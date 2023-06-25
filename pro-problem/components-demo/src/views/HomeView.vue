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

    <div class="title">输入长度限制(限制10)</div>
    <div style="width: 666px">
      <AutoInput maxlength="10" />
    </div>

    <div class="title">输入框获得焦点</div>
    <div style="width: 666px">
      <AutoInput @focus="_onFocus" />
    </div>
    <div>输入框获得焦点触发：{{ state.focus }}</div>

    <div class="title">输入框失去焦点</div>
    <div style="width: 666px">
      <AutoInput @blur="_onBlur" />
    </div>
    <div>输入框获得焦点触发：{{ state.blur }}</div>
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
  value4: '',
  focus: null,
  blur: null
})

const handleChange = (val) => {
  state.currentVal = val
}

const _onFocus = (e) => {
  state.focus = e.type
}

const _onBlur = (e) => {
  state.blur = e.type
}
</script>

<style scoped>
.title {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>



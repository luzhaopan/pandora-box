<template>
  <div>
    <div>
      <div>消息列表</div>
      <div v-for="item in state.msgList" :key="item.id">
        user：{{ item.user }} -- msg：{{ item.msg }}
      </div>
    </div>

    <input type="text" v-model="state.msg" placeholder="请输入信息" />
    <button @click="handleSend">send</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useWebsocket } from '@/hooks'

const router = useRouter()

// 获取服务端广播过来的数据
const handleMessage = (e: any) => {
  if (e.data instanceof Blob) {
    const reader = new FileReader()
    reader.readAsText(e.data, 'UTF-8')
    const msg: any = reader.result
    reader.onload = () => {
      const _msg = JSON.parse(msg)
      console.log(_msg)

      state.msgList.push(_msg)
    }
  }
}

const ws = useWebsocket(handleMessage)

const state: any = reactive({
  msg: '',
  msgList: []
})

let username: any = ''

onMounted(() => {
  username = sessionStorage.getItem('username')
  if (!sessionStorage.getItem('username')) {
    router.push('/login')
  }
})

const handleSend = () => {
  const _msg = state.msg

  if (!_msg.trim().length) return
  ws.send(
    JSON.stringify({
      id: Math.random(),
      user: username,
      dateTime: new Date(),
      msg: _msg
    })
  )
  state.msg = ''
}
</script>

<template>
  <div class="main-container">
    <div>
      <div class="title">基础用法</div>
      <div style="width: 600px">
        <AutoInput v-model="state.value1" />
      </div>

      <div class="title">禁用状态</div>
      <div style="width: 600px">
        <AutoInput v-model="state.value2" disabled />
      </div>

      <div class="title">自定义placeholder</div>
      <div style="width: 600px">
        <AutoInput v-model="state.value2" placeholder="placeholder" />
      </div>

      <div class="title">可清空</div>
      <div style="width: 600px">
        <AutoInput v-model="state.value3" clearable />
      </div>

      <div class="title">change事件</div>
      <div style="width: 600px">
        <AutoInput @change="handleChange" />
      </div>
      <div>当前输入的值：{{ state.currentVal }}</div>

      <div class="title">输入长度限制(限制10)</div>
      <div style="width: 600px">
        <AutoInput maxlength="10" />
      </div>

      <div class="title">输入框自动获得焦点</div>
      <div style="width: 600px">
        <AutoInput focus />
      </div>

      <div class="title">输入框获得焦点</div>
      <div style="width: 600px">
        <AutoInput @focus="_onFocus" />
      </div>
      <div>输入框获得焦点触发：{{ state.focus }}</div>

      <div class="title">输入框失去焦点</div>
      <div style="width: 600px">
        <AutoInput @blur="_onBlur" />
      </div>
      <div>输入框获得焦点触发：{{ state.blur }}</div>
    </div>
    <div>
      <div class="title">Input Attributes</div>
      <table>
        <tr>
          <th>参数</th>
          <th>说明</th>
          <th>类型</th>
          <th>可选值</th>
          <th>默认值</th>
        </tr>
        <tr>
          <td>maxlength</td>
          <td>置为-1时不限制最大长度</td>
          <td>number</td>
          <td>——</td>
          <td>140</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>输入框占位文本</td>
          <td>string</td>
          <td>——</td>
          <td>——</td>
        </tr>
        <tr>
          <td>clearable</td>
          <td>是否可清空</td>
          <td>boolean</td>
          <td>——</td>
          <td>false</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>禁用</td>
          <td>boolean</td>
          <td>——</td>
          <td>false</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>禁用</td>
          <td>boolean</td>
          <td>——</td>
          <td>false</td>
        </tr>
        <tr>
          <td>focus</td>
          <td>是否自动获得焦点</td>
          <td>boolean</td>
          <td>——</td>
          <td>false</td>
        </tr>
      </table>

      <div class="title">Input Events</div>
      <table>
        <tr>
          <th>事件名称</th>
          <th>说明</th>
          <th>回调参数</th>
        </tr>
        <tr>
          <td>blur</td>
          <td>在 Input 失去焦点时触发</td>
          <td>(event: Event)</td>
        </tr>
        <tr>
          <td>focus</td>
          <td>在 Input 获得焦点时触发</td>
          <td>(event: Event)</td>
        </tr>
        <tr>
          <td>change</td>
          <td>输入框值发生变化时触发</td>
          <td>(value: string | number)</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import AutoInput from "../components/AutoInput.vue";

const state = reactive({
  currentVal: "",
  value1: "",
  value2: "",
  value3: "",
  value4: "",
  focus: null,
  blur: null,
});

const handleChange = (val) => {
  state.currentVal = val;
};

const _onFocus = (e) => {
  state.focus = e.type;
};

const _onBlur = (e) => {
  state.blur = e.type;
};
</script>

<style scoped>

.main-container {
  display: flex;
  justify-content: space-around;
}
.title {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 600;
}
table tbody tr {
  height: 30px;
}

table tbody th, td {
  padding: 5px 10px;
  border-bottom: 1px solid #e5e5e5;
}
</style>

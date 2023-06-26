<template>
  <div class="auto-input">
    <div
      class="input-box"
      ref="inputBox"
      :class="{ 'is-disabled': disabled }"
      :placeholder="placeholder"
      :contenteditable="!disabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="handleInputEvent"
    ></div>
    <img
      v-show="clearable && state.content"
      class="clear-icon"
      src="../assets/close.png"
      :style="{ left: left + 'px' }"
      @click="cleanContent"
      alt=""
    />
  </div>
</template>

<script setup>
/**
 * AutoInput 输入框
 * @property {String, Number}	value	输入内容
 * @property {Boolean}	clearable	是否显示右侧清空内容的图标控件，点击可清空输入框内容（默认true）
 * @property {String }	placeholder	输入框的提示文字
 * @property {Boolean}	focus	是否自动获得焦点（默认false）
 * @property {Boolean}	disabled	是否禁用（默认false）
 * @property {Number }	maxlength	最大输入长度，设置为 -1 的时候不限制最大长度（默认140）
 * @event {Function}	focus	输入框获得焦点时触发
 * @event {Function}	blur	输入框失去焦点时触发
 * @event {Function}	change	输入框值发生变化时触发
 */
import { onMounted, computed, ref, reactive } from 'vue'

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const inputBox = ref(null)

const state = reactive({
  content: '',
  left: 100
})

const props = defineProps({
  value: {
    type: [Number, String],
    default: ''
  },
  modelValue: [Number, String],
  placeholder: {
    type: String,
    default: '请输入...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [Number, String],
    default: 140
  }
})

onMounted(() => {
  init()
  props.focus && textFocus()
})

// 初始化变量值
const init = () => {
  if (props.value || props.value === 0) {
    handleInputContent(props.value)
  } else if (props.modelValue || props.modelValue === 0) {
    handleInputContent(props.modelValue)
  } else {
    handleInputContent('')
  }
}

// 获取输入框宽度
const left = computed(() => {
  return state.left
})

// 输入框输入触发
const handleInputEvent = (e) => {
  const value = e.target.innerHTML
  if (value.length >= props.maxlength && props.maxlength !== -1) {
    state.content = value.substring(0, props.maxlength)
    e.target.innerHTML = state.content
    textFocus()
  } else {
    state.content = value
  }
  emit('update:modelValue', state.content)
  emit('change', state.content)
  const dom = inputBox.value
  state.left = dom && dom.offsetWidth
}

// 输入框获得焦点
const onFocus = (event) => {
  emit('focus', event)
}

// 输入框失去焦点
const onBlur = (event) => {
  emit('blur', event)
}

// 清除输入框内容
const cleanContent = () => {
  handleInputContent('')
}

// 输入框赋值处理
const handleInputContent = (val) => {
  state.content = val
  inputBox.value.innerHTML = val
  emit('update:modelValue', val)
}

// 文本输入框聚焦，焦点在最后位置
const textFocus = () => {
  inputBox.value.focus()
  document.execCommand('selectAll', false, null)
  document.getSelection().collapseToEnd()
}
</script>

<style scoped>
.auto-input {
  width: 100%;
  border: solid 1px rgb(171, 55, 55);
  padding: 10px;
  display: flex;
  align-items: center;
  position: relative;
}
.input-box {
  min-width: 100px;
  width: auto;
  padding: 0 22px 0 10px;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  outline: none;
  border: solid 2px rgb(23, 111, 243);
}
.input-box:empty::before {
  content: attr(placeholder);
  color: #999;
}
.input-box:focus::before {
  content: none;
}
.clear-icon {
  cursor: pointer;
  width: 12px;
  height: 12px;
  position: absolute;
}
.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed !important;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>

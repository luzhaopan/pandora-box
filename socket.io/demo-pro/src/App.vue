<template>
  <div>
    <div class="content">
      <div class="button1" @click="clearCanvas()">清空</div>
      <div>
        <label for="brushColor">brushColor:</label>
        <input type="color" id="brushColor" style="width: 78px" />
      </div>
      <div>
        <span class="画笔选择" id="画笔" @click="switchBrushes('画笔', 7)"></span>
        <span class="画笔选择" id="文字" @click="switchBrushes('文字', 8)"></span>
      </div>
      <div>
        <span class="画笔选择" id="空心矩形" @click="switchBrushes('空心矩形', 1)"></span>
        <span class="画笔选择" id="实心矩形" @click="switchBrushes('实心矩形', 2)"></span>
      </div>
      <div>
        <span class="画笔选择" id="空心圆形" @click="switchBrushes('空心圆形', 3)"></span>
        <span class="画笔选择" id="实心圆形" @click="switchBrushes('实心圆形', 4)"></span>
      </div>
      <div>
        <span class="画笔选择" id="直线" @click="switchBrushes('直线', 5)"></span>
        <span class="画笔选择" id="箭头" @click="switchBrushes('箭头', 6)"></span>
      </div>
      <div>
        <div>
          <label for="brushSize"
            >画笔 <span id="brushSizeValue">{{ lineWidth }}</span></label
          >
        </div>
        <div>
          <input
            class="range1"
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value="5"
            @change="updateValue('brushSize')"
            @input="updateLine('brushSize', 'brushSizeLine')"
          />
          <div style="width: 80px; height: 50px">
            <div id="brushSizeLine"></div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label for="eraserSize"
            >橡皮 <span id="eraserSizeValue">{{ cilpWidth }}</span></label
          >
        </div>
        <div>
          <input
            class="range1"
            type="range"
            id="eraserSize"
            min="1"
            max="80"
            value="20"
            @change="updateValue('eraserSize')"
            @input="updateLine('eraserSize', 'eraserSizeLine')"
          />
          <div style="width: 80px; height: 80px">
            <div id="eraserSizeLine"></div>
          </div>
        </div>
      </div>
    </div>
    <div style="color: #080909">
      <span>橡皮：ctrl+左键</span>&nbsp;&nbsp; <span>撤销：ctrl+z</span>&nbsp;&nbsp;
      <span>恢复：ctrl+y</span>&nbsp;&nbsp;
      <span>保存：ctrl+s</span>
    </div>
    <div style="margin: 20px auto; width: 1400px">
      <canvas
        ref="canvas"
        id="canvas"
        width="1200"
        height="600"
        @click="canClick"
        @mousedown="onpointerdown"
        @mousemove="onpointermove"
        @mouseup="onpointerup"
        @mouseleave="onpointerout"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'

const brush = ref(7)
const isDrawing = ref(false) //标记是否要绘制
const isMouseDown = ref(false) //标记鼠标是否按下
const lineColor = ref('#000') // 线条颜色
const lineWidth = ref(5) // 线条粗细
const cilpWidth = ref(20) // 线条粗细
const points = ref([]) //存储坐标点
const undoStack = ref([]) // 存储画布状态，用于撤销上一步操作
const step = ref(0) // 记录当前步数
// 记录当前路径的编号
const currentID = ref('')

const ydoc = ref(null)
const drawingData = ref(null)

const canvas = ref(null)
const ctx = ref(null)

// 绘制
function draw(mousex, mousey, ctrlKey) {
  points.value.push({
    x: mousex,
    y: mousey,
    color: lineColor.value,
    width: lineWidth.value
  })

  if ((ctrlKey && brush.value != 8) || brush.value === 7) {
    // 如果是橡皮擦模式.value，则和画笔模式.value一样，用draw画笔方法。
    draw画笔()
  } else {
    if (brush.value === 1) draw矩形(false)
    else if (brush.value === 2) draw矩形(true)
    else if (brush.value === 3) draw圆形(false)
    else if (brush.value === 4) draw圆形(true)
    else if (brush.value === 5) draw直线()
    else if (brush.value === 6) draw箭头()
    else if (brush.value === 8) draw文字()
  }
  ctx.value.stroke()
  // points.slice(0, 1);没啥用
}

// 绘制自由线条
function draw画笔() {
  ctx.value.beginPath()

  let x = (points.value[points.value.length - 2].x + points.value[points.value.length - 1].x) / 2
  let y = (points.value[points.value.length - 2].y + points.value[points.value.length - 1].y) / 2
  ctx.value.lineWidth = lineWidth.value
  if (points.value.length == 2) {
    ctx.value.moveTo(points.value[points.value.length - 2].x, points.value[points.value.length - 2].y)
    ctx.value.lineTo(x, y)
  } else {
    let lastX = (points.value[points.value.length - 3].x + points.value[points.value.length - 2].x) / 2
    let lastY = (points.value[points.value.length - 3].y + points.value[points.value.length - 2].y) / 2
    ctx.value.moveTo(lastX, lastY)
    ctx.value.quadraticCurveTo(points.value[points.value.length - 2].x, points.value[points.value.length - 2].y, x, y)
  }

  let path = drawingData.value.get(currentID.value)
  if (path) {
    path.geometry.push({ x, y, color: lineColor.value, width: lineWidth.value })
    drawingData.value.set(currentID.value, path)
    return
  }
}

// 绘制矩形
function draw矩形(isSolid) {
  const startX = points.value[0].x
  const startY = points.value[0].y
  const endX = points.value[points.value.length - 1].x
  const endY = points.value[points.value.length - 1].y
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
  loadImage()
  ctx.value.beginPath()
  if (isSolid) {
    // 是否实心，true绘制实心矩形，false绘制空心矩形
    ctx.value.fillStyle = lineColor.value
    ctx.value.fillRect(startX, startY, endX - startX, endY - startY)
  } else {
    ctx.value.rect(startX, startY, endX - startX, endY - startY)
  }

  let path = drawingData.value.get(currentID.value)
  if (path) {
    path.geometry = points.value
    drawingData.value.set(currentID.value, path)
    return
  }
}

// 绘制圆形
function draw圆形(isSolid) {
  const startX = points.value[0].x
  const startY = points.value[0].y
  const endX = points.value[points.value.length - 1].x
  const endY = points.value[points.value.length - 1].y
  const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
  loadImage()
  ctx.value.beginPath()
  ctx.value.arc(startX, startY, radius, 0, 2 * Math.PI)
  if (isSolid) {
    // 绘制实心圆
    ctx.value.fillStyle = lineColor.value
    ctx.value.fill()
  }

  let path = drawingData.value.get(currentID.value)
  if (path) {
    path.geometry = points.value
    drawingData.value.set(currentID.value, path)
    return
  }
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 绘制直线
function draw直线() {
  const startX = points.value[0].x
  const startY = points.value[0].y
  const endX = points.value[points.value.length - 1].x
  const endY = points.value[points.value.length - 1].y
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
  loadImage()
  ctx.value.beginPath()
  ctx.value.moveTo(startX, startY)
  ctx.value.lineTo(endX, endY)

  let path = drawingData.value.get(currentID.value)
  if (path) {
    path.geometry = points.value
    drawingData.value.set(currentID.value, path)
    return
  }
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 绘制箭头
function draw箭头() {
  const startX = points.value[0].x
  const startY = points.value[0].y
  const endX = points.value[points.value.length - 1].x
  const endY = points.value[points.value.length - 1].y
  const arrowSize = lineWidth.value * 4 // 箭头大小（根据线条粗细来调整箭头大小）
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
  loadImage()
  ctx.value.beginPath()
  ctx.value.moveTo(startX, startY)
  ctx.value.lineTo(endX, endY)
  // 计算箭头角度
  const angle = Math.atan2(endY - startY, endX - startX)
  // 绘制箭头部分
  ctx.value.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6))
  ctx.value.moveTo(endX, endY)
  ctx.value.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6))

  let path = drawingData.value.get(currentID.value)
  if (path) {
    path.geometry = points.value
    drawingData.value.set(currentID.value, path)
    return
  }
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 输入文字（文本模式下，按住ctrl键，不触发橡皮擦功能）
function draw文字() {
  const startX = points.value[0].x
  const startY = points.value[0].y
  const input = document.createElement('textarea') // 创建一个多行输入框元素
  const canvasRect = canvas.value.getBoundingClientRect() // 获取画布的位置信息
  var brushSize = document.getElementById('brushSize').value
  var color = document.getElementById('brushColor').value
  var fontSize = brushSize / 10
  if (fontSize < 1) fontSize = 1

  input.rows = 10 // 默认为10行
  input.style.position = 'absolute'
  input.style.left = canvasRect.left + startX - 10 + 'px' // 计算输入框的左边距（最后-10是为了让光标能显示在鼠标前面一点点）
  input.style.top = canvasRect.top + startY + 'px' // 计算输入框的上边距
  input.style.border = 'none'
  input.style.background = 'transparent'
  input.style.font = fontSize + 'rem 微软雅黑'
  input.style.color = color
  input.style.outline = 'none'
  input.style.padding = '0'
  input.style.margin = '0'
  input.style.width = 'auto'
  input.style.height = 'auto'
  input.style.resize = 'none'
  input.style.overflow = 'hidden'
  input.style.zIndex = '100'
  input.addEventListener('blur', function () {
    const text = input.value
    if (text.length > 0) {
      ctx.value.font = fontSize + 'rem 微软雅黑'
      ctx.value.fillStyle = color
      const lines = text.split('\n') // 将输入的文本按换行符分割成多行
      let y = startY
      lines.forEach(function (line) {
        ctx.value.fillText(line, startX, y) // 在画布上绘制每一行文字
        y += brushSize + 5 // 每行文字的垂直间距为30像素（这个一般要根据字体大小进行设置，我设置的是字体大小+5比较合适）
      })
      addUndoStack(canvas.value.toDataURL()) // 将当前画布状态保存起来
    }
    document.body.removeChild(input) // 移除输入框元素
  })
  document.body.appendChild(input) // 将输入框元素添加到页面中
  input.focus() // 让输入框获得焦点
}

// 加载上一次的状态
function loadImage() {
  if (step.value > 0) {
    var img = new Image()
    img.src = undoStack.value[step.value - 1]
    ctx.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
  }
}

// 清空画布
function clearCanvas() {
  if (canvas.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    step.value = 0
    points.value = []
    undoStack.value = [] // 清空撤销栈
    drawingData.value.clear()
  }
}

// 添加操作
function addUndoStack(url) {
  if (step.value < undoStack.value.length) {
    undoStack.value.length = step.value // 清除撤销后的操作
  }
  undoStack.value.push(url)
  step.value++
}

// 撤销操作
function undo() {
  if (step.value > 1) {
    step.value--
    const image = new Image()
    image.src = undoStack.value[step.value - 1] // 获取上一个画布状态
    image.onload = function () {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.value.drawImage(image, 0, 0) // 绘制上一个画布状态
    }
  } else {
    step.value = 0
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}

// 恢复操作
function restore() {
  if (step.value < undoStack.value.length) {
    step.value++
    const image = new Image()
    image.src = undoStack.value[step.value - 1] // 获取下一个画布状态
    image.onload = function () {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.value.drawImage(image, 0, 0) // 绘制下一个画布状态
    }
  }
}

// 更新滑块值
function updateValue(inputId) {
  // console.log(document.getElementById(inputId).value)

  let value = document.getElementById(inputId).value

  if (value < 10) {
    value = '0' + value
  }
  document.getElementById(inputId + 'Value').textContent = value
}

// 更新画笔线条宽度
function updateLine(inputId, lineId) {
  // console.log(document.getElementById(inputId).value)
  const value = document.getElementById(inputId).value
  if (inputId == 'brushSize') {
    lineWidth.value = value
  } else {
    cilpWidth.value = value
  }
  const line = document.getElementById(lineId)
  line.style.height = value + 'px'
  line.style.width = value + 'px'
}

// 切换画笔
function switchBrushes(id, val) {
  // 重置状态
  currentID.value = ''
  isDrawing.value = false
  brush.value = val
  points.value = []
  ElMessage({
    message: '切换为' + id,
    type: 'success'
  })
}

// 鼠标单击
function canClick(e) {
  if (brush.value == 8) {
    // 只有当画笔模式为文本模式时
    points.value = []
    draw(e.offsetX, e.offsetY, e.ctrlKey)
  }
}

// 鼠标按下
function onpointerdown(e) {
  // 获取当前时间的秒级时间戳
  const timestampInSeconds = Math.floor(Date.now() / 1000)
  // 将秒级时间戳转换为字符串
  const version = timestampInSeconds.toString()

  if (brush.value != 8) {
    // 排除文本模式
    points.value = []
    isDrawing.value = true
    isMouseDown.value = true
    points.value.push({
      x: e.offsetX,
      y: e.offsetY,
      color: lineColor.value,
      width: lineWidth.value
    })

    if (ctx.value) {
      if (brush.value == 1 || brush.value == 2) {
        // 分配编号
        currentID.value = uuidv4()

        let point = {
          id: currentID.value,
          version: version,
          type: brush.value,
          geometry: [
            {
              x: e.clientX,
              y: e.clientY,
              color: lineColor.value,
              width: lineWidth.value
            }
          ]
          // properties: { color: lineColor.value }
        }

        drawingData.value.set(currentID.value, point)

        // 重置编号
        // currentID.value = ''

        return
      }

      if (brush.value == 3 || brush.value == 4) {
        // 分配编号
        currentID.value = uuidv4()

        let point = {
          id: currentID.value,
          version: version,
          type: brush.value,
          geometry: [
            {
              x: e.clientX,
              y: e.clientY,
              color: lineColor.value,
              width: lineWidth.value
            }
          ]
          // properties: { color: lineColor.value }
        }

        drawingData.value.set(currentID.value, point)

        return
      }

      if (brush.value == 5) {
        // 分配编号
        if (currentID.value == '') {
          currentID.value = uuidv4()
        }

        // 没有正在绘画
        if (!isDrawing.value) {
          // 开始绘画
          isDrawing.value = true
        }

        // 获取当前线的信息，如果没有则创建
        let line = drawingData.value.get(currentID.value)

        if (line) {
          line.version = version
          line.geometry.push({
            x: e.clientX,
            y: e.clientY,
            color: lineColor.value,
            width: lineWidth.value
          })
        } else {
          line = {
            id: currentID.value,
            version: version,
            type: 5,
            geometry: [
              {
                x: e.clientX,
                y: e.clientY,
                color: lineColor.value,
                width: lineWidth.value
              }
            ]
            // properties: { color: lineColor.value }
          }
        }

        drawingData.value.set(currentID.value, line)

        return
      }

      if (brush.value == 6) {
        // 分配编号
        if (currentID.value == '') {
          currentID.value = uuidv4()
        }

        // 没有正在绘画
        if (!isDrawing.value) {
          // 开始绘画
          isDrawing.value = true
        }

        // 获取当前线的信息，如果没有则创建
        let line = drawingData.value.get(currentID.value)

        if (line) {
          line.version = version
          line.geometry.push({
            x: e.clientX,
            y: e.clientY,
            color: lineColor.value,
            width: lineWidth.value
          })
        } else {
          line = {
            id: currentID.value,
            version: version,
            type: brush.value,
            geometry: [
              {
                x: e.clientX,
                y: e.clientY,
                color: lineColor.value,
                width: lineWidth.value
              }
            ]
            // properties: { color: lineColor.value }
          }
        }

        drawingData.value.set(currentID.value, line)

        return
      }

      if (brush.value == 7) {
        // 分配编号
        if (currentID.value == '') {
          currentID.value = uuidv4()

          let path = {
            id: currentID.value,
            version: version,
            type: 7,
            geometry: [
              {
                x: e.clientX,
                y: e.clientY,
                color: lineColor.value,
                width: lineWidth.value
              }
            ]
            // properties: { color: lineColor.value }
          }
          // console.log('brush', brush.value)

          drawingData.value.set(currentID.value, path)
        }

        // 没有正在绘画
        if (!isDrawing.value) {
          // 开始绘画
          isDrawing.value = true
        }
      }
    }

    if (e.ctrlKey) {
      // 如果是橡皮擦，则设置为destination-out
      ctx.value.globalCompositeOperation = 'destination-out'
    } else {
      // 否则设置为默认值source-over
      ctx.value.globalCompositeOperation = 'source-over'
    }
    // ctx.value.beginPath() // 新增：开始一个绘画路径
  }
}

// 鼠标移动
function onpointermove(e) {
  if (brush.value != 8) {
    // 排除文本模式
    if (!isDrawing.value) return
    const brushSize = document.getElementById('brushSize').value
    const eraserSize = document.getElementById('eraserSize').value
    lineWidth.value = e.ctrlKey ? eraserSize : brushSize
    lineColor.value = document.getElementById('brushColor').value

    ctx.value.lineWidth = lineWidth.value
    ctx.value.strokeStyle = lineColor.value

    draw(e.offsetX, e.offsetY, e.ctrlKey)
  }
}

// 鼠标抬起
function onpointerup(e) {
  isMouseDown.value = false
  if (brush.value != 8) {
    // 排除文本模式
    points.value = []
    isDrawing.value = false
    currentID.value = ''
    ctx.value.closePath() // 新增：结束绘画路径
    ctx.value.globalCompositeOperation = 'source-over'
    // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
    addUndoStack(canvas.value.toDataURL()) // 将当前画布状态保存起来  以字符串的形式
  }
}

// 鼠标离开画布
function onpointerout(e) {
  if (brush.value != 8 && isMouseDown.value) {
    // 排除文本模式
    points.value = []
    isDrawing.value = false
    isMouseDown.value = false
    currentID.value = ''
    ctx.value.closePath() // 新增：结束绘画路径
    ctx.value.globalCompositeOperation = 'source-over'
    // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
    addUndoStack(canvas.value.toDataURL()) // 将当前画布状态保存起来    以字符串的形式
  }
}

function observeCanvas() {
  // 创建 ydoc, websocketProvider
  ydoc.value = new Y.Doc()
  // 创建一个 Yjs Map，用于存储绘图数据
  drawingData.value = ydoc.value.getMap('drawingData')

  drawingData.value.observe((event) => {
    if (ctx.value && canvas.value) {
      const context = ctx.value!
      // 清空 Canvas
      context.clearRect(0, 0, canvas.value.width, canvas.value.height)

      // 遍历绘图数据，绘制点、路径等
      drawingData.value.forEach((data) => {
        if (data.type == 1 || data.type == 2) {
          const startX = data.geometry[0].x
          const startY = data.geometry[0].y
          const endX = data.geometry[data.geometry.length - 1].x
          const endY = data.geometry[data.geometry.length - 1].y
          // context.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
          loadImage()
          context.beginPath()
          context.strokeStyle = data.geometry[data.geometry.length - 1].color // 设置点的边框颜色
          context.lineWidth = data.geometry[data.geometry.length - 1].width
          if (data.type !== 1) {
            // 是否实心，true绘制实心矩形，false绘制空心矩形
            context.fillStyle = data.geometry[data.geometry.length - 1].color
            context.fillRect(startX, startY, endX - startX, endY - startY)
          } else {
            context.rect(startX, startY, endX - startX, endY - startY)
          }
          context.stroke()
        }

        if (data.type == 3 || data.type == 4) {
          const startX = data.geometry[0].x
          const startY = data.geometry[0].y
          const endX = data.geometry[data.geometry.length - 1].x
          const endY = data.geometry[data.geometry.length - 1].y
          const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
          // ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height) // 清空画布
          loadImage()
          context.beginPath()
          // context.fillStyle = data.geometry[data.geometry.length - 1].color // 设置点的填充颜色
          context.strokeStyle = data.geometry[data.geometry.length - 1].color // 设置点的边框颜色
          context.lineWidth = data.geometry[data.geometry.length - 1].width
          context.arc(startX, startY, radius, 0, 2 * Math.PI)
          if (data.type !== 3) {
            // 绘制实心圆
            context.fillStyle = data.geometry[data.geometry.length - 1].color
            context.fill()
          }
          context.stroke()
        }

        if (data.type == 5) {
          const startX = data.geometry[0].x
          const startY = data.geometry[0].y
          const endX = data.geometry[data.geometry.length - 1].x
          const endY = data.geometry[data.geometry.length - 1].y
          loadImage()
          context.beginPath()
          context.fillStyle = data.geometry[data.geometry.length - 1].color // 设置点的填充颜色
          context.strokeStyle = data.geometry[data.geometry.length - 1].color // 设置点的边框颜色
          context.lineWidth = data.geometry[data.geometry.length - 1].width
          context.moveTo(startX, startY)
          context.lineTo(endX, endY)
          //两个点连成一条线
          context.stroke()
        }

        if (data.type == 6) {
          const startX = data.geometry[0].x
          const startY = data.geometry[0].y
          const endX = data.geometry[data.geometry.length - 1].x
          const endY = data.geometry[data.geometry.length - 1].y
          const arrowSize = lineWidth.value * 4 // 箭头大小（根据线条粗细来调整箭头大小）
          loadImage()
          context.beginPath()

          context.fillStyle = data.geometry[data.geometry.length - 1].color // 设置点的填充颜色
          context.strokeStyle = data.geometry[data.geometry.length - 1].color // 设置点的边框颜色
          context.lineWidth = data.geometry[data.geometry.length - 1].width
          context.moveTo(startX, startY)
          context.lineTo(endX, endY)
          // 计算箭头角度
          const angle = Math.atan2(endY - startY, endX - startX)
          // 绘制箭头部分
          context.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6)
          )
          context.moveTo(endX, endY)
          context.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6)
          )
          context.stroke()
        }

        if (data.type == 7) {
          // context.fillStyle = data.properties.color // 设置点的填充颜色
          // context.strokeStyle = data.properties.color // 设置点的边框颜色
          context.beginPath()
          // 遍历所有点
          data.geometry.forEach((p, index) => {
            context.fillStyle = p.color // 设置点的填充颜色
            context.strokeStyle = p.color // 设置点的边框颜色
            context.lineWidth = p.width
            if (index == 0) {
              // context.moveTo(p.x, p.y)
            } else {
              context.lineTo(p.x, p.y)
              context.stroke()
            }
          })
        }
      })
    }
  })

  new WebsocketProvider('ws://localhost:5173/ws', 'demo', ydoc.value)
}

onMounted(() => {
  if (canvas.value) {
    // 获取画布和绘画工具
    ctx.value = canvas.value.getContext('2d')

    // 跟踪绘画状态
    ctx.value.lineJoin = 'round'
    ctx.value.lineCap = 'round'
  }
  observeCanvas()

  // 监听键盘事件，实现撤销操作和保存绘画内容、切换画笔工具
  window.addEventListener('keydown', (e) => {
    // 撤销
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      undo()
    }
    // 恢复
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      restore()
    }
    // 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      const image = canvas.value.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = 'drawing.png'
      link.click()
    }

    if (e.key === 'Escape') {
      // 重置编号
      if (currentID.value) {
        currentID.value = ''
      }

      // 结束路径和绘画
      if (isDrawing.value && ctx.value) {
        ctx.value.closePath()
        isDrawing.value = false
      }
    }
  })
})
</script>

<style scoped>
* {
  vertical-align: middle;
}
.content {
  margin: 20px;
  float: left;
}
.content div {
  margin-bottom: 15px;
  width: 80px;
  text-align: center;
}
#canvas {
  background-color: transparent;
  -webkit-box-shadow: 0px 0px 10px 5px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8,
    0 0 1px #3b8cf8, 0 0 1px #3b8cf8;
}
.button1 {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  color: gold;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: none;
  margin-right: 10px;
  text-align: center;
  cursor: pointer;
}
.button1:hover {
  color: darkorange;
}
.button1:active {
  border: none;
  color: rgb(12, 11, 11);
  outline: none;
  background: LightSkyBlue;
}
.range1 {
  width: 80px;
  height: 5px;
}
label {
  color: gold;
}
label span {
  color: #48c0a4;
}
.画笔选择 {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin: 0 3px;
  cursor: pointer;
}
#画笔 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px 0px;
}
#画笔:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -23px;
}
#空心矩形 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -45px;
}
#实心矩形 {
  width: 18px;
  height: 18px;
  background: #e89184;
  border-radius: 5px;
}
#空心矩形:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -67px;
}
#实心矩形:hover {
  background: #f64524;
}
#空心圆形 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -90px;
}
#实心圆形 {
  width: 18px;
  height: 18px;
  background: #e89184;
  border-radius: 50%;
}
#空心圆形:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -113px;
}
#实心圆形:hover {
  background: #f64524;
}
#直线 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -133px;
}
#直线:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -150px;
}
#箭头 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -266px;
}
#箭头:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -290px;
}
#文字 {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -169px;
}
#文字:hover {
  background: url('../img/画笔工具.png');
  background-repeat: no-repeat;
  background-position: 0px -192px;
}
#brushSizeLine {
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gold;
}
#eraserSizeLine {
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: gold;
}
</style>

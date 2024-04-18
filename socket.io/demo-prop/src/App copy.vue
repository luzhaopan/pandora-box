<template>
  <div>
    <div class="content">
      <div class="button1" @click="clearCanvas()">清空</div>
      <div>
        <label for="brushColor">brushColor:</label>
        <input type="color" id="brushColor" style="width: 78px" />
      </div>
      <div>
        <span class="画笔选择" id="画笔" @click="changePancle('画笔', 7)"></span>
        <span class="画笔选择" id="文字" @click="changePancle('文字', 8)"></span>
      </div>
      <div>
        <span class="画笔选择" id="空心矩形" @click="changePancle('空心矩形', 1)"></span>
        <span class="画笔选择" id="实心矩形" @click="changePancle('实心矩形', 2)"></span>
      </div>
      <div>
        <span class="画笔选择" id="空心圆形" @click="changePancle('空心圆形', 3)"></span>
        <span class="画笔选择" id="实心圆形" @click="changePancle('实心圆形', 4)"></span>
      </div>
      <div>
        <span class="画笔选择" id="直线" @click="changePancle('直线', 5)"></span>
        <span class="画笔选择" id="箭头" @click="changePancle('箭头', 6)"></span>
      </div>
      <div>
        <div>
          <label for="brushSize">画笔 <span id="brushSizeValue">10</span></label>
        </div>
        <div>
          <input
            class="range1"
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value="10"
            onchange="updateValue('brushSize')"
            oninput="updateLine('brushSize', 'brushSizeLine')"
          />
          <div style="width: 80px; height: 50px">
            <div id="brushSizeLine"></div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label for="eraserSize">橡皮 <span id="eraserSizeValue">20</span></label>
        </div>
        <div>
          <input
            class="range1"
            type="range"
            id="eraserSize"
            min="1"
            max="80"
            value="20"
            onchange="updateValue('eraserSize')"
            oninput="updateLine('eraserSize', 'eraserSizeLine')"
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
    <div style="margin: 20px auto; width: 1850px">
      <canvas id="canvas" ref="canvas" width="1200" height="600" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { v4 as uuidv4 } from 'uuid'

let isDrawing = false //标记是否要绘制
let isMouseDown = false //标记鼠标是否按下
let lineColor // 线条颜色
let lineWidth // 线条粗细
let points = [] //存储坐标点
let undoStack = [] // 存储画布状态，用于撤销上一步操作
let step = 0 // 记录当前步数
let brush = 7
let ctx

///

// 创建 ydoc, websocketProvider
const ydoc = new Y.Doc()

// 创建一个 Yjs Map，用于存储绘图数据
const drawingData = ydoc.getMap('drawingData')

drawingData.observe((event) => {
  if (ctx && canvas) {
    const context = ctx
    // 清空 Canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    console.log('drawingData', drawingData)
    // 遍历绘图数据，绘制点、路径等
    drawingData.forEach((data) => {
      console.log('dataww', data)
      // if (data.type == DrawType.Point) {
      context.fillStyle = data.properties.color // 设置点的填充颜色
      context.strokeStyle = data.properties.color // 设置点的边框颜色
      context.beginPath()
      context.moveTo(data.geometry[0].x, data.geometry[0].y)
      context.arc(data.geometry[0].x, data.geometry[0].y, 2.5, 0, Math.PI * 2) // 创建一个圆形路径
      context.fill() // 填充路径，形成圆点
      context.closePath()
      // } else if (data.type == DrawType.Line) {
      //   context.fillStyle = data.properties.color // 设置点的填充颜色
      //   context.strokeStyle = data.properties.color // 设置点的边框颜色
      //   context.beginPath()
      //   // 遍历所有点
      //   data.geometry.forEach((p, index) => {
      //     if (index == 0) {
      //       context.moveTo(p.x, p.y)
      //       context.fillRect(p.x, p.y, 5, 5)
      //     } else {
      //       context.lineTo(p.x, p.y)
      //       context.stroke()
      //       context.fillRect(p.x, p.y, 5, 5)
      //     }
      //   })
      // } else if (data.type == DrawType.Draw) {
      //   context.fillStyle = data.properties.color // 设置点的填充颜色
      //   context.strokeStyle = data.properties.color // 设置点的边框颜色
      //   context.beginPath()
      //   // 遍历所有点
      //   data.geometry.forEach((p, index) => {
      //     if (index == 0) {
      //       context.moveTo(p.x, p.y)
      //     } else {
      //       context.lineTo(p.x, p.y)
      //       context.stroke()
      //     }
      //   })
      // } else {
      //   console.log('Invalid draw data', data)
      // }
    })
  }
})

const websocketProvider = new WebsocketProvider('ws://localhost:5173/ws', 'demo', ydoc)

///
onMounted(() => {
  // 当前画笔模式：1 空心矩形 2 实心矩形 3 空心圆形 4 实心圆形 5 直线 6 箭头 7 自由画笔 8 文字
  // 获取画布和绘画工具
  // const canvas = ref<null | HTMLCanvasElement>(null);
  const canvas = document.getElementById('canvas')
  console.log('canvas', canvas)
  ctx = canvas.getContext('2d')

  // 跟踪绘画状态
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // let previousImageData;
  // 鼠标按下
  canvas.onpointerdown = function (e) {
    if (brush != 8) {
      // 排除文本模式
      points = []
      isDrawing = true
      isMouseDown = true
      points.push({ x: e.offsetX, y: e.offsetY })
      if (e.ctrlKey) {
        // 如果是橡皮擦，则设置为destination-out
        ctx.globalCompositeOperation = 'destination-out'
      } else {
        // 否则设置为默认值source-over
        ctx.globalCompositeOperation = 'source-over'
      }
      ctx.beginPath() // 新增：开始一个绘画路径
    }
  }

  // 鼠标单击
  canvas.onclick = function (e) {
    if (brush === 8) {
      // 只有当画笔模式为文本模式时
      points = []
      draw(e.offsetX, e.offsetY, e.ctrlKey)
    }
  }

  // 鼠标抬起
  canvas.onpointerup = function (e) {
    isMouseDown = false
    if (brush != 8) {
      // 排除文本模式
      points = []
      isDrawing = false
      ctx.closePath() // 新增：结束绘画路径
      // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
      ctx.globalCompositeOperation = 'source-over'
      addUndoStack(canvas.toDataURL()) // 将当前画布状态保存起来  以字符串的形式
    }
  }
  // 鼠标离开画布
  canvas.onpointerout = function (e) {
    if (brush != 8 && isMouseDown) {
      // 排除文本模式
      points = []
      isDrawing = false
      isMouseDown = false
      ctx.closePath() // 新增：结束绘画路径
      ctx.globalCompositeOperation = 'source-over'
      // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
      addUndoStack(canvas.toDataURL()) // 将当前画布状态保存起来    以字符串的形式
    }
  }

  // 鼠标移动
  canvas.onpointermove = function (e) {
    if (brush != 8) {
      // 排除文本模式
      if (!isDrawing) return
      const brushSize = document.getElementById('brushSize').value
      const eraserSize = document.getElementById('eraserSize').value
      lineWidth = e.ctrlKey ? eraserSize : brushSize
      lineColor = document.getElementById('brushColor').value
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
      draw(e.offsetX, e.offsetY, e.ctrlKey)
    }
  }

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
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = 'drawing.png'
      link.click()
    }
  })
})

// 绘制
function (mousex, mousey, ctrlKey) {
  points.push({ x: mousex, y: mousey })
  if ((ctrlKey && brush != 8) || brush === 7) {
    // 如果是橡皮擦模式，则和画笔模式一样，用draw画笔方法。
    draw画笔()
  } else {
    if (brush === 1) draw矩形(false)
    else if (brush === 2) draw矩形(true)
    else if (brush === 3) draw圆形(false)
    else if (brush === 4) draw圆形(true)
    else if (brush === 5) draw直线()
    else if (brush === 6) draw箭头()
    else if (brush === 8) draw文字()
  }
  ctx.stroke()
  // points.slice(0, 1);没啥用
}

// 绘制自由线条
function draw画笔() {
  ctx.beginPath()
  let x = (points[points.length - 2].x + points[points.length - 1].x) / 2,
    y = (points[points.length - 2].y + points[points.length - 1].y) / 2
  if (points.length == 2) {
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y)
    ctx.lineTo(x, y)
  } else {
    let lastX = (points[points.length - 3].x + points[points.length - 2].x) / 2,
      lastY = (points[points.length - 3].y + points[points.length - 2].y) / 2
    ctx.moveTo(lastX, lastY)
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, x, y)
  }
}

// 绘制矩形
function draw矩形(isSolid) {
  const startX = points[0].x
  const startY = points[0].y
  const endX = points[points.length - 1].x
  const endY = points[points.length - 1].y
  ctx.clearRect(0, 0, canvas.width, canvas.height) // 清空画布
  loadImage()
  ctx.beginPath()
  if (isSolid) {
    // 是否实心，true绘制实心矩形，false绘制空心矩形
    ctx.fillStyle = lineColor
    ctx.fillRect(startX, startY, endX - startX, endY - startY)
  } else {
    ctx.rect(startX, startY, endX - startX, endY - startY)
  }
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 绘制圆形
function draw圆形(isSolid) {
  const startX = points[0].x
  const startY = points[0].y
  const endX = points[points.length - 1].x
  const endY = points[points.length - 1].y
  const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
  ctx.clearRect(0, 0, canvas.width, canvas.height) // 清空画布
  loadImage()
  ctx.beginPath()
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
  if (isSolid) {
    // 绘制实心圆
    ctx.fillStyle = lineColor
    ctx.fill()
  }
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 绘制直线
function draw直线() {
  const startX = points[0].x
  const startY = points[0].y
  const endX = points[points.length - 1].x
  const endY = points[points.length - 1].y
  ctx.clearRect(0, 0, canvas.width, canvas.height) // 清空画布
  loadImage()
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 绘制箭头
function draw箭头() {
  const startX = points[0].x
  const startY = points[0].y
  const endX = points[points.length - 1].x
  const endY = points[points.length - 1].y
  const arrowSize = lineWidth * 4 // 箭头大小（根据线条粗细来调整箭头大小）
  ctx.clearRect(0, 0, canvas.width, canvas.height) // 清空画布
  loadImage()
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  // 计算箭头角度
  const angle = Math.atan2(endY - startY, endX - startX)
  // 绘制箭头部分
  ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6))
  ctx.moveTo(endX, endY)
  ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6))
  //loadImage(); // 清空画布后，显示画布之前的状态，不然画布上同时只能存在一个图形
}

// 输入文字（文本模式下，按住ctrl键，不触发橡皮擦功能）
function draw文字() {
  const startX = points[0].x
  const startY = points[0].y
  const input = document.createElement('textarea') // 创建一个多行输入框元素
  const canvasRect = canvas.getBoundingClientRect() // 获取画布的位置信息
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
      ctx.font = fontSize + 'rem 微软雅黑'
      ctx.fillStyle = color
      const lines = text.split('\n') // 将输入的文本按换行符分割成多行
      let y = startY
      lines.forEach(function (line) {
        ctx.fillText(line, startX, y) // 在画布上绘制每一行文字
        y += brushSize + 5 // 每行文字的垂直间距为30像素（这个一般要根据字体大小进行设置，我设置的是字体大小+5比较合适）
      })
      addUndoStack(canvas.toDataURL()) // 将当前画布状态保存起来
    }
    document.body.removeChild(input) // 移除输入框元素
  })
  document.body.appendChild(input) // 将输入框元素添加到页面中
  input.focus() // 让输入框获得焦点
}

// 加载上一次的状态
function loadImage() {
  if (step > 0) {
    var img = new Image()
    img.src = undoStack[step - 1]
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
}

// 清空画布
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  step = 0
  points = []
  undoStack = [] // 清空撤销栈
}

// 添加操作
function addUndoStack(url) {
  if (step < undoStack.length) {
    undoStack.length = step // 清除撤销后的操作
  }
  undoStack.push(url)
  step++
}

// 撤销操作
function undo() {
  if (step > 1) {
    step--
    const image = new Image()
    image.src = undoStack[step - 1] // 获取上一个画布状态
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0) // 绘制上一个画布状态
    }
  } else {
    step = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// 恢复操作
function restore() {
  if (step < undoStack.length) {
    step++
    const image = new Image()
    image.src = undoStack[step - 1] // 获取下一个画布状态
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0) // 绘制下一个画布状态
    }
  }
}

// 更新滑块值
function updateValue(inputId) {
  var value = document.getElementById(inputId).value
  if (value < 10) {
    value = '0' + value
  }
  document.getElementById(inputId + 'Value').textContent = value
}

// 更新画笔线条宽度
function updateLine(inputId, lineId) {
  var value = document.getElementById(inputId).value
  var line = document.getElementById(lineId)
  line.style.height = value + 'px'
  line.style.width = value + 'px'
}

function changePancle(id, val) {
  brush = val
  // messageplugin({ message: '切换为' + id, type: 'success' })
}

// 监听键盘事件，实现撤销操作和保存绘画内容、切换画笔工具
</script>

<style scoped>
@import './msgBox.css';
@import './public.css';
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

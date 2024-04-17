<template>
  <div>
    <div class="content">
      <div class="button1" @click="clearCanvas">清空</div>
      <!-- <div
        style="width: 100px; height: 40px; display: flex; align-items: center; justify-content: center; color: white"
        :style="{ backgroundColor: color }"
      >
        <span>当前颜色</span>
      </div> -->
      <div>
        <label for="brushColor">brushColor:</label>
        <input type="color" id="brushColor" style="width: 78px" />
      </div>
      <div>
        <span class="画笔选择" id="画笔" @click="switchMode(1)"></span>
        <span class="画笔选择" id="文字" @click="switchMode(2)"></span>
      </div>
      <!-- <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Point)">画点</button>
      <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Line)">直线</button> -->
      <!-- <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Draw)">涂鸦</button>
      <button style="width: 100px; height: 40px; margin-left: 10px" @click="clearCanvas">清除</button> -->
    </div>
    <div style="color: #080909">
      <span>橡皮：ctrl+左键</span>&nbsp;&nbsp; <span>撤销：ctrl+z</span>&nbsp;&nbsp;
      <span>恢复：ctrl+y</span>&nbsp;&nbsp;
      <span>保存：ctrl+s</span>
    </div>
    <div style="margin: 20px auto; width: 1850px">
      <canvas
        id="canvas"
        ref="canvasRef"
        width="1200"
        height="600"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      >
      </canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { v4 as uuidv4 } from 'uuid'

const canvasRef = ref<null | HTMLCanvasElement>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const drawing = ref(false)
const color = ref<string>('black')

class Point {
  x: number = 0.0
  y: number = 0.0
}

enum DrawType {
  None,
  Point,
  Line,
  Draw
}

const colors = [
  '#FF5733',
  '#33FF57',
  '#5733FF',
  '#FF33A2',
  '#A2FF33',
  '#33A2FF',
  '#FF33C2',
  '#C2FF33',
  '#33C2FF',
  '#FF3362',
  '#6233FF',
  '#FF336B',
  '#6BFF33',
  '#33FFA8',
  '#A833FF',
  '#33FFAA',
  '#AA33FF',
  '#FFAA33',
  '#33FF8C',
  '#8C33FF'
]

// 随机选择一个颜色
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

class DrawElementProp {
  color: string = 'black'
}

class DrawElement {
  id: string = ''
  version: string = ''
  type: DrawType = DrawType.None
  geometry: Point[] = []
  properties: DrawElementProp = new DrawElementProp()
}

// 选择的绘画模式
const drawMode = ref<DrawType>(DrawType.Draw)
// 定义变量来跟踪第一个点的坐标和鼠标是否按下
const point = ref<Point | null>(null)

// 创建 ydoc, websocketProvider
const ydoc = new Y.Doc()

// 创建一个 Yjs Map，用于存储绘图数据
const drawingData = ydoc.getMap<DrawElement>('drawingData')

drawingData.observe((event) => {
  if (ctx.value && canvasRef.value) {
    const context = ctx.value!
    // 清空 Canvas
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // 遍历绘图数据，绘制点、路径等
    drawingData.forEach((data: DrawElement) => {
      if (data.type == DrawType.Point) {
        context.fillStyle = data.properties.color // 设置点的填充颜色
        context.strokeStyle = data.properties.color // 设置点的边框颜色
        context.beginPath()
        context.moveTo(data.geometry[0].x, data.geometry[0].y)
        context.arc(data.geometry[0].x, data.geometry[0].y, 2.5, 0, Math.PI * 2) // 创建一个圆形路径
        context.fill() // 填充路径，形成圆点
        context.closePath()
      } else if (data.type == DrawType.Line) {
        context.fillStyle = data.properties.color // 设置点的填充颜色
        context.strokeStyle = data.properties.color // 设置点的边框颜色
        context.beginPath()
        // 遍历所有点
        data.geometry.forEach((p: Point, index: number) => {
          if (index == 0) {
            context.moveTo(p.x, p.y)
            context.fillRect(p.x, p.y, 5, 5)
          } else {
            context.lineTo(p.x, p.y)
            context.stroke()
            context.fillRect(p.x, p.y, 5, 5)
          }
        })
      } else if (data.type == DrawType.Draw) {
        context.fillStyle = data.properties.color // 设置点的填充颜色
        context.strokeStyle = data.properties.color // 设置点的边框颜色
        context.beginPath()
        // 遍历所有点
        data.geometry.forEach((p: Point, index: number) => {
          if (index == 0) {
            context.moveTo(p.x, p.y)
          } else {
            context.lineTo(p.x, p.y)
            context.stroke()
          }
        })
      } else {
        console.log('Invalid draw data', data)
      }
    })
  }
})

const websocketProvider = new WebsocketProvider('ws://localhost:5173/ws', 'demo', ydoc)

onMounted(() => {
  if (canvasRef.value) {
    // 随机选择一种颜色
    color.value = getRandomColor()

    canvasRef.value.height = window.innerHeight - 10
    canvasRef.value.width = window.innerWidth

    const context = canvasRef.value.getContext('2d')
    if (context) {
      ctx.value = context
      context.lineWidth = 5
      context.fillStyle = color.value // 设置点的填充颜色
      context.strokeStyle = color.value // 设置点的边框颜色
      context.lineJoin = 'round'
    }
  }

  window.addEventListener('keydown', handleKeyDown)
})

const handleSaveUserName = () => {
  if (userName.value) {
    modalOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // 重置编号
    if (currentID.value) {
      currentID.value = ''
    }

    // 结束路径和绘画
    if (drawing.value && ctx.value) {
      ctx.value.closePath()
      drawing.value = false
    }
  }
}

const switchMode = (mode: DrawType) => {
  // 重置状态
  currentID.value = ''
  drawing.value = false
  drawMode.value = mode
  point.value = null
}

// 记录当前路径的编号
const currentID = ref<string>('')

const startDrawing = (e: any) => {
  // 获取当前时间的秒级时间戳
  const timestampInSeconds = Math.floor(Date.now() / 1000)
  // 将秒级时间戳转换为字符串
  const version = timestampInSeconds.toString()

  if (ctx.value) {
    if (drawMode.value === DrawType.Point) {
      // 分配编号
      currentID.value = uuidv4()

      let point: DrawElement = {
        id: currentID.value,
        version: version,
        type: DrawType.Point,
        geometry: [{ x: e.clientX, y: e.clientY }],
        properties: { color: color.value }
      }

      drawingData.set(currentID.value, point)

      // 重置编号
      currentID.value = ''

      return
    }

    if (drawMode.value === DrawType.Line) {
      // 分配编号
      if (currentID.value == '') {
        currentID.value = uuidv4()
      }

      // 没有正在绘画
      if (!drawing.value) {
        // 开始绘画
        drawing.value = true
      }

      // 获取当前线的信息，如果没有则创建
      let line: DrawElement | undefined = drawingData.get(currentID.value)

      if (line) {
        line.version = version
        line.geometry.push({ x: e.clientX, y: e.clientY })
      } else {
        line = {
          id: currentID.value,
          version: version,
          type: DrawType.Line,
          geometry: [{ x: e.clientX, y: e.clientY }],
          properties: { color: color.value }
        }
      }

      drawingData.set(currentID.value, line)

      return
    }

    if (drawMode.value === DrawType.Draw) {
      // 分配编号
      if (currentID.value == '') {
        currentID.value = uuidv4()

        let path: DrawElement = {
          id: currentID.value,
          version: version,
          type: DrawType.Draw,
          geometry: [{ x: e.clientX, y: e.clientY }],
          properties: { color: color.value }
        }

        drawingData.set(currentID.value, path)
      }

      // 没有正在绘画
      if (!drawing.value) {
        // 开始绘画
        drawing.value = true
      }
    }
  }
}

const draw = (e: any) => {
  if (drawing.value && ctx.value) {
    if (drawMode.value === DrawType.Draw) {
      // 获取当前线的信息，如果没有则创建
      let path: DrawElement | undefined = drawingData.get(currentID.value)
      if (path) {
        path.geometry.push({ x: e.clientX, y: e.clientY })
        drawingData.set(currentID.value, path)
        return
      }

      console.log('error: not found path', currentID.value)
    }
  }
}

const stopDrawing = () => {
  if (drawing.value && ctx.value) {
    if (drawMode.value === DrawType.Draw) {
      // 鼠标放开时，关闭当前路径绘画
      currentID.value = ''
      drawing.value = false
    }
  }
}

const clearCanvas = () => {
  if (canvasRef.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    drawingData.clear()
  }
}
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

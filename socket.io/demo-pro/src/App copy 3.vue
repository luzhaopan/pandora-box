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
        <span class="画笔选择" id="画笔" @click="switchMode(7)"></span>
        <span class="画笔选择" id="文字" @click="switchMode(8)"></span>
      </div>
      <div>
        <div>
          <label for="brushSize"
            >画笔 <span id="brushSizeValue">10</span></label
          >
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
      <!-- <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Point)">画点</button>
      <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Line)">直线</button> -->
      <!-- <button style="width: 100px; height: 40px; margin-left: 10px" @click="switchMode(DrawType.Draw)">涂鸦</button>
      <button style="width: 100px; height: 40px; margin-left: 10px" @click="clearCanvas">清除</button> -->
    </div>
    <div style="color: #080909">
      <span>橡皮：ctrl+左键</span>&nbsp;&nbsp;
      <span>撤销：ctrl+z</span>&nbsp;&nbsp;
      <span>恢复：ctrl+y</span>&nbsp;&nbsp;
      <span>保存：ctrl+s</span>
    </div>
    <div style="margin: 20px auto; width: 80%">
      <canvas
        id="canvas"
        ref="canvasRef"
        style="height: 100%; width: 100%"
        @click="canvasClick"
        @mousedown="onpointerdown"
        @mousemove="onpointermove"
        @mouseup="onpointerup"
        @mouseleave="onpointerout"
      >
      </canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { v4 as uuidv4 } from "uuid"

const canvasRef = ref(null)
const ctx = ref(null)
const drawing = ref(false)
const color = ref("black")
const isMouseDown = ref(false) //标记鼠标是否按下
let points = [] //存储坐标点
// 记录当前路径的编号
const currentID = ref("")

const undoStack = ref([]) // 存储画布状态，用于撤销上一步操作
const step = ref(0) // 记录当前步数

const canvas = ref(null)

enum DrawType {
  None,
  Point,
  Line,
  Draw
}

const colors = [
  "#FF5733",
  "#33FF57",
  "#5733FF",
  "#FF33A2",
  "#A2FF33",
  "#33A2FF",
  "#FF33C2",
  "#C2FF33",
  "#33C2FF",
  "#FF3362",
  "#6233FF",
  "#FF336B",
  "#6BFF33",
  "#33FFA8",
  "#A833FF",
  "#33FFAA",
  "#AA33FF",
  "#FFAA33",
  "#33FF8C",
  "#8C33FF"
]

// 随机选择一个颜色
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

// class DrawElementProp {
//   color = "black"
// }

// class DrawElement {
//   id = ""
//   version = ""
//   type = DrawType.None
//   geometry = []
//   properties = new DrawElementProp()
// }

// 选择的绘画模式
const drawMode = ref(7)
// 定义变量来跟踪第一个点的坐标和鼠标是否按下
const point = ref(null)

// 创建 ydoc, websocketProvider
const ydoc = new Y.Doc()
// const yText = new Y.Doc()

// 创建一个 Yjs Map，用于存储绘图数据
const drawingData = ydoc.getMap("drawingData")
// const drawingText = yText.getText("drawingText")

drawingData.observe((event) => {
  if (ctx.value && canvasRef.value) {
    const context = ctx.value!
    // 清空 Canvas
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // 遍历绘图数据，绘制点、路径等
    drawingData.forEach((data) => {
      console.log("000", data)

      // draw()
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
        data.geometry.forEach((p, index) => {
          if (index == 0) {
            context.moveTo(p.x, p.y)
            context.fillRect(p.x, p.y, 5, 5)
          } else {
            context.lineTo(p.x, p.y)
            context.stroke()
            context.fillRect(p.x, p.y, 5, 5)
          }
        })
      } else if (data.type == 7) {
        context.fillStyle = data.properties.color // 设置点的填充颜色
        context.strokeStyle = data.properties.color // 设置点的边框颜色
        context.beginPath()
        // 遍历所有点
        data.geometry.forEach((p, index) => {
          if (index == 0) {
            context.moveTo(p.x, p.y)
          } else {
            context.lineTo(p.x, p.y)
            context.stroke()
          }
        })
      } else if (data.type == 8) {
        console.log("data8888", data)

        // context.fillStyle = data.properties.color // 设置点的填充颜色
        // context.strokeStyle = data.properties.color // 设置点的边框颜色
        // context.beginPath()
        // // 遍历所有点
        // data.geometry.forEach((p, index) => {
        //   if (index == 0) {
        //     context.moveTo(p.x, p.y)
        //   } else {
        //     context.lineTo(p.x, p.y)
        //     context.stroke()
        //   }
        // })
      } else {
        console.log("Invalid draw data", data)
      }
    })
  }
})

// drawingText.observe((event) => {
//   console.log("drawingText", event)
// })

const websocketProvider = new WebsocketProvider(
  "ws://localhost:5173/ws",
  "demo",
  ydoc
)

onMounted(() => {
  if (canvasRef.value) {
    // 随机选择一种颜色
    color.value = getRandomColor()

    canvasRef.value.height = window.innerHeight - 10
    canvasRef.value.width = window.innerWidth

    const context = canvasRef.value.getContext("2d")
    if (context) {
      ctx.value = context
      context.lineWidth = 5
      context.fillStyle = color.value // 设置点的填充颜色
      context.strokeStyle = color.value // 设置点的边框颜色
      context.lineJoin = "round"
    }
  }

  // canvas = document.getElementById("canvas")

  window.addEventListener("keydown", handleKeyDown)
})

// 更新滑块值
function updateValue(inputId) {
  var value = document.getElementById(inputId).value
  if (value < 10) {
    value = "0" + value
  }
  document.getElementById(inputId + "Value").textContent = value
}

// 更新画笔线条宽度
function updateLine(inputId, lineId) {
  var value = document.getElementById(inputId).value
  var line = document.getElementById(lineId)
  line.style.height = value + "px"
  line.style.width = value + "px"
}

const handleSaveUserName = () => {
  if (userName.value) {
    modalOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    // 重置编号
    if (currentID.value) {
      currentID.value = ""
    }

    // 结束路径和绘画
    if (drawing.value && ctx.value) {
      ctx.value.closePath()
      drawing.value = false
    }
  }
}

const switchMode = (mode) => {
  console.log("mode", mode)

  // 重置状态
  currentID.value = ""
  drawing.value = false
  drawMode.value = mode
  point.value = null
}

const startDrawing = (e) => {
  // if (drawMode.value != 8) {
  //   // 排除文本模式
  //   points = []
  //   drawing.value = true
  //   isMouseDown.value = true
  //   points.push({ x: e.offsetX, y: e.offsetY })
  //   if (e.ctrlKey) {
  //     // 如果是橡皮擦，则设置为destination-out
  //     ctx.value.globalCompositeOperation = "destination-out"
  //   } else {
  //     // 否则设置为默认值source-over
  //     ctx.value.globalCompositeOperation = "source-over"
  //   }
  //   ctx.value.beginPath() // 新增：开始一个绘画路径
  // }

  // 获取当前时间的秒级时间戳
  const timestampInSeconds = Math.floor(Date.now() / 1000)
  // 将秒级时间戳转换为字符串
  const version = timestampInSeconds.toString()

  if (ctx.value) {
    if (drawMode.value === DrawType.Point) {
      // 分配编号
      currentID.value = uuidv4()

      let point = {
        id: currentID.value,
        version: version,
        type: DrawType.Point,
        geometry: [{ x: e.clientX, y: e.clientY }],
        properties: { color: color.value }
      }

      drawingData.set(currentID.value, point)

      // 重置编号
      currentID.value = ""

      return
    }

    if (drawMode.value === DrawType.Line) {
      // 分配编号
      if (currentID.value == "") {
        currentID.value = uuidv4()
      }

      // 没有正在绘画
      if (!drawing.value) {
        // 开始绘画
        drawing.value = true
      }

      // 获取当前线的信息，如果没有则创建
      let line = drawingData.get(currentID.value)

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

    if (drawMode.value === 7) {
      // 分配编号
      if (currentID.value == "") {
        currentID.value = uuidv4()

        let path = {
          id: currentID.value,
          version: version,
          type: 7,
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

    if (drawMode.value === 8) {
      // 分配编号
      if (currentID.value == "") {
        currentID.value = uuidv4()

        // let text = {
        //   id: currentID.value,
        //   version: version,
        //   type: 7,
        //   geometry: [{ x: e.clientX, y: e.clientY }],
        //   properties: { color: color.value }
        // }

        // drawingText.set(currentID.value, text)
      }

      // 没有正在绘画
      if (!drawing.value) {
        // 开始绘画
        drawing.value = true
      }
    }
  }
}

// 鼠标单击
function canvasClick(e) {
  // console.log(e)
  // console.log("drawMode", drawMode.value)
  if (drawMode.value == 8) {
    // 只有当画笔模式为文本模式时
    points = []
    draw(e)
  }

  // if (drawMode.value == 8) {
  //   // 只有当画笔模式为文本模式时
  //   points = []
  //   draw(e)
  //   drawText()
  // }
}

// 鼠标移动
const onpointermove = (e) => {
  if (drawMode.value != 8) {
    // 排除文本模式
    if (!drawing.value) return
    // const brushSize = document.getElementById('brushSize').value;
    // const eraserSize = document.getElementById('eraserSize').value;
    // lineWidth = e.ctrlKey ? eraserSize : brushSize;
    // lineColor = document.getElementById('brushColor').value;
    // ctx.lineWidth = lineWidth;
    // ctx.strokeStyle = lineColor;
    draw(e)
    // draw(e.offsetX,e.offsetY,e.ctrlKey);
  }
}

// 绘制
function draw(e) {
  const brush = drawMode.value
  points.push({ x: e.offsetX, y: e.offsetY })
  if ((e.ctrlKey && brush != 8) || brush === 7) {
    // 如果是橡皮擦模式，则和画笔模式一样，用draw画笔方法。
    drawLine(e)
    // let path = drawingData.get(currentID.value)
    // console.log("path", path)

    // if (path) {
    //   path.geometry.push({ x: e.clientX, y: e.clientY })
    //   drawingData.set(currentID.value, path)
    //   return
    // }
  } else {
    // if(brush === 1) draw矩形(false);
    // else if(brush === 2) draw矩形(true);
    // else if(brush === 3) draw圆形(false);
    // else if(brush === 4) draw圆形(true);
    // else if(brush === 5) draw直线();
    // else if(brush === 6) draw箭头();
    // else if(brush === 8) draw文字();
    if (brush === 8) drawText()
  }
  ctx.value.stroke()
  // points.slice(0, 1);没啥用
}

const draw1 = (e) => {
  // console.log("drawMode333", drawMode.value)
  points.push({ x: e.offsetX, y: e.offsetY })
  if (drawing.value && ctx.value) {
    // console.log("drawMode6666", drawMode.value)
    if (drawMode.value == 7) {
      // 获取当前线的信息，如果没有则创建
      let path = drawingData.get(currentID.value)
      if (path) {
        path.geometry.push({ x: e.clientX, y: e.clientY })
        drawingData.set(currentID.value, path)
        return
      }

      console.log("error: not found path", currentID.value)
    }
  }
  // if (drawMode.value == 8) {

  // }
}

// 绘制自由线条
function drawLine(e) {
  // 获取当前时间的秒级时间戳
  // const timestampInSeconds = Math.floor(Date.now() / 1000)
  // 将秒级时间戳转换为字符串
  // const version = timestampInSeconds.toString()

  ctx.value.beginPath()
  let x = (points[points.length - 2].x + points[points.length - 1].x) / 2,
    y = (points[points.length - 2].y + points[points.length - 1].y) / 2
  if (points.length == 2) {
    ctx.value.moveTo(points[points.length - 2].x, points[points.length - 2].y)
    ctx.value.lineTo(x, y)
  } else {
    let lastX = (points[points.length - 3].x + points[points.length - 2].x) / 2,
      lastY = (points[points.length - 3].y + points[points.length - 2].y) / 2
    ctx.value.moveTo(lastX, lastY)
    ctx.value.quadraticCurveTo(
      points[points.length - 2].x,
      points[points.length - 2].y,
      x,
      y
    )
  }

  // if (currentID.value == "") {
  //   currentID.value = uuidv4()

  //   let path = {
  //     id: currentID.value,
  //     version: version,
  //     type: 7,
  //     geometry: [{ x: e.clientX, y: e.clientY }],
  //     properties: { color: color.value }
  //   }

  //   drawingData.set(currentID.value, path)
  // }

  // // 没有正在绘画
  // if (!drawing.value) {
  //   // 开始绘画
  //   drawing.value = true
  // }
}

// 输入文字（文本模式下，按住ctrl键，不触发橡皮擦功能）
function drawText() {
  console.log("pointsttt", points)

  const startX = points[0].x
  const startY = points[0].y
  const input = document.createElement("textarea") // 创建一个多行输入框元素
  const canvasRect = canvasRef.value.getBoundingClientRect() // 获取画布的位置信息
  var brushSize = document.getElementById("brushSize").value
  var color = document.getElementById("brushColor").value
  var fontSize = brushSize / 10
  if (fontSize < 1) fontSize = 1

  input.rows = 10 // 默认为10行
  input.style.position = "absolute"
  input.style.left = canvasRect.left + startX - 10 + "px" // 计算输入框的左边距（最后-10是为了让光标能显示在鼠标前面一点点）
  input.style.top = canvasRect.top + startY + "px" // 计算输入框的上边距
  input.style.border = "none"
  input.style.background = "transparent"
  input.style.font = fontSize + "rem 微软雅黑"
  input.style.color = color
  input.style.outline = "none"
  input.style.padding = "0"
  input.style.margin = "0"
  input.style.width = "auto"
  input.style.height = "auto"
  input.style.resize = "none"
  input.style.overflow = "hidden"
  input.style.zIndex = "100"
  input.addEventListener("blur", function () {
    const text = input.value
    if (text.length > 0) {
      ctx.font = fontSize + "rem 微软雅黑"
      ctx.fillStyle = color
      const lines = text.split("\n") // 将输入的文本按换行符分割成多行
      let y = startY
      lines.forEach(function (line) {
        ctx.fillText(line, startX, y) // 在画布上绘制每一行文字
        y += brushSize + 5 // 每行文字的垂直间距为30像素（这个一般要根据字体大小进行设置，我设置的是字体大小+5比较合适）
      })
      // addUndoStack(canvas.toDataURL()); // 将当前画布状态保存起来
    }
    document.body.removeChild(input) // 移除输入框元素
  })
  document.body.appendChild(input) // 将输入框元素添加到页面中
  input.focus() // 让输入框获得焦点
}

// 鼠标按下
const onpointerdown = (e) => {
  if (drawMode.value != 8) {
    // 排除文本模式
    points = []
    drawing.value = true
    isMouseDown.value = true
    points.push({ x: e.offsetX, y: e.offsetY })
    if (e.ctrlKey) {
      // 如果是橡皮擦，则设置为destination-out
      ctx.value.globalCompositeOperation = "destination-out"
    } else {
      // 否则设置为默认值source-over
      ctx.value.globalCompositeOperation = "source-over"
    }
    ctx.value.beginPath() // 新增：开始一个绘画路径
  }
}

// 鼠标抬起
const onpointerup = (e) => {
  isMouseDown.value = false
  if (drawMode.value != 8) {
    // 排除文本模式
    points = []
    drawing.value = false
    ctx.value.closePath() // 新增：结束绘画路径
    // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
    ctx.value.globalCompositeOperation = "source-over"
    addUndoStack(canvasRef.value.toDataURL()) // 将当前画布状态保存起来  以字符串的形式
  }
  stopDrawing()
}

// 鼠标离开画布
const onpointerout = (e) => {
  if (drawing.value != 8 && isMouseDown.value) {
    // 排除文本模式
    points = []
    drawing.value = false
    isMouseDown.value = false
    ctx.value.closePath() // 新增：结束绘画路径
    ctx.value.globalCompositeOperation = "source-over"
    // 绘画结束后，将值重新设置为默认值，否则当前值为destination-out时，使用撤销功能后会把整个画布的内容都给擦掉
    addUndoStack(canvasRef.value.toDataURL()) // 将当前画布状态保存起来    以字符串的形式
  }
  stopDrawing()
}

// 添加操作
function addUndoStack(url) {
  if (step.value < undoStack.value.length) {
    undoStack.value.length = step.value // 清除撤销后的操作
  }
  undoStack.value.push(url)
  step.value++
}

const stopDrawing = () => {
  drawing.value = false
  if (ctx.value) {
    if (drawMode.value != 8) {
      // 鼠标放开时，关闭当前路径绘画
      currentID.value = ""
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
@import "./msgBox.css";
@import "./public.css";
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
  -webkit-box-shadow: 0px 0px 10px 5px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8,
    0 0 1px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8, 0 0 1px #3b8cf8;
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
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px 0px;
}
#画笔:hover {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -23px;
}
#空心矩形 {
  background: url("../img/画笔工具.png");
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
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -67px;
}
#实心矩形:hover {
  background: #f64524;
}
#空心圆形 {
  background: url("../img/画笔工具.png");
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
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -113px;
}
#实心圆形:hover {
  background: #f64524;
}
#直线 {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -133px;
}
#直线:hover {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -150px;
}
#箭头 {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -266px;
}
#箭头:hover {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -290px;
}
#文字 {
  background: url("../img/画笔工具.png");
  background-repeat: no-repeat;
  background-position: 0px -169px;
}
#文字:hover {
  background: url("../img/画笔工具.png");
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

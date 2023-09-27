<template>
  <div class="calendar-card">
    <div>
      <select v-model="state.current" @change="changeRole">
        <option
          v-for="item in props.data.team"
          :selected="item.selected"
          :value="item.name"
          :key="item.name"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="condition">
      <div class="btn" @click="selectedMonth(state.currentMonth - 1)">
        <img class="img" src="../assets/left.png" alt="" />
      </div>
      <div class="btn" @click="selectedMonth(new Date().getMonth() + 1)">
        今天
      </div>
      <div class="btn" @click="selectedMonth(state.currentMonth + 1)">
        <img class="img" src="../assets/right.png" alt="" />
      </div>
      <div>
        {{
          state.currentYear +
          "年" +
          state.currentMonth +
          "月" +
          state.currentDay +
          "日"
        }}
      </div>
    </div>

    <div class="weekdays">
      <div class="weekdays-item">周日</div>
      <div class="weekdays-item">周一</div>
      <div class="weekdays-item">周二</div>
      <div class="weekdays-item">周三</div>
      <div class="weekdays-item">周四</div>
      <div class="weekdays-item">周五</div>
      <div class="weekdays-item">周六</div>
    </div>

    <div class="row">
      <div class="days" v-for="(dayItem, j) in state.dayList" :key="j">
        <div class="num">{{ state.weeks[6] + j }}</div>
        <div class="days-item" v-for="(item, i) in dayItem" :key="i">
          <div
            :class="{
              list: true,
              'weekend-day': isWeekend(item.day)
            }"
          >
            <div class="day-text">
              {{ item.day.getDate() }}
            </div>
            <div v-if="item.info">{{ item.info.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue"

import { defineProps } from "vue"

const props = defineProps(["data"])

const state = reactive({
  monthList: [
    {
      value: 1,
      name: "Jan",
      selected: false
    },
    {
      value: 2,
      name: "Feb",
      selected: false
    },
    {
      value: 3,
      name: "Mar",
      selected: false
    },
    {
      value: 4,
      name: "Apr",
      selected: false
    },
    {
      value: 5,
      name: "May",
      selected: false
    },
    {
      value: 6,
      name: "Jun",
      selected: false
    },
    {
      value: 7,
      name: "Jul",
      selected: false
    },
    {
      value: 8,
      name: "Aug",
      selected: false
    },
    {
      value: 9,
      name: "Sep",
      selected: false
    },
    {
      value: 10,
      name: "Oct",
      selected: false
    },
    {
      value: 11,
      name: "Nov",
      selected: false
    },
    {
      value: 12,
      name: "Dec",
      selected: false
    }
  ],
  currentDay: 1,
  currentMonth: 1,
  currentYear: 2023,
  currentWeek: 1,
  days: [],
  weeks: [],
  dayList: [],
  current: ""
})

onMounted(() => {
  state.current = props.data.team[0]["name"]
  state.currentRole = props.data.team[0]
  // state.currentYear = new Date().getFullYear()
  state.currentYear = "2019"
  // state.currentMonth = new Date().getMonth() + 1
  state.currentMonth = "10"
  selectedMonth(state.currentMonth)
})

// 初始化日历数据
const initData = (cur) => {
  let date
  if (cur) {
    date = new Date(cur)
  } else {
    const d = new Date(
      formatDate(new Date().getFullYear(), new Date().getMonth(), 1)
    )
    d.setDate(35)
    date = new Date(formatDate(d.getFullYear(), d.getMonth() + 1, 1))
  }

  state.currentDay = date.getDate() // 月份的某一天
  state.currentYear = date.getFullYear()
  state.currentMonth = date.getMonth() + 1
  state.currentWeek = date.getDay() // 表示星期的某一天的数字 1...6,0

  if (state.currentWeek === 0) {
    state.currentWeek = 7
  }

  const target = formatDate(
    state.currentYear,
    state.currentMonth,
    state.currentDay
  )

  state.days.length = 0
  // 根据本月的1号获取之前的几天放到前面
  for (let i = state.currentWeek; i >= 0; i--) {
    const d2 = new Date(target)
    d2.setDate(d2.getDate() - i)
    const map = {}
    map.day = d2

    state.weeks.push(
      getYearWeek(d2.getFullYear(), d2.getMonth() + 1, d2.getDate())
    )
    state.days.push(map)
  }
  // 之后的其他周
  for (let j = 1; j < 35 - state.currentWeek; j++) {
    const d3 = new Date(target)
    d3.setDate(d3.getDate() + j)
    const map = {}
    map.day = d3
    state.weeks.push(
      getYearWeek(d3.getFullYear(), d3.getMonth() + 1, d3.getDate())
    )
    state.days.push(map)
  }

  for (let i = 0; i < state.days.length; i++) {
    for (let j = 0; j < state.currentRole.appointments.length; j++) {
      let y1 = new Date(state.days[i].day).getFullYear()
      let m1 = new Date(state.days[i].day).getMonth()
      let d1 = new Date(state.days[i].day).getDate()
      let y2 = new Date(state.currentRole.appointments[j].start).getFullYear()
      let m2 = new Date(state.currentRole.appointments[j].start).getMonth()
      let d2 = new Date(state.currentRole.appointments[j].start).getDate()
      // console.log(y1,y2,m1,m2);
      if (`${y1}${m1}${d1}` === `${y2}${m2}${d2}`) {
        state.days[i].info = state.currentRole.appointments[j]
      }
    }
  }

  state.dayList = []
  for (let i = 0; i < state.days.length; i += 7) {
    state.dayList.push(state.days.slice(i, i + 7))
  }
}

const changeRole = (e) => {
  for (let i = 0; i < props.data.team.length; i++) {
    if (props.data.team[i].name === e.target.value) {
      state.currentRole = props.data.team[i]
    }
  }
  selectedMonth(state.currentMonth)
}

// 月分选择
const selectedMonth = (m) => {
  state.currentMonth = m
  state.monthList.forEach((item) => {
    if (item.value === m) {
      item.selected = true
    } else {
      item.selected = false
    }
  })
  getDays(state.currentYear, state.currentMonth)
}

// 获取日期
const getDays = (year, month) => {
  const d = new Date(formatDate(year, month, 1))
  initData(formatDate(d.getFullYear(), d.getMonth() + 1, 1))
}

// 格式化日期
const formatDate = (year, month, day) => {
  if (month < 10) month = "0" + month
  if (day < 10) day = "0" + day
  return year ? year + "-" + month + "-" + day : month + "-" + day
}

// 判断是否周末
const isWeekend = (date) => {
  return date.getDay() === 6 || date.getDay() === 0
}

// 判断当前日期为当年第几周
const getYearWeek = function (year, month, day) {
  //date1是当前日期
  //date2是当年第一天
  //d是当前日期是今年第多少天
  //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
  let date1 = new Date(year, parseInt(month) - 1, day)
  let date2 = new Date(year, 0, 1)
  let d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
  return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7)
}
</script>
<style scoped>
.calendar-card {
  font-size: 13px;
  width: 100%;
  /* height: 100vh; */
  margin: 0 auto;
}

.condition {
  display: flex;
  align-items: center;
  color: #0854a0;
  font-size: 14px;
}

.btn {
  padding: 10px;
  cursor: pointer;
}

.img {
  width: 20px;
  height: 20px;
}

.weekdays {
  margin: 0;
  display: flex;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  justify-content: space-around;
  padding-left: 2%;
  background-color: #f7f7f7;
}

.weekdays-item {
  flex: 1;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  border-right: 1px solid #fff;
  padding: 5px 0;
}

.days {
  margin: 0;
  display: flex;
  flex: 1;
}

.num {
  width: 2%;
  text-align: right;
  padding: 5px 10px;
}

.days-item {
  width: 14%;
  border-left: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  border-left: 1px solid #e5e5e5;
}

.list {
  padding: 4px;
  position: relative;
  height: 100px;
  color: #000;
  background-color: #fff;
}

.day-text {
  font-weight: 600;
  text-align: right;
  margin: 5px 10px;
}

.weekend-day {
  background-color: #f7f7f7;
}
</style>

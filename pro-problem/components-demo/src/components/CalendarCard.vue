<template>
  <div class="calendar-card">
    <div>header</div>
    <div class="condition">
      <div class="btn" @click="selectedMonth(state.currentMonth-1)"> <img class="img" src="../assets/left.png" alt=""> </div>
      <div class="btn" @click="selectedMonth(new Date().getMonth() + 1)" >今天</div>
      <div class="btn" @click="selectedMonth(state.currentMonth+1)"> <img class="img" src="../assets/right.png" alt=""> </div>
      <div>{{ state.currentYear + '年' + state.currentMonth + '月' + state.currentDay + '日' }}</div>
    </div>
      <select v-model="state.currentYear" @change="yearSelect">
        <option
          v-for="item in state.yearList"
          :selected="item.selected"
          :value="item.value"
          :key="item.value"
        >
          {{ item.value }}
        </option>
      </select>
      <div class="month">
        <div
          v-for="item in state.monthList"
          class="month-item"
          @click="selectedMonth(item.value)"
          :class="{ actived: item.selected }"
          :key="item.name"
        >
          {{ item.name }}
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
            </div>
          </div>
        </div>
      </div>
    
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";

import { defineProps } from 'vue';

const props = defineProps(["data"]);

console.log(props);

const state = reactive({
  yearList: [
    {
      value: 2022,
      selected: false,
    },
    {
      value: 2023,
      selected: false,
    },
  ],
  monthList: [
    {
      value: 1,
      name: "Jan",
      selected: false,
    },
    {
      value: 2,
      name: "Feb",
      selected: false,
    },
    {
      value: 3,
      name: "Mar",
      selected: false,
    },
    {
      value: 4,
      name: "Apr",
      selected: false,
    },
    {
      value: 5,
      name: "May",
      selected: false,
    },
    {
      value: 6,
      name: "Jun",
      selected: false,
    },
    {
      value: 7,
      name: "Jul",
      selected: false,
    },
    {
      value: 8,
      name: "Aug",
      selected: false,
    },
    {
      value: 9,
      name: "Sep",
      selected: false,
    },
    {
      value: 10,
      name: "Oct",
      selected: false,
    },
    {
      value: 11,
      name: "Nov",
      selected: false,
    },
    {
      value: 12,
      name: "Dec",
      selected: false,
    },
  ],
  currentDay: 1,
  currentMonth: 1,
  currentYear: 2023,
  currentWeek: 1,
  days: [],
  weeks: [],
  dayList: []
});

onMounted(() => {
  state.currentYear = new Date().getFullYear()
  state.currentMonth = new Date().getMonth() + 1
  state.yearList.forEach((item) => {
    if (item.value === state.currentYear) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
  selectedMonth(state.currentMonth)
});

// 初始化日历数据
const initData = (cur) => {
  let date;
  if (cur) {
    date = new Date(cur);
  } else {
    const d = new Date(
      formatDate(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    d.setDate(35);
    date = new Date(formatDate(d.getFullYear(), d.getMonth() + 1, 1));
  }

  state.currentDay = date.getDate(); // 月份的某一天
  state.currentYear = date.getFullYear();
  state.currentMonth = date.getMonth() + 1;
  state.currentWeek = date.getDay(); // 表示星期的某一天的数字 1...6,0

  if (state.currentWeek === 0) {
    state.currentWeek = 7;
  }

  const target = formatDate(
    state.currentYear,
    state.currentMonth,
    state.currentDay
  );

  state.days.length = 0;
  // 根据本月的1号获取之前的几天放到前面
  for (let i = state.currentWeek; i >= 0; i--) {
    const d2 = new Date(target);
    d2.setDate(d2.getDate() - i);
    const map = {};
    map.day = d2;
    
    state.weeks.push(getYearWeek(d2.getFullYear(), d2.getMonth()+1, d2.getDate()))
    state.days.push(map);
  }
  // 之后的其他周
  for (let j = 1; j < 35 - state.currentWeek; j++) {
    const d3 = new Date(target);
    d3.setDate(d3.getDate() + j);
    const map = {}
    map.day = d3;
    state.weeks.push(getYearWeek(d3.getFullYear(), d3.getMonth()+1, d3.getDate()))
    console.log(state.weeks);
    state.days.push(map);
  }
  state.dayList = []
  for (let i = 0; i < state.days.length; i += 7) {
    state.dayList.push(state.days.slice(i, i + 7));
  }
  
};

// 年份选择
const yearSelect = () => {
  getDays(state.currentYear, state.currentMonth);
};

// 月分选择
const selectedMonth = (m) => {
  state.currentMonth = m;
  state.monthList.forEach((item) => {
    if (item.value === m) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
  getDays(state.currentYear, state.currentMonth);
};

// 获取日期
const getDays = (year, month) => {
  const d = new Date(formatDate(year, month, 1));
  initData(formatDate(d.getFullYear(), d.getMonth() + 1, 1));
};

// 格式化日期
const formatDate = (year, month, day) => {
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return year ? year + "-" + month + "-" + day : month + "-" + day;
};

// 判断是否周末
const isWeekend = (date) => {
  return date.getDay() === 6 || date.getDay() === 0;
};

// 判断当前日期为当年第几周
const getYearWeek = function (year, month, day) {
  // console.log(year);
  // console.log(month);
  // console.log(day);
    //date1是当前日期
    //date2是当年第一天
    //d是当前日期是今年第多少天
    //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    let date1 = new Date(year, parseInt(month) - 1, day)
    let date2 = new Date(year, 0, 1)
    let d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
    return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
};

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

.month {
  width: 72px;
  display: flex;
  margin-top: 20px;
}

.month-item {
  font-weight: 600;
  border: 1px solid #ddd;
  padding: 4px;
  text-align: center;
  cursor: pointer;
}

.actived {
  background: rgb(231, 27, 27);
  color: #fff;
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

<template>
  <div class="time-card">
    <div class="left">
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
      <div class="tips">
        <div class="tips-item">· content1</div>
        <div class="tips-item">· content2</div>
      </div>
    </div>
    <div class="right">
      <div class="weekdays">
        <div class="weekdays-item">Sun</div>
        <div class="weekdays-item">Mon</div>
        <div class="weekdays-item">Tue</div>
        <div class="weekdays-item">Web</div>
        <div class="weekdays-item">Thu</div>
        <div class="weekdays-item">Fri</div>
        <div class="weekdays-item">Set</div>
      </div>
      
      <div class="days">
        <div class="days-item" v-for="(item, i) in state.days" :key="i">
          <div
            :class="{
              list: item.day.getMonth() + 1 === state.currentMonth,
              'other-month': item.day.getMonth() + 1 !== state.currentMonth,
              'weekend-day': isWeekend(item.day) && item.day.getMonth() + 1 === state.currentMonth,
              otherWeekendDay: isWeekend(item.day) && item.day.getMonth() + 1 !== state.currentMonth,
            }"
          >
            <div class="day-text">
              {{
                formatDate(null, item.day.getMonth() + 1, item.day.getDate())
              }}
            </div>
            <div class="hard" v-if="!isWeekend(item.day)">辛苦了！</div>
            <div class="work-time" v-if="!isWeekend(item.day)">
              <div>· 09:00</div>
              <div>· 18:00</div>
            </div>
            <div class="weekend-tag">
              <p v-if="isWeekend(item.day) && !isFestival(item.day)" class="weekend-text">周末</p>
              <p v-else-if="isFestival(item.day)" class="festival-data">节假日</p>
              <p v-else class="daily-text">工作日</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { festivalData } from "../utils/index"

const state = reactive({
  yearList: [
    {
      value: 2022,
      selected: false,
    },
    {
      value: 2023,
      selected: true,
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
      selected: true,
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
  currentMonth: 6,
  currentYear: 2023,
  currentWeek: 1,
  days: []
});

onMounted(() => {
  initData(null);
});

// 初始化日历数据
const initData = (cur) => {
  let date;
  if (cur) {
    date = new Date(cur);
  } else {
    const d = new Date(formatDate(new Date().getFullYear(), new Date().getMonth(), 1));
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

  const target = formatDate(state.currentYear, state.currentMonth, state.currentDay);

  state.days.length = 0;
  // 根据本月的1号获取之前的几天放到前面
  for (let i = state.currentWeek; i >= 0; i--) {
    const d2 = new Date(target);
    d2.setDate(d2.getDate() - i);
    const map = {
      startTime: '09:20:00',
      endTime: '18:00:00',
    };
    map.day = d2;
    state.days.push(map);
  }
  // 之后的其他周
  for (let j = 1; j < 35 - state.currentWeek; j++) {
    const d3 = new Date(target);
    d3.setDate(d3.getDate() + j);
    let map;
    if(j === 2 || j === 5 || j === 11){
      map = {
        startTime: '09:30:00',
        endTime: '18:00:00',
      }
    } else if( j === 20 || j === 28) {
      map = {
        startTime: 0,
        endTime: 0,
      }
    } else {
      map = {
        startTime: '09:00:00',
        endTime: '18:00:00',
      }
    }
    map.day = d3;
    state.days.push(map);
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
  if (year) {
    return year + "-" + month + "-" + day;
  } else {
    return month + "-" + day;
  }
};

// 判断是否周末
const isWeekend = (date) => {
  return date.getDay() === 6 || date.getDay() === 0;
};

// 判断节假日
const isFestival = (item) => {
  const date = formatDate(item.getFullYear(), item.getMonth()+1, item.getDate());
  return festivalData[state.currentYear].includes(date);
};

</script>
<style scoped>
.time-card {
  font-size: 13px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.left {
  flex: 0 0 100px;
  color: #333333;
  padding: 20px 10px;
}

.month {
  width: 72px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.month-item {
  font-weight: 600;
  width: 36px;
  border: 1px solid #ddd;
  padding: 4px;
  text-align: center;
  cursor: pointer;
}

.actived {
  background: rgb(231, 27, 27);
  color: #fff;
}

.tips {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.right {
  width: 1200px;
}

.weekdays {
  margin: 0;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  justify-content: space-around;
  border-bottom: 1px solid #e5e5e5;
}

.weekdays-item {
  display: inline-block;
  width: 13.6%;
  text-align: center;
}

.days {
  padding: 10px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.days-item {
  list-style-type: none;
  display: inline-block;
  width: 13.4%;
  border: 1px solid #e5e5e5;
  margin: 5px;
  border-radius: 4px;
}

.list {
  padding: 4px;
  position: relative;
  height: 100px;
  color: #000;
  background-color: #fff;
}

.other-month {
  padding: 4px;
  position: relative;
  height: 100px;
  color: #7b7b7b;
  background-color: #bfbfbf59;
}

.hard {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #70b562;
  color: #fff;
  border-radius: 3px;
  padding: 0 4px;
}

.day-text {
  font-weight: 600;
  text-decoration: underline;
  text-align: left;
  margin-left: 10px;
}
.work-time{
  margin-left: 10px;
}
.weekend-tag {
  position: absolute;
  bottom: 0px;
  right: 0px;
}

.weekend-text {
  color: red;
  margin: 2px 5px;
}

.festival-data {
  color: rgb(209, 39, 39);
  border-radius: 5px;
  border: 1px solid #d1d1d1;
  width: 50px;
  text-align: center;
}

.daily-text {
  border-radius: 5px;
  border: 1px solid #d1d1d1;
  width: 50px;
  text-align: center;
  color: #000;
}

.weekend-day {
  background-color: #99ea5f;
}

.otherWeekendDay {
  background-color: #99ea5f75;
}
</style>

<template>
  <v-app>
    <v-container class="dates">
      <h2 class="mb-4">Calculate Business Days and Hours</h2>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field @change="calcDaysTimes" v-model="pickStartDate" outlined label="Start Date">
            <template v-slot:append>
              <v-menu offset-y transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">
                    mdi-calendar-month
                  </v-icon>
                </template>
                <v-date-picker @change="calcDaysTimes" v-model="pickStartDate"></v-date-picker>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field @change="calcDaysTimes" v-model="pickStartTime" outlined label="Start Time">
            <template v-slot:append>
              <v-menu offset-y transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">
                    mdi-clock-outline
                  </v-icon>
                </template>
                <v-time-picker @change="calcDaysTimes" v-model="pickStartTime" ampm-in-title format="24hr"></v-time-picker>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field @change="calcDaysTimes" v-model="pickEndDate" outlined label="End Date">
            <template v-slot:append>
              <v-menu offset-y transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">
                    mdi-calendar-month
                  </v-icon>
                </template>
                <v-date-picker @change="calcDaysTimes" v-model="pickEndDate"></v-date-picker>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field @change="calcDaysTimes" v-model="pickEndTime" outlined label="End Time">
            <template v-slot:append>
              <v-menu offset-y transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">
                    mdi-clock-outline
                  </v-icon>
                </template>
                <v-time-picker @change="calcDaysTimes" v-model="pickEndTime" ampm-in-title format="24hr"></v-time-picker>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-btn class="mb-4" color="primary" @click="calcDaysTimes">Refresh</v-btn>
      <div>Business Days: {{businessDays}}</div>
      <div>Business Hours: {{formatHours(businessHours)}}</div>
      <div>Includes Holidays:</div>
      <div v-for="(day,index) in holidays" :key="index">
        {{day.date}} {{day.title}}
      </div>

    </v-container>

  </v-app>
</template>

<script>
  const businessTimes = require('./businessdayshours')

  export default {
    name: 'App',
    data: () => ({
      pickStartDate: '2022-05-18',
      pickStartTime: '08:30',
      pickEndDate: '2022-05-19',
      pickEndTime: '08:30',
      events: [],
      businessDays:'',
      businessHours:'',
      holidays:[]
    }),
    async mounted() {
      let response = await fetch('https://www.gov.uk/bank-holidays.json')
      let data = await response.json()
      console.log(data['england-and-wales'].events)
      businessTimes.setEvents(data['england-and-wales'].events)
      businessTimes.setTimes(8,30,17,0) // didn't need to set, this is the default
      this.calcDaysTimes()
    },
    methods:{
      formatHours(hours){
        return `${Math.trunc(hours)}hr${Math.round((hours%1)*60)}m`
      },
      calcDaysTimes(){
        let startDate = new Date(`${this.pickStartDate}T${this.pickStartTime}:00`)
        let endDate = new Date(`${this.pickEndDate}T${this.pickEndTime}:00`)
        let result = businessTimes.days(startDate, endDate, businessTimes.returnEvents)
        this.businessDays = result.days
        this.holidays = result.events
        this.businessHours = businessTimes.hours(startDate, endDate)
      }
    }
  };
</script>

<style>
.dates{
  font-size: 1.5em;
  font-weight: bold;
}
</style>
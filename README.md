# Calculate Business Days and Hours

```businessdayshours.js```

Calculate the number of business (working) days (inclusive) and number of business hours between two date/times.

## Usage

```
const businessTimes = require('./businessdayshours')
let days = businessTimes.days(startDate, endDate)
let hours = businessTimes.hours(startDate, endDate)
```

You can also use a list of event days for additional holidays by using businessTimes.setEvents.
```
let events=[
    {date: '2022-12-27', title:'Christmas Day'},
    {date: '2022-12-26', title:'Boxing Day'}
]
businessTimes.setEvents(events)
```

This is compatible with the Bank Holidays api on gov.uk (https://www.gov.uk/bank-holidays.json).

If you want to return the event days in between for days or hours you can pass businessTimes.returnEvents as the last parameter. An object containing days or hours and events is returned.
```
days = businessTimes.days(startDate, endDate, businessTimes.returnEvents)
console.log(days.day, days.events)

hours = businessTimes.hours(startDate, endDate, businessTimes.returnEvents)
console.log(hours.hours, hours.events)
``` 

The working day by default is 9am-5pm, an 8 hour day. If you want to change this you can use businessTimes.setTimes and pass the starting hours, minutes and ending hours & minutes.
```
businessTimes.setTimes(8,30,17,0)
```

## Original Code

I had originally written the algorithm for calculating days without using loops, which is what you normally see. However, I then came across a much more elegant method to mine but it had a slight defect when crossing from BST to GMT when you loose an hour it threw off the end test condition. So the main day routine is based on https://gist.github.com/mazfreelance/0660c50a65ab56c5eb400447275a8f32 with the fix and additional event day handling.

## Test Project setup

A Vue test project is used to show the businessdayhours.js script in action. It downloads the UK Bank Holidays to automatically populate the events.
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

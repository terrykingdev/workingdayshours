let startHours = 9
let startMinutes = 0
let endHours = 17
let endMinutes = 0
let businessHours = 8
let eventDates = []

module.exports = {
    days: countBusinessDays,
    hours: countBusinessHours,
    setTimes,
    setEvents,
    returnEvents: true,
}

function setEvents(events) {
    eventDates = events
}

function setTimes(sHours, sMinutes, eHours, eMinutes) {
    startHours=sHours
    startMinutes=sMinutes
    endHours=eHours
    endMinutes=eMinutes
    let sDate = new Date(0)
    sDate.setHours(startHours, startMinutes, 0, 0)
    let eDate = new Date(0)
    eDate.setHours(endHours, endMinutes, 0, 0)
    businessHours=(eDate - sDate) / 3600000
}

function countBusinessDays(startDate, endDate, returnObject = false) {
    // Original code from https://gist.github.com/mazfreelance/0660c50a65ab56c5eb400447275a8f32
    let sDate = new Date(startDate)
    let eDate = new Date(endDate)
    if (eDate < sDate) return 0         // Validate input
    let millisecondsPerDay = 86400000   // Day in milliseconds
    sDate.setHours(1, 0, 0, 1)          // Slight adjustment over the original, +1 hour so leaving daylight saving doesn't effect the result.
    eDate.setHours(23, 59, 59, 999)     // End just before midnight
    // Calculate days between dates
    let diff = eDate - sDate            // Milliseconds between datetime objects    
    let days = Math.ceil(diff / millisecondsPerDay)
    days -= Math.floor(days / 7) * 2    // Subtract two weekend days for every week in between
    let startDay = sDate.getDay()       // Get the day of week
    let endDay = eDate.getDay() 
    if (startDay - endDay > 1) days -= 2  // Remove weekend not previously removed.
    // Remove start day if span starts on Sunday but ends before Saturday
    // or end day if span ends on Saturday but starts after Sunday
    if ((startDay == 0 && endDay != 6) || (endDay == 6 && startDay != 0)) days -= 1
    let correction = 0
    let eventList = []
    if (eventDates?.length > 0) {
        for (let event of eventDates) {
            let m = event.date.match(/(\d+)-(\d+)-(\d+)/)
            let eventDate = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), 12, 0, 0, 0, 0)
            if (eventDate >= sDate && eventDate <= eDate) {
                eventList.push(event)
                correction++
            }
        }
    }
    days -= correction
    if (returnObject) {
        return {
            days,
            events: eventList
        }
    } else {
        return days
    }
}

function isSameDate(date1, date2) {
    let d1 = new Date(date1)
    let d2 = new Date(date2)
    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)
    return d1.getTime() == d2.getTime()
}

function isEventDay(eventDay) {
    let r = false
    let checkDay = new Date(eventDay)
    checkDay.setHours(0, 0, 0, 0)
    if (eventDates?.length > 0) {
        for (let event of eventDates) {
            let m = event.date.match(/(\d+)-(\d+)-(\d+)/)
            let eventDate = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), 0, 0, 0, 0)
            if (eventDate.getTime() == checkDay.getTime()) {
                r = true
                break
            }
        }
    }
    return r
}

function countBusinessHours(startTime, endTime, returnObject = false) {
    let bd = countBusinessDays(startTime, endTime, returnObject)
    let eventList
    if (returnObject) {
        eventList = bd.events
        bd = bd.days
    }
    let startTest = new Date(startTime)
    startTest.setHours(startHours, startMinutes, 0, 0)
    let endTest = new Date(endTime)
    endTest.setHours(endHours, endMinutes, 0, 0)
    if (startTime < startTest) startTime.setHours(startHours, startMinutes, 0, 0)
    if (startTime > endTest) startTime.setHours(endHours, endMinutes, 0, 0)
    if (endTime < startTest) endTime.setHours(startHours, startMinutes, 0, 0)
    if (endTime > endTest) endTime.setHours(endHours, endMinutes, 0, 0)

    let day1End = new Date(startTime)
    day1End.setHours(endHours, endMinutes, 0)
    let day1Hours = Math.max(0, Math.min((day1End - startTime) / 3600000, businessHours))

    let day2Start = new Date(endTime)
    day2Start.setHours(startHours, startMinutes, 0, 0)
    let day2Hours = Math.max(0, Math.min((endTime - day2Start) / 3600000, businessHours))

    let bh = 0
    console.log("bd",bd,day1Hours,day2Hours)
    if (isSameDate(startTime, endTime)) {
        bh = Math.max(0, Math.min((endTime - startTime) / 3600000, businessHours))
        if (bd == 0) bh = 0
    } else if (bd == 1) {
        bh = day1Hours
        if (startTime.getDay() == 6 || startTime.getDay() == 0 || isEventDay(startTime)) {
            bh = day2Hours
        }
    } else if (bd == 2) {
        bh = day1Hours + day2Hours
    } else {
        bh = Math.max(((bd - 2) * businessHours) + day1Hours + day2Hours, 0)
    }
    if (returnObject) {
        return {
            hours: bh,
            events: eventList
        }
    } else {
        return bh
    }
}
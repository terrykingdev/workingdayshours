const businessTimes=require('./businessdayshours.js')

function countBusinessDaysBrute(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    let hours=curDate.getUTCHours()
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay()
        if(dayOfWeek !== 0 && dayOfWeek !== 6) count++
        curDate.setDate(curDate.getDate() + 1)
        curDate.setUTCHours(hours)
    }
    return count;
}

let d1
let d2
let error
let maxOuter=100;
let maxInner=100;
for(x=0;x<maxOuter;x++){
    for(y=0;y<maxInner;y++){
        d1=new Date()
        d2=new Date()
        d1.setTime(d1.getTime()+(3600000*24*y))
        d2.setTime(d1.getTime()+(3600000*24*x))
        if (countBusinessDaysBrute(d1,d2)!=businessTimes.days(d1,d2)){
            error=true
            console.log(d1)
            console.log(d2)
            console.log("Brute count:",countBusinessDaysBrute(d1,d2),"businessTimes.days:",businessTimes.days(d1,d2))
        }
    }
}
if (!error){
    console.log(`${maxOuter*maxInner} tests completed successfully`)
}

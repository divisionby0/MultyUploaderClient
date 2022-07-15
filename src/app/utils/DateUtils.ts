export class DateUtils{
    public static parseYearMonthDay(date:Date):string{
        var dateYear:string = date.getFullYear().toString();
        var monthString:string = "";
        var dayString:string = "";

        var dateMonthNumber:number = date.getMonth()+1;

        if(dateMonthNumber < 10){
            monthString = "0"+dateMonthNumber.toString();
        }
        else{
            monthString = dateMonthNumber.toString();
        }

        var dateDayNumber:number = date.getDate();
        if(dateDayNumber < 10){
            dayString = "0"+dateDayNumber.toString();
        }
        else{
            dayString = dateDayNumber.toString();
        }
        
        return dayString+"."+monthString+"."+dateYear;
    }
    
    public static parseHourMinute(date:Date):string{

        var hourString:string = "";
        var minuteString:string = "";
        
        var timeHourNumber:number = date.getHours();
        var timeMinuteNumber:number = date.getMinutes();

        if(timeHourNumber < 10){
            hourString = "0"+timeHourNumber.toString();
        }
        else{
            hourString = timeHourNumber.toString();
        }

        if(timeMinuteNumber < 10){
            minuteString = "0"+timeMinuteNumber.toString();
        }
        else{
            minuteString = timeMinuteNumber.toString();
        }
        
        return hourString+":"+minuteString;
    }
}

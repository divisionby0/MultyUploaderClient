export class StringUtil {
    public static toDuration(seconds:number):string{
        var hString = "00";
        var mString = "00";
        var sString = "00";
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {
            hString   = "0"+hours;
        }
        else{
            hString = hours.toString();
        }
        if (minutes < 10) {
            mString = "0"+minutes;
        }
        else{
            mString = minutes.toString();
        }
        if (seconds < 10) {
            sString = "0"+seconds;
        }
        else{
            sString = seconds.toString()
        }
        return hString+':'+mString+':'+sString;
    }
}
export class TextChatHistoryUtils {
    public static sort(src:any[]):any[]{
        src.sort(function(a, b) {
            var aTime:number = new Date(a.time).getTime();
            var bTime:number = new Date(b.time).getTime();

            if(aTime > bTime){
                return 1;
            }
            else if(aTime < bTime){
                return -1;
            }
            else{
                return 0
            }
        });
        
        return src;
    }
}
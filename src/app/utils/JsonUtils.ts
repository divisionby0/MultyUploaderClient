export class JsonUtils {
    public static isJson(data):boolean{

        var isNumberOnly:boolean = JsonUtils.isNumeric(data);

        if(isNumberOnly){
            return false;
        }
        else{
            try {
                var parsed:any = JSON.stringify(JSON.parse(data));
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    public static isNumeric(data):boolean {
        if (typeof data != "string") return false; // we only process strings!
        return !isNaN(Number(data)) && !isNaN(parseFloat(data));
    }
}
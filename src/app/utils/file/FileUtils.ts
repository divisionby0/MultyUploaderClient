
export class FileUtils {
    public static imageExists(image_url:string):boolean{

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        try{
            http.send();
        }
        catch(error){
          console.log("[FileUtils] imageExists error: "+error);
            //EventBus.dispatchEvent(AppEvent.SEND_LOG, {className:"FileUtils", value:"imageExists error: "+error});
            return false;
        }


        return http.status != 404;
    }

    public static imageAvailable(image_url:string):boolean{

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);

        try{
            http.send();
        }
        catch(error){
          console.log("[FileUtils] imageAvailable error: "+error);
            //EventBus.dispatchEvent(AppEvent.SEND_LOG, {className:"FileUtils", value:"imageAvailable error: "+error});
            return false;
        }

        return http.status != 403;
    }
}

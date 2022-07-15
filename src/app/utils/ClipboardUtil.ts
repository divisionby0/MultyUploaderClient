export class ClipboardUtil {
    public static copy(src:string):void{
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = src;
        // Set non-editable to avoid focus and move outside of view
        //el.style = {position: 'absolute', left: '-9999px'};
        el.setAttribute('style', 'position: absolute; left: -9999px;');
        el.setAttribute('readonly', '');
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
}
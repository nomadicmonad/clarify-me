export const randomPastelColors = () => {
    var red = Math.floor(Math.random()*256)
    var green = Math.floor(Math.random()*256)
    var blue = Math.floor(Math.random()*256)

    red = Math.round( (red + 255) / 2);
    green = Math.round((green + 255) / 2);
    blue = Math.round((blue + 255) / 2);

    return String(red) + "," + String(green) + "," + String(blue);
}

export const randomHsl = () => {
    var r = Math.random()
    return ['hsla(' + (r * 360) + ', 100%, 65%, 1)','hsla(' + (r * 360) + ', 100%, 65%, 1)','hsla(' + (r * 360) + ', 100%, 20%, 0.95)'];
}

export const hslToRgb = (hsla) => {
    var h = parseInt(hsla.replace('hsla(','').replace(')','').split(',')[0])/360
    var s = parseInt(hsla.replace('hsla(','').replace(')','').replace('%','').split(',')[1])/100
    var l = parseInt(hsla.replace('hsla(','').replace(')','').replace('%','').split(',')[2])/100
    var a = parseFloat(hsla.replace('hsla(','').replace(')','').replace('%','').split(',')[3])
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255),a];
    //return 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',' + a + ')';
}



export const shadeColor = (rgba,percent,opacity) => {


            var R = parseInt(rgba[0] * (100 + percent) / 100);
            var G = parseInt(rgba[1] * (100 + percent) / 100);
            var B = parseInt(rgba[2] * (100 + percent) / 100);

            R = (R<255)?R:255;  
            G = (G<255)?G:255;  
            B = (B<255)?B:255;  


            return 'rgba(' + R + ',' + G + ',' + B + ',' + rgba[3]*opacity + ')'
        }
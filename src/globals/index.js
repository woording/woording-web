var globals = {}

export default globals

globals.validateInput = input => {
    return new Promise((resolve, reject) => {
        if (input.match(/^[0-9a-zA-Z\-\_\s]+$/)){
            resolve('Legal input')
        }
        else {
            reject('Illegal input')
        }
    })
}

globals.getCookie = cookieName => {
    let name = cookieName + "=";
    let cookieAttributes = document.cookie.split(';');
    for(let i = 0; i < cookieAttributes.length; i++) {
        let cookie = cookieAttributes[i];
        while (cookie.charAt(0)==' ') cookie = cookie.substring(1);
        if (cookie.indexOf(name) == 0) return cookie.substring(name.length, cookie.length);
    }
    return "";
}

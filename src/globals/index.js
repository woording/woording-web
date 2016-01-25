var globals = {}

export default globals

globals.validateInput = input => {
    return new Promise((resolve, reject) => {
        if (input.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]){1,10}/, '').match(/^[0-9a-zA-Z\-\_\s]+$/)){
            resolve('Legal input')
        }
        else {
            reject('Illegal input')
        }
    })
}

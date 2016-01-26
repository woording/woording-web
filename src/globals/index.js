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

var globals = {}

export default globals

globals.validateInput = input => {
    return new Promise((resolve, reject) => {
        if (input.match(/^[0-9a-zA-Z]+$/)){
            console.log('Legal input')
        } else {
            console.log('Illegal input!')
        }
    })
}

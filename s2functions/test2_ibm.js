const callIBM = require('./useIBM')

const text = ""

const testAgain = async () => {
    const call = async () =>{
        const results = await callIBM.callIBM(text)
        //console.log(results)
        return results
    }
    const testResults = await call();
    console.log(testResults)
}

testAgain()





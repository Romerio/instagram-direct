const KinboxDirect = require('../kinbox-direct')

const setWorkspaceSession = async ({ }) => {
    try {
        this.param = '# setWorkspaceSession'
        console.log(this.param, (new Date().toString()))

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(this.param, (new Date().toString()))
                return resolve()
            }, 2000)
        })
    } catch (error) {
        throw error
    }
}

const getWorkspaceSession = async ({ }) => {
    try {
        this.param = '# getWorkspaceSession'

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(this.param)
                return resolve()
            }, 2000)
        })
    } catch (error) {
        throw error
    }
}

const execTest = async () => {
    try {
        console.log('#0')
        const kinboxDirectClient = new KinboxDirect({ setWorkspaceSession, getWorkspaceSession })
        const username = 'koruja_contato'
        const password = 'krjknbx84902'

        console.log('#1')

        const result = await kinboxDirectClient.logInAndGetSession({ 
            username: username,
            password: password,
        })
        
        console.log('# result')
        console.log(Object.keys(result))

    } catch (error) {
        console.log(error)
    }
}

execTest()
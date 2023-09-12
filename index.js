//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')
//modulos internos
const fs = require('fs')

console.log(chalk.bgBlue.black('Seja bem vindo ao account'))
operation()
function operation (){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Oque você deseja fazer?',
        choices:[
            'Criar Conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then((answer)=>{const action=answer['action']
            if(action==='Criar Conta'){createAccount()}
            else if(action==='Consultar saldo'){
                getAccountBalance()
                
            }
            else if(action==='Depositar'){
                deposit()
            }
            else if(action==='Sacar'){
                withdraw()
            }
            else if(action==='Sair'){
                console.log(chalk.bgBlue.black('Obrigado por usar o accounts!'))
                process.exit()
            }
    })   
        .catch((err)=>{
            console.log(err)
        })}
//criando conta
function createAccount(){
    console.log(chalk.bgGreen.black("Parabéns por escolher o account"))
    console.log(chalk.green('Defina as opções da sua conta a seguir:'))
    buildAccount()
}
function buildAccount(){
    inquirer.prompt([{
        name:'nameAccount',
        message:'Digite um nome para sua conta:'
    }]).then((answer)=>{
        const nameInfo = answer['nameAccount']
        if(!fs.existsSync('ACCOUNTS')){
            fs.mkdirSync('ACCOUNTS') }
        if(fs.existsSync(`ACCOUNTS/${nameInfo}.json`)){
            console.log(chalk.bgRed.black("Essa conta já existe,por favor digite outro nome"))
            buildAccount()
            return
        }inquirer.prompt([{
            name:'password',
            message:'Defina uma senha'
        }]).then((answer)=>{
            const password = answer['password']
            fs.writeFileSync(`ACCOUNTS/${nameInfo}.json`,`{"balance":0,"password":${password}}`,function(errr){console.log(err)})
            console.log(chalk.green('Sucesso!,sua conta foi criada.'))
            operation()
        })
       
    })
    .catch((err)=>{console.log(err)})
}

//verificando senha

function correctPassword(accountName,password){
    const account =getAccount(accountName)
    if(account.password !=password){
        console.log(chalk.red('Senha incorreta,tente novamente'))
        return operation
    }

}
// depositar
function deposit(){
    inquirer.prompt([{
        name:'accountName',
        message:'Qual o nome da sua conta?' 
    }]).then((answer)=>{
        const accountName = answer['accountName']
        if(accountName==='sair'){
            return operation()
        }
        //verificando se a conta existe
        if(!contaExiste(accountName)){
            return deposit()
        }
        inquirer.prompt([{
            name:'password',
            message:'Digite sua senha: '
        }]).then((answer)=>{
            const password =answer['password']
            if(correctPassword(accountName,password)){
                return deposit()
            }
            inquirer.prompt([{
                name:'amount',
                message:'Quanto você deseja depositar?'
            }]).then((answer)=>{
                const amount =answer['amount']
                addAmount(accountName,amount)
            }).catch((err)=>{console.log(err)})
        })
        .catch((err)=>{console.log(err)})
        }
        )
      
}

function contaExiste(accountName){
    if(!fs.existsSync(`ACCOUNTS/${accountName}.json`))
    {console.log(chalk.bgRed.black('Essa conta não existe!'))
    return false}
    else{
        return true
    }
}
//depositando
function addAmount(accountName,amount){
    const account =getAccount(accountName)
    if(!amount){console.log('ocorreu um erro,tente de novo')
        return operation()}
    account.balance =parseFloat(amount)+parseFloat(account.balance)
    fs.writeFileSync(`ACCOUNTS/${accountName}.json`,JSON.stringify(account))

    console.log(chalk.green(`Foi depositado um valor de R$${amount}`))
    return operation()
}

function getAccount(accountName){
    const accountJson = fs.readFileSync(`ACCOUNTS/${accountName}.json`,{
        encoding: 'utf-8',
        flag: 'r'

    })
    return JSON.parse(accountJson)

}
function getAccountBalance(){
    inquirer.prompt([{
        name:'accountName',
        message:'Qual nome da sua conta?'
    }]).then((answer)=>{
        const accountName =answer['accountName']
        //verificar se a conta existe
        if(!contaExiste(accountName)){
           return  getAccountBalance()
        }
        inquirer.prompt([{
            name:'password',
            message:'Digite sua senha:'
        }]).then((answer)=>{
            const password = answer['password']
            if(correctPassword(accountName,password)){
                return operation()
            }
            const accountData =getAccount(accountName)
            console.log(chalk.bgBlueBright.black(`Olá o saldo da sua conta é de R$${accountData.balance}`))
            operation()
        })
        
    })
    .catch((err)=>{console.log(err)})
}

//sacar 
function withdraw(){
    inquirer.prompt([{
        name:'accountName',
        message:'Qual o nome da sua conta?'
    }]).then((answer)=>{
        const accountName = answer['accountName']
        if(!contaExiste(accountName)){
            return operation()
        }
        inquirer.prompt([{
            name:'password',
            message:'Digite sua senha:'
        }]).then((answer)=>{
            const password =answer['password']
            if(correctPassword(accountName,password)){
                return operation()
            }
               inquirer.prompt([{
                    name:'amount',
                    message:'Quanto você deseja sacar?'
                }]).then((answer)=>{
                    const amount = answer['amount']
                    removeAmount(accountName,amount)
                    return operation()
                })
                .catch((err)=>{console.log(err)})
        })
       
    })
    .catch((err)=>{console.log(err)})
}

function removeAmount(accountName,amount){
    const accountData = getAccount(accountName)

    if (!amount){
        console.log(chalk.bgRed.black("ocorreu um erro,tente de novo"))
        return withdraw()
    }
    if (amount>accountData.balance){
        console.log(chalk.bgRed("Saldo insuficiente!"))
        return withdraw()
    }
    accountData.balance = parseFloat(accountData.balance)-parseFloat(amount)
    fs.writeFileSync(`ACCOUNTS/${accountName}.json`,JSON.stringify(accountData))
    console.log(chalk.green(`Foi realizado um saque de R$${amount} na sua conta`))

}

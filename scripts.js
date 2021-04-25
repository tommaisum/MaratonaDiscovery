const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev,finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions))
    },
}


const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },
    incomes(){
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income = income + transaction.amount;
            }
        })
        return income;
    },
    expenses(){
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0){
                expense = expense + transaction.amount;
            }
        })
        return expense;
    },
    total(){
        
        return Transaction.incomes() + Transaction.expenses()
    },
   
}


//substituir dado do HTML com os dados do JS

const DOM = {
    transactionsContainer : document.querySelector("#data-table tbody"),
    
    addTransaction(transaction, index){
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)
        
    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        // ? aqui significa que seguira dois caminho income pra true e expense para false separado por dois pontos.        

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="data">${transaction.date}</td>
        <th>
            <img onclick ="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </th>
    
    `
    return html
    },
    uptadeBalance(){
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())
        
        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    },

}

const Utils= {
    formatAmount(value){
        value = Number(value) * 100
        return Math.round(value)
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        // /\D/g significa q vai pegar todas as string de forma global e transformar em algo
        
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    
   
    
    validateFields(){
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" || 
        amount.trim()=== "" || 
        date.trim() === ""){

            throw new Error("Por Favor, preencha todos os campos")

        }
    },

    formatValues() {
        let { description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value =""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try{
            //Validando os campos
            Form.validateFields()
            const transaction = Form.formatValues()
            //Formatar os dados
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
            
        } catch(error){
            alert(error.message)
        }


        
    }
}





const App={
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
            
        })

        DOM.uptadeBalance()

        
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()




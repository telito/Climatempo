//Foi usada a api https://openweathermap.org/, ela me permite até 60 requisições de cidades por minuto, um valor dificil de ultrapassar para o projeto
//A api no plano gratuito, me fornce os proximos 5 dias de previsão, com atualização a cada 3 horas.

//funções do modal



function iniciamodal(cidade, estado, ibge, populacao, obser = "") {
    //requisitando()
    const modal = document.querySelector("#modal-previsao");
    modal.classList.add('mostrar')
    ob = document.querySelector('#obser')

    if (obser == "" || obser == " " || obser == null) {
        ob.style = "display: none"
    }

    else {
        ob.style = "display: block";
        ob.innerHTML = `Observações: ${obser}`
    }

    document.querySelector("#cidade").innerHTML = `${cidade}, ${estado}`;
    document.querySelector('#ibge').innerHTML = `Codigo do IBGE: ${ibge}`;
    document.querySelector('#populacao').innerHTML = `População estimada: ${populacao}`


    //testando api, backup a baixo
        replac = cidade.replace(" ", "%20")
        var req = new XMLHttpRequest();
      
        req.onload = mostraApi;
        req.open("get", `http://api.openweathermap.org/data/2.5/forecast?q=${replac},rs,br&units=metric&lang=pt_br&APPID=c01a54301797a4147060a02f43da82c7`, true);
        req.send();
    
        function mostraApi(){
            
            requi = this.responseText
            requi = JSON.parse(requi)
            console.log(requi)
            console.log(requi.list[5].weather[0]);
            console.log(requi.list[5].weather[0]['main']);
            tempo = requi.list[5].weather[0]['description']
            tempmin = requi.list[1].main.temp_min
            tempmax = requi.list[1].main.temp_max
            total   = requi.list[1].main
            console.log(tempmin)
            console.log(tempmax)

            document.querySelector('#tempe_max').innerHTML = `A temperatura maxima de ${cidade} é: ${tempmax}`

        }
       

}

//Recebendo dados da localstore para o content e passando para o modal, aproveitando para chamar a API e editar os dados

function recebeDados() {
    local = localStorage
    local = JSON.stringify(local)
    local = JSON.parse(local)


    for (var k in local) {
        item = localStorage.getItem(k)
        grau = ""
        item = JSON.parse(item)
        
        
        mudado = k.replace(" ", "")
        link = k.replace(" ","%20")
        content = document.querySelector('#content')
        content.innerHTML += `<div class="col col-5"  onclick="iniciamodal('${k}','${item[0]}','${item[1]}','${item[2]}','${item[3]}')">
                                <div class="card">
                                    <img src="./img/chuva.jpg" alt="Chovendo">
                                    <p>${k}</p>
                                    <p class="tempe" id="${mudado}">${grau} c</p>
            
                                </div>
                              </div>`
    altera(mudado,link)                       
    }
}

recebeDados()

// A função altera, envia os dados da api para o content da primeira pagina
function altera(dado,lin){
    var req = new XMLHttpRequest();
        req.onload = mostraApi;
        req.open("get", `http://api.openweathermap.org/data/2.5/forecast?q=${lin},rs,br&units=metric&lang=pt_br&APPID=c01a54301797a4147060a02f43da82c7`, true);
        req.send();
        
        
        function mostraApi(){
            requi = this.responseText
            requi = JSON.parse(requi)
                              
            atual = requi.list[0].main.temp
            console.log(dado)
            document.querySelector(`#${dado}`).innerHTML = atual
            console.log(requi)
                          }
}



function fechamodal() {
    const modal = document.querySelector("#modal-previsao");
    modal.classList.remove('mostrar')
}

//Enviando dados para o localStorage

function Adiciona() {
    inputCidade = document.querySelector('#cidade').value;
    estado = document.querySelector('#estado').value;
    ibge = document.querySelector('#ibge').value;
    populacao = document.querySelector('#populacao').value;
    obser = document.querySelector('#obser').value;

    if (estado == "" || inputCidade == "" || ibge == "" || populacao == "") {
        alert("Você deixou campos em branco!")
    }
    else {

        cidade = new Array();
        cidade.push(estado, ibge, populacao, obser);

        jsonCidade = JSON.stringify(cidade)

        //verificando se existe alguma key igual 
        cont = 0
        inputCidade = inputCidade.toUpperCase();
        const keys = Object.keys(localStorage);
        for (i = 0; i <= keys.length; i++) {
            if (keys[i] == inputCidade) {

                i = keys.length + 1
                cont = 1
            }

        }
        if (cont >= 1) {
            alert("Esta cidade já esta cadastrada, você pode editar a mesma na pagina principal")
        }
        else {
            localStorage.setItem(inputCidade, jsonCidade);
            alert("Cidade cadastrada com sucesso!")
        }

    }



}
//Entrando em contato com a API de previsão de tempo

//Foi usada a api https://openweathermap.org/, ela me permite até 60 requisições de cidades por minuto, um valor dificil de ultrapassar para o projeto
//A api no plano gratuito, me fornce os proximos 5 dias de previsão, com atualização a cada 3 horas.



/*
function mostraApi() {
    requi = this.responseText
    requi = JSON.parse(requi)
    console.log(requi)
    console.log(requi.list[5].weather[0]);
    console.log(requi.list[5].weather[0]['main']);
    tempo = requi.list[5].weather[0]['description']
    tempmin = requi.list[1].main.temp_min
    tempmax = requi.list[1].main.temp_max
    total   = requi.list[1].main
   
};

function requisitando() {

    var req = new XMLHttpRequest();
    req.onload = mostraApi;
    req.open("get", "http://api.openweathermap.org/data/2.5/forecast?q=rio%20grande,rs,br&units=metric&lang=pt_br&APPID=c01a54301797a4147060a02f43da82c7", true);
    req.send();

}
*/




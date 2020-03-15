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
    document.querySelector('#controle').innerHTML = cidade




    replac = cidade.replace(" ", "%20")
    var req = new XMLHttpRequest();

    req.onload = mostraApi;
    req.open("get", `http://api.openweathermap.org/data/2.5/forecast?q=${replac},rs,br&units=metric&lang=pt_br&APPID=c01a54301797a4147060a02f43da82c7`, true);
    req.send();

    function mostraApi() {

        requi = this.responseText
        requi = JSON.parse(requi)


        //Enviando dados para o modal


        for (i = 0; i <= 29; i += 7) {
            tempo = requi.list[i].weather[0]['description']
            tempmin = requi.list[i].main.temp_min
            tempmax = requi.list[i].main.temp_max
            dia = requi.list[i].dt_txt[8] + requi.list[i].dt_txt[9] + "/" + requi.list[i].dt_txt[5] + requi.list[i].dt_txt[6]

            //enviando imagem inicial do modal

            if (tempo == "nublado") {
                document.querySelector('#modalimg').src = "./img/nublado.jpg"
            }
            else if (tempo == "céu limpo") {
                document.querySelector('#modalimg').src = "./img/limpo.jpg"
            }
            else if (tempo == "chuva leve") {
                document.querySelector('#modalimg').src = "./img/chuva.jpg"
            }
            else {
                document.querySelector('#modalimg').src = "./img/dispersas.jpg"
            }

            if (i == 0) {
                i = 1
                document.querySelector('#dia').innerHTML += `<div class="col col-5" onclick="alteramodal('${tempo}','${tempmin}','${tempmax}','${dia}')">
                                                            <div class="card">
                                                                <div id="Dia">
                                                                    ${dia}
                                                                </div>
                                                            </div>
                                                        </div>`



            }
            else {

                document.querySelector('#dia').innerHTML += `<div class="col col-5 col-e" onclick="alteramodal('${tempo}','${tempmin}','${tempmax}','${dia}')">
                                                            <div class="card">
                                                                <div id="Dia">
                                                                ${dia}
                                                                </div>
                                                            </div>
                                                        </div>`


            }

        }

    }


}
//função Para alterar o modal com informações especificas do tempo
function alteramodal(tempo, tempomin, tempomax, dia) {
    document.querySelector('#ibge').innerHTML = `Minima: ${tempomin}c<br> Maxíma: ${tempomax}c `
    document.querySelector('#populacao').innerHTML = `Tempo: ${tempo}`
    document.querySelector('#obser').innerHTML = `Dia: ${dia}`

    if (tempo == "nublado") {
        document.querySelector('#modalimg').src = "./img/nublado.jpg"
    }
    else if (tempo == "céu limpo") {
        document.querySelector('#modalimg').src = "./img/limpo.jpg"
    }
    else if (tempo == "chuva leve") {
        document.querySelector('#modalimg').src = "./img/chuva.jpg"
    }
    else {
        document.querySelector('#modalimg').src = "./img/dispersas.jpg"
    }

}

//Recebendo dados da localstore para o content e passando para o modal, aproveitando para chamar a API e editar os dados

function recebeDados() {
    local = localStorage
    local = JSON.stringify(local)
    local = JSON.parse(local)


    for (var k in local) {
        item = localStorage.getItem(k)

        item = JSON.parse(item)


        mudado = k.replace(" ", "")
        link = k.replace(" ", "%20")
        content = document.querySelector('#content')
        content.innerHTML += `<div class="col col-5"  onclick="iniciamodal('${k}','${item[0]}','${item[1]}','${item[2]}','${item[3]}')">
                                <div class="card">
                                    <img id="img${mudado}" src="" alt="Chovendo">
                                    <p>${k}</p>
                                    <p class="tempe" id="${mudado}"></p>
                                    
            
                                </div>
                              </div>`
        altera(mudado, link, item[0])
    }
}



// A função altera, envia os dados da api e imagens para o content da primeira pagina 
function altera(dado, lin, estado) {
    var req = new XMLHttpRequest();
    req.onload = mostraApi;
    req.open("get", `http://api.openweathermap.org/data/2.5/forecast?q=${lin},${estado},br&units=metric&lang=pt_br&APPID=c01a54301797a4147060a02f43da82c7`, false);
    req.send();


    function mostraApi() {
        requi = this.responseText
        requi = JSON.parse(requi)

        atual = Math.round(requi.list[0].main.temp)
        document.querySelector(`#${dado}`).innerHTML = `${atual}°`
        tempo = requi.list[0].weather[0]['description']


        //Testando qual imagem deve aparecer.
        if (tempo == "nublado") {
            document.querySelector(`#img${dado}`).src = "./img/nublado.jpg"
        }
        else if (tempo == "céu limpo") {
            document.querySelector(`#img${dado}`).src = "./img/limpo.jpg"
        }
        else if (tempo == "chuva leve") {
            document.querySelector(`#img${dado}`).src = "./img/chuva.jpg"
        }
        else {
            document.querySelector(`#img${dado}`).src = "./img/dispersas.jpg"
        }

    }
}



function fechamodal() {
    const modal = document.querySelector("#modal-previsao");
    modal.classList.remove('mostrar')

    //apagar informações do modal já cadastradas
    document.querySelector('#dia').innerHTML = ""
    document.querySelector('#modalimg').src = ""
}

//Função para editar cidades
function editarCidade() {
    local = localStorage
    local = JSON.stringify(local)
    local = JSON.parse(local)


    for (var k in local) {
        item = localStorage.getItem(k)

        item = JSON.parse(item)

        content = document.querySelector('#listar')
        content.innerHTML += `<div class="col col-5"  onclick="selecionaCidade('${k}','${item[0]}','${item[1]}','${item[2]}','${item[3]}')">
                                    <button class="btn"><p>${k}</p></button>
                              </div>`

    }
}
function selecionaCidade(cidade, estado, ibge, popula, obser) {

    
    document.querySelector('#selecionada').innerHTML = `<br><br> <p id="cidadeSelecionada">${cidade} selecionada!</p>  <br>`
    document.querySelector('#cidade').value = cidade
    document.querySelector('#estado').value = estado;
    document.querySelector('#ibge').value = ibge;
    document.querySelector('#populacao').value = popula;
    document.querySelector('#obser').value = obser;


}


//função para deletar cidade
function deletaCidade() {
    key = document.querySelector('#controle').innerHTML
    localStorage.removeItem(key);
    window.location.reload()
}

//Enviando dados para o localStorage

function Adiciona() {
    inputCidade = document.querySelector('#cidade').value;
    estado = document.querySelector('#estado').value;
    estado = estado.toUpperCase()
    ibge = document.querySelector('#ibge').value;
    populacao = document.querySelector('#populacao').value;
    obser = document.querySelector('#obser').value;

    if (estado == "" || inputCidade == "") {
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
//Edita os locais do localStorage

function edita() {
    inputCidade = document.querySelector('#cidade').value;
    estado = document.querySelector('#estado').value;
    estado = estado.toUpperCase()
    ibge = document.querySelector('#ibge').value;
    populacao = document.querySelector('#populacao').value;
    obser = document.querySelector('#obser').value;

    if (inputCidade == "") {
        alert("Você Não selecionou uma cidade! Escolha uma das existentes nos botões no topo.")
    }
    else {

        cidade = new Array();
        cidade.push(estado, ibge, populacao, obser);

        jsonCidade = JSON.stringify(cidade)

        //verificando se existe alguma key igual 

        localStorage.setItem(inputCidade, jsonCidade);
        alert("Cidade Editada com sucesso!")

        window.location.reload()
    }
}





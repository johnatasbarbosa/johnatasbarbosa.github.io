
$('#modalConteudoDesenho').on('hidden.bs.modal', function (e) {
    console.log("fechou");
})

Vue.component('opcao-component', {
    props: ["opcao"],
    template: `<option>{{opcao.texto}}</option>`,
    watch: {
        opcao: {
            handler: function (newValue) {
                console.log("Person with ID:" + newValue.id + " modified")
                console.log("New age: " + newValue.texto)
            },
            deep: true
        }
    }
});
Vue.component('select-component', {
    props: ["conteudoRestricao", "conteudos"],
    template: `
            <select v-model="conteudoRestricao.id">
                <option v-for="(cont, index) in conteudos" :value="cont.id">{{cont.texto}}</option>
            </select>`,
    watch: {
        conteudoRestricao: {
            handler: function (newValue) {
                console.log(this.conteudoRestricao);
                this.conteudos.forEach(function (e, i, a) {
                    console.log("element", e.id);
                    if (e.id == newValue.conteudoId) {
                        console.log("index", i);
                        this.conteudoRestricao.conteudoIndex = i;
                    }
                })
                //newValue.conteudoId = this.conteudos[newValue.conteudoIndex].id;
                console.log("Index:" + this.conteudoRestricao.conteudoIndex);
                console.log("Id: " + this.conteudoRestricao.conteudoId );
            },
            deep: true
        }
    }
});

var dimensaoPagina = {
    1: "400px",
    2: "500px",
    3: "600px"
}

var TipoConteudo = {
    MultiplaEscolha: 1,
    CaixaSelecao: 2,
    ListaSuspensa: 3,
    Escala: 4,
    MultiplasRespostas: 5,
    DivisaoValores: 6,
    RespostaCurta: 7,
    RespostaLonga: 8,
    Descricao: 9,
    Cabecalho: 10,
    FerramentaDesenho: 11,
    Grafico: 12,
    RespostaNumerica: 13,
    CaixaConfirmacao: 14,
    RespostaPesquisa: 15,
    Botao: 16,
    Data: 17,
    Email: 18
}

var TipoDesenho = {
    Marker: 1,
    Line: 2,
    Polygon: 3
}

function Desenho(desenho) {
    console.log("desenho", desenho);
    var self = this;
    self.id = desenho ? desenho.Id : 0;
    self.tipo = desenho ? desenho.Tipo : 0;

    self.indexOverlay = -1;

    self.coordenadas = [];
    self.respostasDesenho = [];
    if (desenho) {
        if (desenho.Coordenadas)
            desenho.Coordenadas.forEach(function (coordenada) {
                self.coordenadas.push(new Coordenada(coordenada));
                //self.coordenadas.push(new Coordenada({ Latitude: coordenada.latitude, Longitude: coordenada.longitude }));
            })
    }

    self.respostaId = desenho ? desenho.RespostaId : 0;
}

function Coordenada(coordenada) {
    console.log("coordenada", coordenada);
    var self = this;
    self.id = coordenada ? coordenada.Id : 0;
    self.latitude = coordenada ? coordenada.Latitude : 0;
    self.longitude = coordenada ? coordenada.Longitude : 0;

    self.desenhoId = coordenada ? coordenada.DesenhoId : 0;
}

function RespostaDesenho(respostaDesenho) {
    console.log("RespostaDesenho", respostaDesenho);
    var self = this;
    self.id = respostaDesenho ? respostaDesenho.Id : 0;
    self.texto = respostaDesenho ? respostaDesenho.Texto : "";
    self.valor = respostaDesenho ? respostaDesenho.Valor : null;
    self.marcado = respostaDesenho ? respostaDesenho.Marcado : false;

    self.opcoesView = [];
    self.opcoes = [];
    self.desenhos = [];
    //if (respostaDesenho && respostaDesenho.Opcoes) {
    //    respostaDesenho.Opcoes.forEach(function (opcao) {
    //        self.opcoes.push(new Opcao(opcao));
    //    })
    //}

    self.conteudoDesenhoId = respostaDesenho ? respostaDesenho.ConteudoDesenhoId : 0;

    self.opcaoId = null;
}

function ConteudoDesenho(conteudoDesenho) {
    console.log("conteudoDesenho", conteudoDesenho);
    var self = this;
    self.id = conteudoDesenho ? conteudoDesenho.Id : 0;
    self.tipo = conteudoDesenho ? conteudoDesenho.Tipo : 0;
    self.texto = conteudoDesenho ? conteudoDesenho.Texto : "";
    self.valor = conteudoDesenho ? conteudoDesenho.Valor : 0;
    self.sequencia = conteudoDesenho ? conteudoDesenho.Sequencia : 0;
    self.obrigatorio = conteudoDesenho ? conteudoDesenho.Obrigatorio : 0;

    self.resposta = new RespostaDesenho({ ConteudoDesenhoId: self.id });

    self.opcoes = [];
    self.respostas = [];

    if (conteudoDesenho) {
        if (conteudoDesenho.Opcoes){
            conteudoDesenho.Opcoes.sort(function(a, b){
                if(a.Id < b.Id) return -1;
                if(a.Id > b.Id) return 1;
                return 0;
            });
            conteudoDesenho.Opcoes.forEach(function (opcao) {
                self.opcoes.push(new Opcao(opcao));
            })
        }

        if (conteudoDesenho.Tipo == TipoConteudo.MultiplasRespostas) {
            for (var i = 0; i < conteudo.Valor; i++) {
                self.opcoes.push(new Opcao({ ConteudoDesenhoId: self.id }));
            }
        }
    }

    self.conteudoId = conteudoDesenho ? conteudoDesenho.ConteudoId : 0;

    self.adicionarOpcao = function () {
        self.opcoes.push(new Opcao({ ConteudoDesenhoId: self.id, Valor: 0 }));
    }
    self.removerOpcao = function (index) {
        self.opcoes.splice(index, 1);
    }

    self.salvar = function (conteudoId) {
        self.conteudoId = conteudoId;
        App.$http.post(urlSalvarConteudoDesenho, { conteudo: this }).then(response => {
            var result = response.body;
            console.log(response.body);
            var conteudoId = response.body.Id;
            if (self.id == 0) {
                self.id = conteudoId;
            }
            conteudoId = self.id;
            self.opcoes.forEach(function (opcao, index) {
                opcao.conteudoId = conteudoId;
                opcao.id = response.body.Ids[index];
            })

            App.conteudoDesenhoEditando = -1;
        }, response => {
            // error callback
        });
    }

    self.isValido = function () {
        console.log(self.obrigatorio, self.tipo, self.sequencia);
        if (self.obrigatorio) {
            switch (self.tipo) {
                case TipoConteudo.CaixaConfirmacao:
                    return self.resposta.marcado;
                case TipoConteudo.CaixaSelecao:
                    return self.resposta.opcoesView.length > 0;
                case TipoConteudo.ListaSuspensa:
                    return self.resposta.opcaoId != null;
                case TipoConteudo.MultiplaEscolha:
                    return self.resposta.opcaoId != null;
                case TipoConteudo.RespostaCurta:
                    return self.resposta.texto != "";
                case TipoConteudo.RespostaLonga:
                    return self.resposta.texto != "";
                case TipoConteudo.RespostaNumerica:
                    return self.resposta.texto != "";
                case TipoConteudo.FerramentaDesenho:
                    return self.resposta.desenhos.length > 0;
                case TipoConteudo.Data:
                    return self.resposta.texto != "";
            }
        }
        else
            return true;
    }
}

function OpcaoResposta(opcaoResposta) {
    console.log("Adicionando opcaoResposta");
    var self = this;
    self.id = opcaoResposta ? opcaoResposta.Id :  0;
    self.valor = opcaoResposta ? opcaoResposta.Valor : 0;

    self.respostaId = opcaoResposta ? opcaoResposta.RespostaId : 0;;
    self.opcaoId = opcaoResposta ? opcaoResposta.OpcaoId : 0;;
}

function Resposta(resposta) {
    console.log("Adicionando resposta");
    var self = this;
    self.id = resposta ? resposta.Id : 0;
    self.texto = resposta ? (resposta.Texto ? resposta.Texto : "") : "";
    self.valor = resposta ? (resposta.Valor ? resposta.Valor : null) : null;
    self.marcado = resposta ? (resposta.Marcado ? resposta.Marcado : false) : false;

    self.opcoesView = [];
    self.opcoes = [];
    self.desenhos = [];
    if (resposta && resposta.Opcoes) {
        resposta.Opcoes.forEach(function (opcao) {
            self.opcoes.push(new Opcao(opcao));
        })
    }

    self.conteudoId = resposta ? resposta.ConteudoId : 0;

    self.opcaoId = null;
}

function RestricaoConteudoPagina(restricaoConteudoPagina) {
    console.log("Adicionando restricaoConteudoPagina");
    var self = this;
    self.id = restricaoConteudoPagina ? restricaoConteudoPagina.Id : 0;
    self.nome = restricaoConteudoPagina ? restricaoConteudoPagina.Nome : "";

    self.restricaoPaginaId = restricaoConteudoPagina ? restricaoConteudoPagina.RestricaoPaginaId : 0;
    //self.paginaId = restricaoConteudoPagina ? restricaoConteudoPagina.PaginaId : 0;
    self.conteudoId = restricaoConteudoPagina ? restricaoConteudoPagina.ConteudoId : 0;
    self.conteudoIndex = 0;
    self.opcaoId = restricaoConteudoPagina ? restricaoConteudoPagina.OpcaoId : 0;

    self.adicionarConteudoIndex = function(conteudos) {
        conteudos.forEach(function (e, i, a) {
            if (e.id == self.conteudoId) {
                self.conteudoIndex = i;
            }
        })
    }
}

function RestricaoConteudo(restricaoConteudo) {
    console.log("Adicionando restricaoConteudo");
    var self = this;
    self.id = restricaoConteudo ? restricaoConteudo.Id : 0;
    self.nome = restricaoConteudo ? restricaoConteudo.Nome : "";

    self.conteudoId = restricaoConteudo ? restricaoConteudo.ConteudoId : 0;
    self.paginaAlvoId = restricaoConteudo ? restricaoConteudo.PaginaAlvoId : 0;
    self.paginaIndex = -1;
    self.conteudoAlvoId = restricaoConteudo ? restricaoConteudo.ConteudoAlvoId : 0;
    self.conteudoIndex = -1;
    self.opcaoAlvoId = restricaoConteudo ? restricaoConteudo.OpcaoAlvoId : 0;
    
    self.adicionarPaginaIndex = function (paginas) {
        console.log("paginaAlvoId", self.paginaAlvoId);
        paginas.forEach(function (e, i, a) {
            if (e.id == self.paginaAlvoId) {
                self.paginaIndex = i;
            }
        })
        console.log("paginaIndex", self.paginaIndex);
    }
    self.adicionarConteudoIndex = function (conteudos) {
        console.log("conteudoAlvoId", self.conteudoAlvoId);
        if (self.conteudoAlvoId != 0) {
            conteudos.forEach(function (e, i, a) {
                if (e.id == self.conteudoAlvoId) {
                    self.conteudoIndex = i;
                }
            })
            console.log("conteudoIndex", self.conteudoIndex);
        }
    }
}

function RestricaoPagina(restricaoPagina) {
    console.log("Adicionando restricaoPagina");
    var self = this;
    self.id = restricaoPagina ? restricaoPagina.Id : 0;
    self.nome = restricaoPagina ? restricaoPagina.Nome : "";

    self.restricoesConteudosPagina = [];
    if (restricaoPagina && restricaoPagina.RestricoesConteudosPagina) {
        restricaoPagina.RestricoesConteudosPagina.forEach(function (restricaoConteudoPagina) {
            self.restricoesConteudosPagina.push(new RestricaoConteudoPagina(restricaoConteudoPagina));
        })
    }

    self.paginaId = restricaoPagina ? restricaoPagina.PaginaId : 0;
    self.proximaPaginaId = restricaoPagina ? restricaoPagina.ProximaPaginaId : 0;

    self.adicionarConteudo = function(){
        console.log("asd");
        self.restricoesConteudosPagina.push(new RestricaoConteudoPagina());
    }
    self.removerConteudo = function(index){
        self.restricoesConteudosPagina.splice(index, 1);
    }
}

function Formulario(formulario) {
    console.log("Adicionando formulario");
    var self = this;
    self.id = formulario ? formulario.Id : 0;
    self.nome = formulario ? formulario.Nome : "";

    self.paginas = [];
    if (formulario && formulario.Paginas) {
        formulario.Paginas.forEach(function (pagina) {
            self.paginas.push(new Pagina(pagina));
        })
    }

    self.removerPagina = function (index) {
        console.log(index, App.paginaAtual);
        if (App.paginaAtual > 0)
            App.paginaAtual = App.paginaAtual - 1;
        //else
        //    App.paginaAtual = App.paginaAtual + 1;
        console.log(index, App.paginaAtual);
        self.paginas.splice(index, 1);
    }
}

function Pagina(pagina) {
    console.log("Adicionando pagina");
    var self = this;
    self.id = pagina ? pagina.Id : 0;
    self.titulo = pagina ? pagina.Titulo : "Meu Título";
    self.dimensao = pagina ? pagina.Dimensao : 0;
    self.final = pagina ? pagina.Final : false;
    self.sequencia = pagina ? pagina.Sequencia : 0;

    self.paginaAnterior = 0;
    
    self.conteudos = [];
    self.restricoes = [];
    if (pagina) {
        pagina.Conteudos.sort(function (a, b) {
            if (a.Sequencia > b.Sequencia) {
                return 1;
            }
            if (a.Sequencia < b.Sequencia) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        if (pagina.Conteudos)
            pagina.Conteudos.forEach(function (conteudo) {
                self.conteudos.push(new Conteudo(conteudo));
            })
        if (pagina.Restricoes)
            pagina.Restricoes.forEach(function (restricao) {
                self.restricoes.push(new RestricaoPagina(restricao));
            })
    }

    self.formularioId = pagina ? pagina.FormularioId : 0;
    self.proximaPaginaId = pagina ? pagina.ProximaPaginaId : null;

    self.latitude = pagina ? pagina.Latitude : 0;
    self.longitude = pagina ? pagina.Longitude : 0;
    self.zoomLevel = pagina ? pagina.ZoomLevel : 0;
    
    self.removerConteudo = function(index){
        self.conteudos.splice(index, 1);
    }

    self.adicionarRestricao = function(){
        var restricao = new RestricaoPagina();
        restricao.paginaId = self.id;
        restricao.adicionarConteudo();
        self.restricoes.push(restricao);
    }
    self.removerRestricao = function (index) {
        self.restricoes.splice(index, 1);
    }
}

function Conteudo(conteudo) {
    console.log("Adicionando conteudo", conteudo);
    var self = this;
    self.id = conteudo ? conteudo.Id : 0;
    self.tipo = conteudo ? conteudo.Tipo : 0;
    self.texto = conteudo ? conteudo.Texto : "";
    self.valor = conteudo ? conteudo.Valor : 0;
    self.sequencia = conteudo ? conteudo.Sequencia : 0;
    self.obrigatorio = conteudo ? conteudo.Obrigatorio : 0;
    self.tituloConteudosDesenho = conteudo ? conteudo.TituloConteudosDesenho : "";
    self.mensagemNovoDesenho = conteudo ? conteudo.MensagemNovoDesenho : "";
    self.pergunta = "";//asdsjndskfdk

    self.resposta = new Resposta({ ConteudoId: self.id });
    self.restricoesValidas = true;
    self.isValido = true;
    self.indexOpcao = 0;
    
    self.opcoes = [];
    self.restricoes = [];
    self.respostas = [];
    self.conteudosDesenhos = [];
    if (conteudo) {
        if (conteudo.Opcoes){
            conteudo.Opcoes.sort(function(a, b){
                if(a.Id < b.Id) return -1;
                if(a.Id > b.Id) return 1;
                return 0;
            });
            conteudo.Opcoes.forEach(function (opcao) {
                self.opcoes.push(new Opcao(opcao));
            })
        }
        if (conteudo.Restricoes.length)
            conteudo.Restricoes.forEach(function (restricao) {
                self.restricoes.push(new RestricaoConteudo(restricao));
            })
        conteudo.ConteudosDesenhos.sort(function (a, b) {
            if (a.Sequencia > b.Sequencia) {
                return 1;
            }
            if (a.Sequencia < b.Sequencia) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        if (conteudo.ConteudosDesenhos.length)
            conteudo.ConteudosDesenhos.forEach(function (conteudoDesenho) {
                self.conteudosDesenhos.push(new ConteudoDesenho(conteudoDesenho));
            })
        //if (conteudo.Respostas)
        //    conteudo.Respostas.forEach(function (resposta) {
        //        self.respostas.push(new Resposta(resposta));
        //    })

        console.log("dsjfksdsdhbfb sjbdf fh bsdhbdfh fsf dbsd fbsd bfhbhh", conteudo.Tipo);
        if (conteudo.Tipo == TipoConteudo.MultiplasRespostas) {
            for (var i = 0; i < conteudo.Valor; i++) {
                self.opcoes.push(new Opcao({ ConteudoId: self.id }));
            }
        }
    }

    self.paginaId = conteudo ? conteudo.PaginaId : 0;

    self.adicionarOpcao = function () {
        self.opcoes.push(new Opcao({ ConteudoId: self.id, Valor: 0}));
    }
    self.removerOpcao = function(index){
        self.opcoes.splice(index, 1);
    }
    self.abrirModalRestricao = function(){
        // $("#modalRestricao").modal('show');
        console.log("Abrindo");
    }

    self.adicionarRestricao = function () {
        var restricao = new RestricaoConteudo();
        restricao.conteudoId = self.id;
        self.restricoes.push(restricao);
    }
    self.ver = function(){
        console.log(self.restricoes.length);
        if(self.restricoes.length > 0){
            var json = JSON.stringify(self.restricoes);
            console.log("rest", json);
        }
    }

    self.desenhando = false;
    self.desenhar = function () {
        App.tentouPassarDesenho = false;
        console.log("desenhar", self.valor)
        //App.esconderFormulario();
        // self.desenhando = true;
        initMap("map" + self.id);

        if(self.valor == 1)
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        else if (self.valor == 2)
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
            //drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        else if (self.valor == 3)
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
            //drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        else if (self.valor == 4)
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);

        if(self.valor == 2 || self.valor == 4)
            self.avancarProximo();
    }

    self.avancarProximo = function(){
        console.log("avancarProximo");
        if(App.conteudoSelecionado < App.formulario.paginas[App.paginaAtual].conteudos.length - 1){
            App.conteudoSelecionado += 1;
            console.log(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].texto);

            while(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].restricoesValidas == false && App.conteudoSelecionado < App.formulario.paginas[App.paginaAtual].conteudos.length - 1){
                App.conteudoSelecionado += 1;
                console.log(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].texto);
            }
            console.log(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].texto);
            if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].restricoesValidas == false){
                App.avancarProximaPagina();
                App.mostrarFormulario();
            }
            else{
                console.log("valor", self.valor, App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor);
                if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 1)
                    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                else if (App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 2)
                    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                else if (App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 3)
                    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                else if (App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 4){
                    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
                    eventoClick();
                }
            }
        }
        else{
            App.avancarProximaPagina();
            App.mostrarFormulario();
        }
        App.indexOverlayPodeExcluir = overlaysLength();
    }

    self.novoDesenho = function (novoDesenho) {
        console.log("novoDesenho", novoDesenho);
        if (novoDesenho) {
            $('#modalVerificarNovoDesenho').modal('hide');
            self.desenhar();
        }
        else {
            $('#modalVerificarNovoDesenho').modal('hide');
            console.log("Escolheu não");
            App.mostrarFormulario();
            if(self.valor == 1){
                console.log("verificando");
                var flag = true;
                App.formulario.paginas[App.paginaDesenho].conteudos.forEach(function(conteudo){
                    conteudo.restricoes.forEach(function(restricao){
                        if(restricao.conteudoAlvoId == self.id && conteudo.id != self.id)
                            flag = false;
                    })
                })
                if(flag){
                    App.avancarProximaPagina();
                }
            }
        }
    }
    self.verificarConteudosDesenho = function(){
        console.log("verificarConteudosDesenho");
        var restricoesValidas = true;
        App.tentouPassarDesenho = true;
        self.conteudosDesenhos.forEach(function (conteudo) {
            if(restricoesValidas){
                restricoesValidas = conteudo.isValido();
            }
        })
        console.log("restricoesValidas", restricoesValidas);
        return restricoesValidas;
    }
    self.verificarConteudosDesenhos = function(){
        console.log("verificarConteudosDesenho");
        var restricoesValidas = true;
        App.tentouPassarDesenho = true;
        App.formulario.paginas[App.paginaAtual].conteudos[App.indexConteudoModal].conteudosDesenhos.forEach(function (conteudo) {
            if(restricoesValidas){
                restricoesValidas = conteudo.isValido();
            }
        })
        console.log("restricoesValidas", restricoesValidas);
        return restricoesValidas;
    }
    self.salvarRespostasDesenho = function () {
        if(self.verificarConteudosDesenho() == false){
            toastr.error('Por favor, responda as perguntas indicadas.');
            return;
        }
        App.tentouPassarDesenho = false;
        console.log("salvarRespostasDesenho");
        var resposta = [];
        self.conteudosDesenhos.forEach(function (conteudo) {
            console.log("sadasd");
            console.log(conteudo.resposta.texto);
            resposta.push(conteudo.resposta);
            conteudo.resposta = new RespostaDesenho({ ConteudoDesenhoId: conteudo.id });
            console.log(conteudo.resposta.texto);
        })
        App.formulario.paginas[App.paginaDesenho].conteudos[App.conteudoSelecionado].resposta.desenhos[App.desenhoEditando].respostasDesenho = resposta;
        $('#modalConteudoDesenho').modal('hide');

        if (App.editandoDesenho || self.value == 3)
            App.mostrarFormulario();
        else
            $('#modalVerificarNovoDesenho').modal('show');
        //App.mostrarFormulario();
    }
    self.salvarRespostasDesenhos = function () {
        if(self.verificarConteudosDesenhos() == false){
            toastr.error('Por favor, responda as perguntas indicadas.');
            return;
        }
        App.tentouPassarDesenho = false;
        console.log("salvarRespostasDesenhos");
        var resposta = [];
        self.conteudosDesenhos.forEach(function (conteudo) {
            console.log("sadasd");
            console.log(conteudo.resposta.texto);
            resposta.push(conteudo.resposta);
            conteudo.resposta = new RespostaDesenho({ ConteudoDesenhoId: conteudo.id });
            console.log(conteudo.resposta.texto);
        })

        App.formulario.paginas[App.paginaDesenho].conteudos[App.conteudoSelecionado].resposta.desenhos[App.desenhoEditando].respostasDesenho = resposta;
        $('#modalConteudoDesenho').modal('hide');

        //App.mostrarFormulario();
        self.avancarProximo();
    }

    self.isValido = function () {
        console.log(self.obrigatorio, self.tipo, self.sequencia);
        if (self.obrigatorio) {
            switch (self.tipo) {
                case TipoConteudo.CaixaConfirmacao:
                    return self.resposta.marcado;
                case TipoConteudo.CaixaSelecao:
                    return self.resposta.opcoesView.length > 0;
                case TipoConteudo.ListaSuspensa:
                    return self.resposta.opcaoId != null;
                case TipoConteudo.MultiplaEscolha:
                    return self.resposta.opcaoId != null;
                case TipoConteudo.RespostaCurta:
                    return self.resposta.texto != "";
                case TipoConteudo.RespostaLonga:
                    return self.resposta.texto != "";
                case TipoConteudo.RespostaNumerica:
                    return self.resposta.texto != "";
                case TipoConteudo.FerramentaDesenho:
                    return self.resposta.desenhos.length > 0;
                case TipoConteudo.Data:
                    var data = moment(self.resposta.texto);
                    return data.isValid() && data.diff(moment(), 'years', true) <= -18;
                case TipoConteudo.Email:
                    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    return regex.test(self.resposta.texto);
            }
        }
        else
            return true;
    }
}

function Opcao(opcao) {
    console.log("Adicionando opcao");
    var self = this;
    self.id = opcao ? opcao.Id : 0;
    self.texto = opcao ? opcao.Texto : "";
    self.valor = opcao ? opcao.Valor : 0;

    self.opcoesResposta = [];
    if (opcao && opcao.OpcoesResposta) {
        opcao.OpcoesResposta.forEach(function (opcaoResposta) {
            self.opcoesResposta.push(new OpcaoResposta(opcaoResposta));
        })
    }

    self.conteudoId = opcao ? opcao.ConteudoId : 0;
}

function Respondente(respondente) {
    console.log("Adicionando Respondente");
    var self = this;
    self.id = respondente ? respondente.Id : 0;
    self.email = respondente ? respondente.Email : "";
    self.duracao = respondente ? respondente.Duracao : 0;

    self.respostas = [];
}

var data = { 
    options: [
        { value: 1, text: 'Múltipla Escolha' },
        { value: 2, text: 'Caixa de Seleção' },
        { value: 3, text: 'Lista Suspensa' },
        { value: 4, text: 'Escala' },
        // { value: 5, text: 'Escala Linear/Rating' },
        { value: 6, text: 'Divisão de valores' },
        { value: 7, text: 'Resposta curta' },
        { value: 8, text: 'Resposta longa' },
        { value: 9, text: 'Descrição' },
        { value: 10, text: 'Cabeçalho' },
        { value: 11, text: 'Ferramenta de Desenho' }
    ],
    selecionado: 0,
    formulario: new Formulario(formularioModel),
    respondente: new Respondente(),
    paginaAtual: 0,
    conteudoEditando: -1,
    editando: [],
    editandoTitulo: false,
    adicionandoConteudo: false,
    paginasRespondidas: [],
    conteudoDesenhoEditando: -1,
    conteudoSelecionado: 0,
    desenhoEditando: -1,
    editandoDesenho: false,
    paginaDesenho: -1,
    inicio: null,
    minPage: false,
    tentouPassar: false,
    tentouPassarDesenho: false,
    indexConteudoModal: -1,
    selecionandoDesenhoExcluir: false,
    indexOverlayPodeExcluir: -1,
    conteudosExibir : 1
};

window.App = new Vue({ 
    el: '#cadastro', 
    data: data,
    created: function () {
        this.formulario.paginas.forEach(function (pagina) {
            pagina.conteudos.forEach(function (conteudo) {
                conteudo.resposta.conteudoId = conteudo.id;
                if (conteudo.tipo == TipoConteudo.MultiplaEscolha)
                    conteudo.resposta.opcoes.push(new Opcao());
                if (conteudo.tipo == TipoConteudo.Escala)
                    conteudo.resposta.valor = conteudo.valor;

                //if (conteudo.tipo == 6)
                //    conteudo.opcoes.forEach(function (opcao) {
                //        conteudo.resposta.opcoes.push(new OpcaoResposta({ Valor: opcao.valor }));
                //    })
            })
        })
        this.inicio = new Date();
        this.verificarConteudos();
    },
    //mounted: function () {
    //    console.log("iniciou 12", this.formulario.id);
    //},
    methods: {
        addPagina: function () {
            var pagina = new Pagina();
            pagina.formularioId = this.formulario.id;
            this.formulario.paginas.push(pagina);
            console.log(this.formulario.paginas.length);
            this.paginaAtual = this.formulario.paginas.length - 1;
        },
        editarConteudo: function(index){
            console.log(index);
            this.conteudoEditando = index;
            this.adicionandoConteudo = false;
            //console.log("index", this.pagina.conteudos[index]);
        },
        hoverConteudo: function(index){
            console.log(index);
            // this.editando[index] = !this.editando[index];
            Vue.set(this.editando, index, !this.editando[index])
            // vm.items.splice(indexOfItem, 1, newValue)
        },
        selecionarTipoConteudo: function(index){
            this.selecionado = index;
            var conteudo = new Conteudo();
            conteudo.tipo = index;
            if (index == TipoConteudo.MultiplaEscolha) {
                //conteudo.pergunta = "Insira a pergunta";
                conteudo.opcoes.push(new Opcao());
                conteudo.opcoes.push(new Opcao());
            }
            if (index == TipoConteudo.CaixaSelecao) {
                //conteudo.pergunta = "Insira a pergunta";
                conteudo.opcoes.push(new Opcao());
                conteudo.opcoes.push(new Opcao());
            }
            else if (index == TipoConteudo.ListaSuspensa) {
                //conteudo.pergunta = "Insira a pergunta";
                conteudo.opcoes.push(new Opcao());
                conteudo.opcoes.push(new Opcao());
            }
            else if (index == TipoConteudo.Escala) {
                //conteudo.pergunta = "Insira a pergunta";
                conteudo.valor = 50;
                conteudo.opcoes.push(new Opcao({ Texto: "Menor" }));
                conteudo.opcoes.push(new Opcao({ Texto: "Maior" }));
            }
            else if (index == TipoConteudo.DivisaoValores) {
                //conteudo.pergunta = "Insira a pergunta";
                conteudo.opcoes.push(new Opcao({ Texto: "", Valor: 0 }));
            }
            else if (index == TipoConteudo.RespostaCurta) {
                //conteudo.pergunta = "Insira a pergunta";
            }
            else if (index == TipoConteudo.RespostaLonga) {
                //conteudo.pergunta = "Insira a pergunta";
            }
            else if (index == TipoConteudo.Descricao) {
                //conteudo.pergunta = "Insira a pergunta";
            }
            else if (index == TipoConteudo.Cabecalho) {
                //conteudo.pergunta = "Insira a pergunta";
            }
            this.formulario.paginas[this.paginaAtual].conteudos.push(conteudo);
            this.conteudoEditando = this.formulario.paginas[this.paginaAtual].conteudos.length - 1;
        },
        avancarProximaPagina: function () {
            console.log("avancarProximaPagina");
            var self = this;
            console.log(self.conteudosExibir, self.formulario.paginas[self.paginaAtual].conteudos.length);
            if(self.formulario.paginas[self.paginaAtual].dimensao == 2){
                if(self.conteudosExibir < self.formulario.paginas[self.paginaAtual].conteudos.length - 1){
                    self.conteudosExibir += 2;
                    $("#next").blur();
                    return;
                }
            }
            self.tentouPassar = true;
            var conteudosValidos = true;
            self.conteudosExibir = 1;
            self.formulario.paginas[self.paginaAtual].conteudos.forEach(function (conteudo) {
                console.log(conteudo.isValido());
                if (conteudo.isValido() == false) {
                    conteudosValidos = false;
                    console.log(conteudosValidos);
                }
            })
            if (conteudosValidos) {
                var proximaPaginaId = this.formulario.paginas[this.paginaAtual].proximaPaginaId;
                var proximaPagina = 0;
                this.formulario.paginas.forEach(function (pagina, index) {
                    if (pagina.id == proximaPaginaId)
                        proximaPagina = index;
                })
                if (this.formulario.paginas[this.paginaAtual].restricoes.length > 0) {
                    //var conteudos = this.formulario.paginas[this.paginaAtual].conteudos;
                    console.log(this.formulario);
                    var self = this;
                    this.formulario.paginas[this.paginaAtual].restricoes.forEach(function (restricao) {
                        var condicoesSatisfeitas = true;
                        restricao.restricoesConteudosPagina.forEach(function (rcp) {
                            self.formulario.paginas[self.paginaAtual].conteudos.forEach(function (conteudo) {
                                if (conteudo.tipo == 1 || conteudo.tipo == 3)
                                    if (conteudo.id == rcp.conteudoId) {
                                        if (conteudo.resposta.opcaoId != rcp.opcaoId)
                                            condicoesSatisfeitas = false;
                                    }
                            })
                        })
                        if (condicoesSatisfeitas == true) {
                            self.formulario.paginas.forEach(function (pagina, index) {
                                if (pagina.id == restricao.proximaPaginaId) {
                                    proximaPagina = index;
                                }
                            })
                        }
                        console.log("condicoesSatisfeitas", condicoesSatisfeitas);
                        console.log("proximaPagina", proximaPagina);
                    })
                }

                //retirando eventos do map
                var gmDomHackSelect = $('.gm-style').children().eq(0);
                gmDomHackSelect.off();
                possuiEvento = false;

                console.log("Configurando próxima página");
                self.tentouPassar = false;
                self.paginasRespondidas.push(proximaPagina);
                var paginaAnterior = this.paginaAtual;
                this.paginaAtual = proximaPagina;
                this.formulario.paginas[this.paginaAtual].paginaAnterior = paginaAnterior;
                $("#formulario").scrollTop(0, 0)

                this.verificarConteudos();
                if (this.formulario.paginas[this.paginaAtual].zoomLevel != 0) {
                    map.setZoom(parseInt(this.formulario.paginas[this.paginaAtual].zoomLevel));
                    var latlng = new google.maps.LatLng(parseFloat(this.formulario.paginas[this.paginaAtual].latitude), parseFloat(this.formulario.paginas[this.paginaAtual].longitude));
                    map.panTo(latlng);
                    //map.setCenter({ lat: this.formulario.paginas[this.paginaAtual].latitude, lng: this.formulario.paginas[this.paginaAtual].longitude });
                }
            }
            else {
                toastr.error('Por favor, responda as perguntas indicadas.')
            }
            self.conteudosExibir = self.formulario.paginas[self.paginaAtual].conteudos.length % 2 == 0 ? 1 : 2;
            $("#next").blur();
        },
        voltarPaginaAnterior: function () {
            var self = this;
            console.log(self.conteudosExibir, self.formulario.paginas[self.paginaAtual].conteudos.length);
            if(self.formulario.paginas[self.paginaAtual].dimensao == 2){
                if(self.conteudosExibir > 2){
                    self.conteudosExibir -= 2;
                    $("#previous").blur();
                    return;
                }
            }
            this.paginaAtual = this.formulario.paginas[this.paginaAtual].paginaAnterior;
            this.paginasRespondidas.pop();
            this.verificarConteudos();
            if (this.formulario.paginas[this.paginaAtual].zoomLevel != 0) {
                map.setZoom(parseInt(this.formulario.paginas[this.paginaAtual].zoomLevel));
                var latlng = new google.maps.LatLng(parseFloat(this.formulario.paginas[this.paginaAtual].latitude), parseFloat(this.formulario.paginas[this.paginaAtual].longitude));
                map.panTo(latlng);
                //map.setCenter({ lat: this.formulario.paginas[this.paginaAtual].latitude, lng: this.formulario.paginas[this.paginaAtual].longitude });
            }
            $("#previous").blur();
        },
        verificarConteudos: function () {
            console.log("Verificando conteudos");
            var self = this;
            this.formulario.paginas[this.paginaAtual].conteudos.forEach(function (conteudo, index) {
                var restricoesValidas = true;
                conteudo.restricoes.forEach(function (restricao) {
                    if (restricao.paginaIndex == -1) {
                        self.formulario.paginas.forEach(function (pagina, indexP) {
                            if (restricao.paginaAlvoId == pagina.id) {
                                restricao.paginaIndex = indexP;
                                pagina.conteudos.forEach(function (cont, indexC) {
                                    if (restricao.conteudoAlvoId == cont.id)
                                        restricao.conteudoIndex = indexC;
                                })
                            }
                        })
                    }
                    console.log(self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcaoId);
                    console.log(restricao.opcaoAlvoId);
                    console.log(conteudo.id, self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].tipo);
                    if (restricoesValidas) {
                        if (self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].tipo == TipoConteudo.CaixaSelecao) {
                            //super armengue
                            if(conteudo.tipo == TipoConteudo.FerramentaDesenho && conteudo.valor == 2 && index == 1){
                                restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcoesView.length > 0;
                            }
                            else if(conteudo.tipo == TipoConteudo.Escala)
                                restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcoesView.length > 0;
                            else
                                restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcoesView.includes(restricao.opcaoAlvoId);
                        }
                        else if (self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].tipo == TipoConteudo.FerramentaDesenho) {
                            if(conteudo.id == self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].id)
                                restricoesValidas = conteudo.resposta.desenhos.length == 0;
                            else
                                restricoesValidas = (self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.desenhos.length > 0) || (self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].restricoesValidas == false);
                        }
                        else if(self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].tipo == TipoConteudo.CaixaConfirmacao){
                            restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.marcado;
                        }
                        else{
                            if(self.formulario.paginas[restricao.paginaIndex].dimensao == 2)
                                restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcaoId != null && self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcaoId != restricao.opcaoAlvoId;
                            else
                                restricoesValidas = self.formulario.paginas[restricao.paginaIndex].conteudos[restricao.conteudoIndex].resposta.opcaoId == restricao.opcaoAlvoId;
                        }
                    }
                })
                conteudo.restricoesValidas = restricoesValidas;

                if (conteudo.tipo == TipoConteudo.DivisaoValores) {
                    var soma = 0;
                    conteudo.opcoes.forEach(function (opcao) {
                        soma = soma + opcao.valor;
                    })
                    if (soma > 100 && conteudo.opcoes.length > 0) {
                        var flag = true;
                        conteudo.opcoes.forEach(function (opcao) {
                            if (flag && opcao.valor > 0) {
                                opcao.valor -= 1;
                                soma -= 1;
                                flag = false;
                            }
                        })
                    }

                    conteudo.valor = soma;
                }

                if (conteudo.tipo == TipoConteudo.FerramentaDesenho) {
                    conteudo.conteudosDesenhos.forEach(function (conteudoDesenho) {
                        if (conteudoDesenho.tipo == TipoConteudo.DivisaoValores) {
                            var soma = 0;
                            conteudoDesenho.opcoes.forEach(function (opcao) {
                                soma = soma + opcao.valor;
                            })
                            if (soma > 100 && conteudoDesenho.opcoes.length > 0) {
                                var flag = true;
                                conteudoDesenho.opcoes.forEach(function (opcao) {
                                    if (flag && opcao.valor > 0) {
                                        opcao.valor -= 1;
                                        soma -= 1;
                                        flag = false;
                                    }
                                })
                            }

                            conteudoDesenho.valor = soma;
                        }
                    })
                }
            })
        },
        obterFormulario: function () {
            //this.$http.get(urlObterFormularioParaEditar, { params: { foo: 'bar' }, headers: { 'X-Custom': '...' } }).then(response => {
            this.$http.get(urlObterFormularioParaEditar).then(response => {

                // get body data
                this.formulario = response.body;
                console.log(response);

            }, response => {
                console.log("Erro");
                // error callback
            });
        },
        salvarFormulario: function () {
            this.formulario.nome = "Meu formulário";
            var data = JSON.stringify({ Formulario: this.formulario });
            console.log(data);
            this.$http.post(urlSalvarFormulario, { formulario: this.formulario }).then(response => {
                // get status
                response.status;

                // get status text
                response.statusText;

                // get 'Expires' header
                response.headers.get('Expires');

                // get body data
                console.log(response.body);
                var result = response.body;
                var formularioId = response.body.Id;
                this.formulario.id = formularioId;
                //Não precisa mais
                //this.formulario.paginas.forEach(function (pagina) {
                //    pagina.formularioId = formularioId;
                //})

            }, response => {
                // error callback
            });
        },
        salvarPagina: function () {
            this.$http.post(urlSalvarPagina, { pagina: this.formulario.paginas[this.paginaAtual] }).then(response => {
                var result = response.body;
                console.log(response.body);
                var paginaId = response.body.Id;
                if (this.formulario.paginas[this.paginaAtual].id == 0) {
                    this.formulario.paginas[this.paginaAtual].id = paginaId;
                    //this.formulario.paginas[this.paginaAtual].conteudos.forEach(function (conteudo) {
                    //    conteudo.paginaId = paginaId;
                    //})
                }

                //Não precisa mais
                //paginaId = this.formulario.paginas[this.paginaAtual].id;
                //this.formulario.paginas[this.paginaAtual].restricoes.forEach(function (restricao) {
                //    restricao.paginaId = paginaId;
                //})

                if ($('#configuracoesPagina').hasClass('show'))
                    $("#configuracoesPagina").modal('hide');
            }, response => {
                // error callback
            });
        },
        salvarConfiguracaoPagina: function () {
            this.$http.post(urlSalvarConfiguracaoPagina, { pagina: this.formulario.paginas[this.paginaAtual] }).then(response => {
                var result = response.body;
                console.log(response.body);
                var paginaId = response.body.Id;
                if (this.formulario.paginas[this.paginaAtual].id == 0) {
                    this.formulario.paginas[this.paginaAtual].id = paginaId;
                    //this.formulario.paginas[this.paginaAtual].conteudos.forEach(function (conteudo) {
                    //    conteudo.paginaId = paginaId;
                    //})
                }
                paginaId = this.formulario.paginas[this.paginaAtual].id;
                this.formulario.paginas[this.paginaAtual].restricoes.forEach(function (restricao) {
                    restricao.paginaId = paginaId;
                })

                if ($('#configuracoesPagina').hasClass('show'))
                    $("#configuracoesPagina").modal('hide');
            }, response => {
                // error callback
            });
        },
        salvarConteudo: function () {
            console.log("salvandoConteudo", this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando]);
            this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].paginaId = this.formulario.paginas[this.paginaAtual].id;
            this.$http.post(urlSalvarConteudo, { conteudo: this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando] }).then(response => {
                var result = response.body;
                console.log(response.body);
                var conteudoId = response.body.Id;
                if (this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].id == 0) {
                    this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].id = conteudoId;
                }
                conteudoId = this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].id;
                this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].opcoes.forEach(function (opcao, index) {
                    opcao.conteudoId = conteudoId;
                    opcao.id = response.body.Ids[index];
                })
                this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoEditando].restricoes.forEach(function (restricao, index) {
                    restricao.conteudoId = conteudoId;
                    restricao.id = response.body.Ids2[index];
                    console.log("--------------", restricao.id);
                })

                this.editarConteudo(-1);
            }, response => {
                // error callback
            });
        },
        finalizarFormulario: function () {
            var self = this;
            var respostas = [];
            this.paginasRespondidas.unshift(0);;
            //this.formulario.paginas.forEach(function (pagina) {
            this.paginasRespondidas.forEach(function (paginaIndex) {
                //pagina.conteudos.forEach(function (conteudo) {
                self.formulario.paginas[paginaIndex].conteudos.forEach(function (conteudo) {
                    if (conteudo.tipo != 9 && conteudo.tipo != 10) {
                        if (conteudo.tipo == TipoConteudo.CaixaSelecao) {
                            conteudo.resposta.opcoesView.forEach(function (opcao) {
                                conteudo.resposta.opcoes.push(new OpcaoResposta({ OpcaoId: parseInt(opcao) }));
                            })
                        }
                        if (conteudo.tipo == TipoConteudo.DivisaoValores) {
                            conteudo.opcoes.forEach(function (opcao) {
                                conteudo.resposta.opcoes.push(new OpcaoResposta({ Valor: opcao.valor }));
                            })
                        }
                        if (conteudo.resposta.desenhos.length > 0) {

                        }

                        respostas.push(conteudo.resposta);
                    }
                })
            })
            console.log(respostas);
            this.respondente.respostas = respostas;
            //this.respondente.duracao = new Date().getTime() - this.respondente.duracao;
            // this.$http.post(urlFinalizarFormulario, JSON.stringify({ respondente: this.respondente, inicio: this.inicio, fim: new Date() })).then(response => {
            //     var result = response.body;
            //     console.log(response.body);

            //     //self.paginaAtual = self.formulario.paginas.length - 1;
            //     self.avancarProximaPagina();
            //     self.verificarConteudos();
            // }, response => {
            //     // error callback
            // });
            self.avancarProximaPagina();
            self.verificarConteudos();
        },
        abrirConteudosDesenho: function (desenho) {
            this.paginaDesenho = this.paginaAtual;
            console.log("abrirConteudosDesenho");
            //this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].conteudosDesenhos.forEach(function (conteudo) {
            //    desenho.respostasDesenho.push(new RespostaDesenho());
            //})
            console.log(desenho.overlay);
            desenho.overlay = null;
            this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].resposta.desenhos.push(desenho);
            this.desenhoEditando = this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].resposta.desenhos.length - 1;
            this.editandoDesenho = false;
            if(this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor != 2 && this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor != 4){
                $("#defineLocalizacao").hide();
                $("#boxLocalizacao").hide();
            }

            // var qtd = 0;
            // App.formulario.paginas[App.paginaAtual].conteudos.forEach(function (c) {
            //     if (c.tipo == 11)
            //         qtd++;
            // })

            //super armengue
            if(this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 2 || this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 4){
                App.indexConteudoModal = 1;
            }
            else
                App.indexConteudoModal = App.conteudoSelecionado;

            if (this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 1)
                $('#modalConteudoDesenho').modal('show'); 
            else if (this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 3){
                this.mostrarFormulario();
                this.avancarProximaPagina();
                overlays[overlays.length - 1].setOptions({draggable: true, clickable: false});
            }
        },
        abrirConteudosDesenhos: function (desenho) {
            this.paginaDesenho = this.paginaAtual;
            console.log("abrirConteudosDesenho");
            //this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].conteudosDesenhos.forEach(function (conteudo) {
            //    desenho.respostasDesenho.push(new RespostaDesenho());
            //})
                        
            if (this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 2 || this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].valor == 4){
                //super armengue
                App.formulario.paginas[App.paginaAtual].conteudos[App.indexConteudoModal].conteudosDesenhos.forEach(function(c){
                    var id = App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].id;
                    c.resposta = new RespostaDesenho({ ConteudoDesenhoId: id });
                })
                $('#modalConteudoDesenho').modal('show');
            }
        },
        editarDesenho: function (indexPagina, indexConteudo, indexDesenho) {
            this.paginaDesenho = indexPagina;
            console.log("editarDesenho", indexConteudo, indexDesenho);
            console.log("dfsd");
            this.formulario.paginas[indexPagina].conteudos[indexConteudo].resposta.desenhos[indexDesenho].respostasDesenho.forEach(function (resp, index) {
                App.formulario.paginas[indexPagina].conteudos[indexConteudo].conteudosDesenhos[index].resposta = resp;
            })
            this.conteudoSelecionado = indexConteudo;
            this.desenhoEditando = indexDesenho;
            $("#formulario").hide();
            //while (this.paginaAtual != indexPagina) {
            //    if (this.paginaAtual < indexPagina)
            //        this.avancarProximaPagina();
            //    else
            //        this.voltarPaginaAnterior();
            //}
            this.editandoDesenho = true;
            $('#modalConteudoDesenho').modal('show');
        },
        esconderFormulario: function () {
            console.log("esconderFormulario");
            //var elementos = document.getElementById("formulario")
            //elementos.hidden = true;
            $("#formulario").hide();
            //$(".modal-backdrop").hide();
            //$("#map").show();
            this.exibirDefineLocalizacao();
            $("#pac-input").show();
            //var mapaElemento = document.getElementById("map")
            //mapaElemento.hidden = false;
            //if (this.formulario.paginas[this.paginaAtual].zoomLevel != 0) {
            //    var latlng = new google.maps.LatLng(parseFloat(this.formulario.paginas[this.paginaAtual].latitude), parseFloat(this.formulario.paginas[this.paginaAtual].longitude));
            //    map.setCenter(latlng);
            //    //map.setCenter({ lat: this.formulario.paginas[this.paginaAtual].latitude, lng: this.formulario.paginas[this.paginaAtual].longitude });
            //    map.setZoom(parseInt(this.formulario.paginas[this.paginaAtual].zoomLevel));
            //}
        },
        exibirDefineLocalizacao: function () {
            console.log("exibirDefineLocalizacao");
            $("#defineLocalizacao").show();
            if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 2 || App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 4)
                $("#boxLocalizacao").show();
        },
        mostrarFormulario: function () {
            console.log("mostrarFormulario");
            drawingManager.setDrawingMode(null);
            $("#defineLocalizacao").hide();
            $("#boxLocalizacao").hide();
            $("#formulario").show();
            $("#pac-input").hide();
            //$(".modal-backdrop").show();
            //$("#map").hide();
        },
        cancelarDesenho: function () {
            cancelarDesenho = true;
            this.mostrarFormulario();
        },
        excluirDesenho: function () {
            var indexDesenho = this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].resposta.desenhos.length - 1;
            var indexOverlay = this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].resposta.desenhos[indexDesenho].indexOverlay;
            console.log("indexOverlay", indexOverlay-1);
            overlays[indexOverlay - 1].setMap(null);
            this.formulario.paginas[this.paginaAtual].conteudos[this.conteudoSelecionado].resposta.desenhos.splice(indexDesenho, 1);
            
            this.desenhoEditando = -1;
            $('#modalConteudoDesenho').modal('hide');
            App.mostrarFormulario();
        },
        selecionarDesenhoExcluir: function(){
            this.selecionandoDesenhoExcluir = true;
            selecionarDesenhoExcluir();
            comecouDesenharPolyline = false;
        },
        cancelarSelecionarDesenhoExcluir: function(){
            this.selecionandoDesenhoExcluir = false;
            if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 2)
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
            
            if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 4)
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            //selecionarDesenhoExcluir();
            
            comecouDesenharPolyline = true;
            completouDesenho = false;
        },
        minimizarPagina: function () {
            console.log("minimizarPagina");
            this.minPage = !this.minPage;
            $("#minimizarPagina").blur();
        }
    },
    watch: {
        formulario: {
            handler: function (newValue) {
                console.log("Person with ID:" + newValue.id + " modified", newValue);
                this.verificarConteudos();//talvez fazer só da pagina atual
            },
            deep: true
        }
    }
});


//   // Re-init map before show modal
//   $('#modalMapa').on('show.bs.modal', function(event) {
//     console.log("sds");
//     //var button = $(event.relatedTarget);
//     initMap("map");
//     $("#location-map").css("width", "100%");
//     $("#map").css("width", "100%");
//   });

//   // Trigger map resize event after modal shown
//   $('#modalMapa').on('shown.bs.modal', function() {
//     google.maps.event.trigger(map, "resize");
//     map.setCenter(myLatlng);
//   });
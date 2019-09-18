// $slider.slick('slickGoTo', 3);
// $slider.slick('slickNext');
// $slider.slick('slickPrev');
// var currentSlide = $slider.slick('slickCurrentSlide');

var canChange = true;
var errowMessage;
var parametros;
var stack = [];
     
window.onerror = function(msg, url, line, col, error) {
    if (errowMessage === "Erro de validação") {
        errowMessage = undefined;
        canChange = false;
        validaSlide(parametros.slick, parametros.currentSlide, parametros.nextSlide);
        return true;  //  silent the error, and keep functioning as normal
    }
}

function sliderBeforeChange(event, slick, currentSlide, nextSlide){
    console.log("sliderBeforeChange", canChange);
    if(canChange){
        errowMessage = "Erro de validação";
        parametros = {slick: slick, currentSlide: currentSlide, nextSlide: nextSlide};
        throw "";
    }
}

function sliderAfterChange(event, slick, currentSlide, nextSlide){
    canChange = true;
    console.log("sliderBeforeChange", canChange);
}

function validaSlide(slick, currentSlide, nextSlide){
    if(currentSlide > nextSlide){        
        var slideNumber = stack[stack.length - 1];
        stack.pop();
        $slider.slick('slickGoTo', slideNumber);
        return ;
    }

    var exigeValidacao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaNenhum");
    console.log("exigeValidacao", exigeValidacao.length);
    if(exigeValidacao.length){
        var opcao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .form-check > input[name='inlineRadioOptions']:checked").val();
        console.log("opcao", opcao);
        if(opcao == "opcao0"){
            stack.push(currentSlide);
            $slider.slick('slickGoTo', currentSlide + 2);
        }
        else if(opcao){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }

    var elementosObrigatorios = $("#sessao"+sessao+"Slide" +currentSlide+ " > .required");
    console.log("elementosObrigatorios", elementosObrigatorios.length);
    if(elementosObrigatorios.length){
        var slideValido = true;
        elementosObrigatorios.each(function(index, element){
            var opcao = $(element).find("input[name='radioS"+sessao +"S"+currentSlide+"Q"+index+"']:checked").val();
            console.log("opcao", opcao);
            if(!opcao)
                slideValido = false;
        });
        console.log("slideValido", slideValido);
        if(slideValido){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }
    
    var selectValidacao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredSelect");
    console.log("selectValidacao", selectValidacao.length);
    if(selectValidacao.length){
        var horas = $("#selectS"+sessao +"S"+currentSlide+"S"+0).val();
        var minutos = $("#selectS"+sessao +"S"+currentSlide+"S"+1).val();
        console.log("slideValido", horas, minutos);
        if((horas != "-1" && minutos != "-1") && (horas != "0" || minutos != "0") && (horas != "24" || minutos == "0")){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }

    var validaSimNao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao");
    console.log("validaSimNao", validaSimNao.length);
    if(validaSimNao.length){
        var slideValido = true;
        var opcao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao > .form-check > input[name='trabalha']:checked").val();
        console.log("opcao", opcao);
        if(opcao == "sim"){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else if(opcao == "nao"){
            window.location = "sessaoDois.html";
        }
        else
            canChange = true;
        
        return ;
    }

    var validaForm1 = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1");
    console.log("validaForm1", validaForm1.length);
    if(validaForm1.length){
        var nome = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputNome").val();
        var email = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputEmail").val();
        var idade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputIdade").val();
        var sexo = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > input[name='radioSexo']:checked").val();
        console.log("opcao", nome, email, parseInt(idade), sexo);
        if(nome && email && parseInt(idade) && sexo){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    var validaForm2 = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2");
    console.log("validaForm2", validaForm2.length);
    if(validaForm2.length){
        var rendaFamiliar = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #selectRendaFamiliar").val();
        var nivelEscolaridade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #selectNivelEscolaridade").val();
        console.log("opcao", rendaFamiliar, nivelEscolaridade);
        if(rendaFamiliar != "-1" && nivelEscolaridade != "-1"){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    var validamapa = $("#sessao"+sessao+"Slide" +currentSlide+ " > #map");
    console.log("validamapa", validamapa.length);
    if(validamapa.length){
        var peloMenosUmLocal = overlays.find(function(marcacao){
            return marcacao.getMap();
        })
        console.log("peloMenosUmLocal", peloMenosUmLocal);
        if(peloMenosUmLocal){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    stack.push(currentSlide);
    $slider.slick('slickNext');        
}

$("input").change(function(){
    console.log("marcou");
    validaSlide(undefined, $slider.slick("slickCurrentSlide"), $slider.slick("slickCurrentSlide")+1);
})

$("select").change(function(){
    console.log("marcou");
    validaSlide(undefined, $slider.slick("slickCurrentSlide"), $slider.slick("slickCurrentSlide")+1);
})

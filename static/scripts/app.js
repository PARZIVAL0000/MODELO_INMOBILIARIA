const barrios = {
    "0" : 'Pomasqui',
    "1" : 'El Quinche', 
    "2" : 'Guápulo',
    "3"  : 'Quito Tenis',
    "4"  : 'Iñaquito', 
    "5"  : 'La Mariscal', 
    "6"  : 'Mena del Hierro', 
    "7"  : 'El Condado',
    "8"  : 'Comité del Pueblo',
    "9"  : 'La Bota', 
    "10"  : 'Ponceano',  
    "11"  : 'Manuela Canizares', 
    "12"  : 'La Colon', 
};

const barrios_centroNorte = {
    "0" : "Calderón",
    "1" : "Quito Tenis",
    "2" : "Bellavista", 
    "3" : "Centro Norte",
    "4" : "Sangolqui", 
}

let barrio = [];

document.addEventListener("DOMContentLoaded", () => {
    app();
});

function app(){
    ValidarFormulario();
    MostrarBarrios();
    seleccionarBarrio();
    
}

const campos = {    
    'habitaciones' : false,
    'parqueadero' : false,
    'tipo_acabado' : false,
    'sector' : false
}

function ValidarFormulario(){
    const inputRadio = document.querySelectorAll("input[type=radio]");
    const inputSelect = document.querySelectorAll("select");
    const formulario = document.getElementsByClassName("formulario")[0];

    const ValidarEntradaSelect = (e) => {
        const name = e.target.name;

        switch(name){

            case "Habitaciones":
                const v1 = e.target.value;
                
                if(v1.trim() !== ""){
                    document.querySelector("#habitaciones").classList.add("border-primary");
                    document.querySelector("#habitaciones").classList.remove("border-danger");

                    document.querySelector("#campo-2 .entrada > .mensaje").classList.remove("mensaje-imprimir");

                    campos.habitaciones = true;
                }

                break;

            case "Parqueadero":
                const v2 = e.target.value;

                if(v2.trim() !== ""){
                    document.querySelector("#parqueadero").classList.add("border-primary");
                    document.querySelector("#parqueadero").classList.remove("border-danger");

                    document.querySelector("#campo-3 .entrada > .mensaje").classList.remove("mensaje-imprimir");
                    campos.parqueadero = true;
                }

                break;

            case "TipoAcabados":
                const v3 = e.target.value;

                if(v3.trim() !== ""){
                    document.querySelector("#acabado").classList.add("border-primary");
                    document.querySelector("#acabado").classList.remove("border-danger");

                    document.querySelector("#campo-4 .entrada > .mensaje").classList.remove("mensaje-imprimir");
                    campos.tipo_acabado = true;
                }

                break;

            default:
                break;
        }
    }


    const ValidarEntradaRadio = (e) => {
        const name = e.target.name;

        if(name === "Sector"){
            const value = e.target.value;

            if(value.trim() !== ""){
                if(value.trim() === "puembo" || value.trim() === "cumbaya"){
                    if(document.getElementById("desplegar-listado")){
                        document.getElementById("desplegar-listado").id = '';
                    }

                    if(document.querySelector(".seccion_radios .error-sectores")){
                        document.querySelector(".seccion_radios .error-sectores").classList.remove("error-sectores");
                        document.querySelector(".seccion_radios .listado-sectores .mensaje-imprimir").classList.remove("mensaje-imprimir");
                    }

                    if(!document.querySelector('#ocultarPanel')){
                        document.querySelector(".listado_barrios").id = "ocultarPanel";
                    }

                    campos.sector = true;   
                }else{
                    /* Dentro de esta seccion lo que haremos es verificar por nuestra dos opciones despues...
                        Centro nort de quito y norte quito... lo que vamos a realizar es desplegar por un listado de barrios especificos.
                    */
                    if(value.trim() === "centroNorte-quito" || value.trim() === "norte-quito"){
                        document.querySelector(".listado_barrios").id = '';
                        document.querySelector(".listado_barrios").classList.add("mostrarPanel");

                        const identificador = "desplegar-listado";
                        document.getElementsByClassName("listado_barrios")[0].id = identificador;
                        this.MostrarBarrios(value.trim());
                    }
                }

                this.MostrarBarrios();
            }else{
                campos.sector = false;
            }
            
        }
    }


    inputSelect.forEach(select => {
        select.addEventListener('change', ValidarEntradaSelect);
    });

    inputRadio.forEach(radio => {
        radio.addEventListener('change', ValidarEntradaRadio);

        if(radio.checked){
            if(radio.name.trim() === "Sector"){
                if(radio.value.trim() === "cumbaya"){
                    campos.sector = true;
                }
            }
        }
    });


    formulario.addEventListener("submit", (e) => {

        if(campos.habitaciones && campos.parqueadero && campos.sector && campos.tipo_acabado){
            // el usuario completo todos los campos...
        } else {
            e.preventDefault();

            window.location.href="#regresar";

            if(!campos.habitaciones){
                this.ejecutarCarga("habitaciones", "2");
            }

            if(!campos.parqueadero){
                this.ejecutarCarga("parqueadero", "3");
            }

            if(!campos.tipo_acabado){
                this.ejecutarCarga("acabado", "4");
            }

            if(!campos.sector){
                document.getElementsByClassName("listado-sectores")[0].classList.add('error-sectores');
                document.querySelector(".listado-sectores > .mensaje").classList.add("mensaje-imprimir");
            }
        }
    });
}


function ejecutarCarga(campo, id){
    document.querySelector(`#${campo}`).classList.remove("form-control");
    document.querySelector(`#${campo}`).classList.add("border-danger");
    document.querySelector(`#campo-${id} .entrada > .mensaje`).classList.add("mensaje-imprimir");
}



function MostrarBarrios(s = null){
    if(document.getElementById("desplegar-listado")){
        //settings para nuestro boton que despliega listado de barrios.
        document.querySelector("#desplegar-listado button").classList.remove("collapsed");
        document.querySelector("#desplegar-listado #panelsStayOpen-collapseOne").classList.remove("collapse");
        document.querySelector("#desplegar-listado #panelsStayOpen-collapseOne").classList.add("show");

        if(s !== null){
            limpiarHTML(s);

            let b = {};

            if(s === "norte-quito"){
                b = barrios;
            }else{
                b = barrios_centroNorte;
            }

            for(let i = 0; i < Object.keys(b).length; i++){
                let contenedor = document.createElement('TR');
                let identificador = document.createElement('TD');
                let barrio = document.createElement('TD');
                let sector = document.createElement('TD');
                let accion = document.createElement('TD');
                accion.classList.add('boton-barrio');
    
                identificador.textContent = i + 1;
                barrio.textContent = b[i.toString()];
                
                if(s === "centroNorte-quito"){
                    contenedor.classList.add(s);
                    contenedor.id = `tr-${i+1}`;
                    sector.textContent = 'Centro Norte de Quito';
                }else if(s === "norte-quito"){
                    contenedor.classList.add(s);
                    contenedor.id = `tr-${i+1}`;
                    sector.textContent = 'Norte de Quito';
                }
            
                
                accion.innerHTML = `
                    <a id="boton_barrio" class="boton-${i+1} btn-${s}" href="#">
                        <i class='bx bx-check ${i+1} ${s}' style='color:#469c07'>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACxElEQVRIS+VWQXLaMBT93/gA5AbJDcxguguBGWDabhqWbReFG4QTNDlBcoPQRdNl0k3bAWZIyK44E25Q36DssVC/hO0KRcIxG2ZaVmAkPb33/n/fCDv64I5wYSvgl2NvP3Lcjri0u4z6P+qzMC+BrYAbY7+GBRgLMM6gPqoHt/8msGAKDtTQgTfAwZMsEWbI4XbJ4Gse5s+SujmueODyyxTMpitdAiLsDuvTWZb0mcCNiX9Ciz7SQcX4sDmxDDmHEIHTd/T0C3GA3qgaXGwC3wgcg54ngHTgWcSi/m19NtcPbdz5p4jygvKTBW4FlvIWuKhcYspDzrCb5eFqz/KajN+X6AxLNtntwPf+YyzhnFqmnQWaMBU9zgrur5h3OKw+HJgkNwLHbB9XRQsXg2rQUzfHFrxARL7kfKr7qcpu63MjsLqxwKIDNZmad/43us2rNRYcvg+Pgtfqs+bEJ5vNF4+fr5bLGARXekOpJIqkJnp0eBiUkgO1YtOw1yu5qVklFrsQhQmJlLFelbFHffKomyC07iufOefvTJ7Rsy/DapD+15r450T5RF1LLXg2OgpO1xibgGnjDfnXTjaTfFf0/a2xWBCvBofT93/Xli9Ju04m8LrUlFKAQvY5sdjbRmqy5ZrkPBZ28QhkcRqlVm+myrRg0Z4aGDmK6zedWTR1xZrUKrDaTqYEEkXmIFbIb5oP8PNJO61iViYexWp7UH240e2xB8ikTCEg5d6YQPqBcYCIDJCJt2CsZIrYrMiUISIOAOa0s6aOFplzYts1sbVKbSsmtR1UprWxV3QLbkedYjZvk33ZY1GbOpI/tZkDEMrvSEHDQViSjs1NU+zZwGLhk6mjG5v+5jSjoWeTV92WyVhd3JqUj5ccPZoNH9LCi199aGx+WsAiNBWS6Z65gFPv/5u3zITxzl7orbWV44+tPM5xvnXpH/j3fi7gqGHsAAAAAElFTkSuQmCC"/>
                        </i>
                    </a>
                `;
    
                contenedor.appendChild(identificador);
                contenedor.appendChild(barrio);
                contenedor.appendChild(sector);
                contenedor.appendChild(accion);
    
                document.querySelector("#cuerpo_contenido").appendChild(contenedor);
            }

            seleccionarBarrio();
        }
    }else{
        document.querySelector("#accordionPanelsStayOpenExample button").classList.add("collapsed");
        document.querySelector("#accordionPanelsStayOpenExample #panelsStayOpen-collapseOne").classList.add("collapse");
        document.querySelector("#accordionPanelsStayOpenExample #panelsStayOpen-collapseOne").classList.remove("show");
    }
}


function limpiarHTML(s){
    if(s === "norte-quito"){
        barrio = [];
        campos.sector = false;

        if(document.querySelectorAll(".centroNorte-quito").length !== 0){
            document.querySelectorAll(".centroNorte-quito").forEach(tr => {
                tr.remove();
            });
        }

        if(document.querySelectorAll(".norte-quito").length !== 0){
            document.querySelectorAll(".norte-quito").forEach(tr => {
                tr.remove();
            });
        }
    }else{
        barrio = [];
        campos.sector = false;

        if(document.querySelectorAll(".norte-quito").length !== 0){
            document.querySelectorAll(".norte-quito").forEach(tr => {
                tr.remove();
            });
        }

        if(document.querySelectorAll(".centroNorte-quito").length !== 0){
            document.querySelectorAll(".centroNorte-quito").forEach(tr => {
                tr.remove();
            });
        }
    }
}


function seleccionarBarrio(){
    const VerificarBotonBarrio = (e) => {
        e.preventDefault();
        let boton = e.target.parentNode.parentNode;
        const id = boton.classList[0];
        const sector = boton.classList[1];

        if(sector === "btn-centroNorte-quito"){
            if(document.querySelector(`.${id}`).classList.contains("btn_close")){
                document.querySelector(`.${id}`).classList.remove("btn_close");
                document.querySelector(`.${id}`).innerHTML = `
                    <i class='bx bx-check' style='color:#469c07'>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACxElEQVRIS+VWQXLaMBT93/gA5AbJDcxguguBGWDabhqWbReFG4QTNDlBcoPQRdNl0k3bAWZIyK44E25Q36DssVC/hO0KRcIxG2ZaVmAkPb33/n/fCDv64I5wYSvgl2NvP3Lcjri0u4z6P+qzMC+BrYAbY7+GBRgLMM6gPqoHt/8msGAKDtTQgTfAwZMsEWbI4XbJ4Gse5s+SujmueODyyxTMpitdAiLsDuvTWZb0mcCNiX9Ciz7SQcX4sDmxDDmHEIHTd/T0C3GA3qgaXGwC3wgcg54ngHTgWcSi/m19NtcPbdz5p4jygvKTBW4FlvIWuKhcYspDzrCb5eFqz/KajN+X6AxLNtntwPf+YyzhnFqmnQWaMBU9zgrur5h3OKw+HJgkNwLHbB9XRQsXg2rQUzfHFrxARL7kfKr7qcpu63MjsLqxwKIDNZmad/43us2rNRYcvg+Pgtfqs+bEJ5vNF4+fr5bLGARXekOpJIqkJnp0eBiUkgO1YtOw1yu5qVklFrsQhQmJlLFelbFHffKomyC07iufOefvTJ7Rsy/DapD+15r450T5RF1LLXg2OgpO1xibgGnjDfnXTjaTfFf0/a2xWBCvBofT93/Xli9Ju04m8LrUlFKAQvY5sdjbRmqy5ZrkPBZ28QhkcRqlVm+myrRg0Z4aGDmK6zedWTR1xZrUKrDaTqYEEkXmIFbIb5oP8PNJO61iViYexWp7UH240e2xB8ikTCEg5d6YQPqBcYCIDJCJt2CsZIrYrMiUISIOAOa0s6aOFplzYts1sbVKbSsmtR1UprWxV3QLbkedYjZvk33ZY1GbOpI/tZkDEMrvSEHDQViSjs1NU+zZwGLhk6mjG5v+5jSjoWeTV92WyVhd3JqUj5ccPZoNH9LCi199aGx+WsAiNBWS6Z65gFPv/5u3zITxzl7orbWV44+tPM5xvnXpH/j3fi7gqGHsAAAAAElFTkSuQmCC"/>
                    </i>
                `;

                barrio = [];
                campos.sector = false;
                document.querySelector("#input_sectorBarrio").value = "";
            }else{
                if(barrio.length === 0){
                    if(document.querySelector(".seccion_radios .error-sectores")){
                        document.querySelector(".seccion_radios .error-sectores").classList.remove("error-sectores");
                        document.querySelector(".seccion_radios .listado-sectores .mensaje-imprimir").classList.remove("mensaje-imprimir");
                    }

                    document.querySelector(`.${id}`).innerHTML = "<i class='bx bx-x' style='color:#aa3d1c'><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaBJREFUSEvtlb1OAkEUhc8dtbGz0sjKA1iY2AMagpFoiBawEk0stdTCB/BRLMTExRhi7GyENTSK+gzyY0lUAhKzM2ZhSQhBGHYJa8G0O3O/OWfvPUNwaZFLXIzBI3N+bPX/sTrh885MEU/BEEdqtvja62baincNnB+Xq7Pbh7ncT6+9Pf/xKcAW/coLgCUAHxxGMK6/P3creOmbjxCxawCTAG5VvRCxDTYPJn2efUF0BjRm/pMzCsXT+cf2oprfswlQyoLWwVhETb/dOQJ3gVc4o2AL3gklgXDsoXDfr1mkxynpX4gLiAtLeQPODKGAoFlKaySwIQM1LyUNNjdrAWUXAglLTQXANAAG4FsQre9k8pl+SlvfBwI3bG8qPwcwYRWpEfFQLFPKykIHVuwaOBlQ9oSAqdZc7VZXiVE4ls7rsqqlrZZorrpsR0tb3THLoxknOwEio1wmMp8ALAP44jBW5SJT3Kh6cctRclmPxBUjfhLNlMzc/nM1UwwH5epc1NEjIduhdvZJd7Wd4o6sHjbQdmQO6yJjq4flZN86rln9C/K9tR9aPntxAAAAAElFTkSuQmCC\"/></i>";
                    document.querySelector(`.${id}`).classList.add("btn_close");

                    let nombre_barrio = document.querySelector(`#tr-${id.split("-")[1]} td:nth-child(2)`).textContent;
                    barrio.push(nombre_barrio);

                    campos.sector = true;

                    document.querySelector("#input_sectorBarrio").value = barrio[0];
                }
            }
           
        }else if(sector === "btn-norte-quito"){
            if(document.querySelector(`.${id}`).classList.contains("btn_close")){
                document.querySelector(`.${id}`).classList.remove("btn_close");
                document.querySelector(`.${id}`).innerHTML = `
                    <i class='bx bx-check' style='color:#469c07'>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACxElEQVRIS+VWQXLaMBT93/gA5AbJDcxguguBGWDabhqWbReFG4QTNDlBcoPQRdNl0k3bAWZIyK44E25Q36DssVC/hO0KRcIxG2ZaVmAkPb33/n/fCDv64I5wYSvgl2NvP3Lcjri0u4z6P+qzMC+BrYAbY7+GBRgLMM6gPqoHt/8msGAKDtTQgTfAwZMsEWbI4XbJ4Gse5s+SujmueODyyxTMpitdAiLsDuvTWZb0mcCNiX9Ciz7SQcX4sDmxDDmHEIHTd/T0C3GA3qgaXGwC3wgcg54ngHTgWcSi/m19NtcPbdz5p4jygvKTBW4FlvIWuKhcYspDzrCb5eFqz/KajN+X6AxLNtntwPf+YyzhnFqmnQWaMBU9zgrur5h3OKw+HJgkNwLHbB9XRQsXg2rQUzfHFrxARL7kfKr7qcpu63MjsLqxwKIDNZmad/43us2rNRYcvg+Pgtfqs+bEJ5vNF4+fr5bLGARXekOpJIqkJnp0eBiUkgO1YtOw1yu5qVklFrsQhQmJlLFelbFHffKomyC07iufOefvTJ7Rsy/DapD+15r450T5RF1LLXg2OgpO1xibgGnjDfnXTjaTfFf0/a2xWBCvBofT93/Xli9Ju04m8LrUlFKAQvY5sdjbRmqy5ZrkPBZ28QhkcRqlVm+myrRg0Z4aGDmK6zedWTR1xZrUKrDaTqYEEkXmIFbIb5oP8PNJO61iViYexWp7UH240e2xB8ikTCEg5d6YQPqBcYCIDJCJt2CsZIrYrMiUISIOAOa0s6aOFplzYts1sbVKbSsmtR1UprWxV3QLbkedYjZvk33ZY1GbOpI/tZkDEMrvSEHDQViSjs1NU+zZwGLhk6mjG5v+5jSjoWeTV92WyVhd3JqUj5ccPZoNH9LCi199aGx+WsAiNBWS6Z65gFPv/5u3zITxzl7orbWV44+tPM5xvnXpH/j3fi7gqGHsAAAAAElFTkSuQmCC"/>
                    </i>
                `;

                barrio = [];
                campos.sector = false;
                document.querySelector("#input_sectorBarrio").value = "";
            }else{
                if(barrio.length === 0){
                    if(document.querySelector(".seccion_radios .error-sectores")){
                        document.querySelector(".seccion_radios .error-sectores").classList.remove("error-sectores");
                        document.querySelector(".seccion_radios .listado-sectores .mensaje-imprimir").classList.remove("mensaje-imprimir");
                    }

                    document.querySelector(`.${id}`).innerHTML = "<i class='bx bx-x' style='color:#aa3d1c'><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaBJREFUSEvtlb1OAkEUhc8dtbGz0sjKA1iY2AMagpFoiBawEk0stdTCB/BRLMTExRhi7GyENTSK+gzyY0lUAhKzM2ZhSQhBGHYJa8G0O3O/OWfvPUNwaZFLXIzBI3N+bPX/sTrh885MEU/BEEdqtvja62baincNnB+Xq7Pbh7ncT6+9Pf/xKcAW/coLgCUAHxxGMK6/P3creOmbjxCxawCTAG5VvRCxDTYPJn2efUF0BjRm/pMzCsXT+cf2oprfswlQyoLWwVhETb/dOQJ3gVc4o2AL3gklgXDsoXDfr1mkxynpX4gLiAtLeQPODKGAoFlKaySwIQM1LyUNNjdrAWUXAglLTQXANAAG4FsQre9k8pl+SlvfBwI3bG8qPwcwYRWpEfFQLFPKykIHVuwaOBlQ9oSAqdZc7VZXiVE4ls7rsqqlrZZorrpsR0tb3THLoxknOwEio1wmMp8ALAP44jBW5SJT3Kh6cctRclmPxBUjfhLNlMzc/nM1UwwH5epc1NEjIduhdvZJd7Wd4o6sHjbQdmQO6yJjq4flZN86rln9C/K9tR9aPntxAAAAAElFTkSuQmCC\"/></i>";
                    document.querySelector(`.${id}`).classList.add("btn_close");

                    let nombre_barrio = document.querySelector(`#tr-${id.split("-")[1]} td:nth-child(2)`).textContent;
                    barrio.push(nombre_barrio);
                    campos.sector = true;

                    document.querySelector("#input_sectorBarrio").value = barrio[0];
                }
            }
        }
    }

    //este un boton el cual contiene cada uno de nuestro registros de barrios del listado.
    const botonesBarrio = document.querySelectorAll("#boton_barrio");
    if(botonesBarrio.length !== 0){
        botonesBarrio.forEach(btn => {
            btn.addEventListener("click", VerificarBotonBarrio);
        });
    }
}
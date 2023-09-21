const barrios = {
    "0" : 'Carcelén',
    "1" : 'Kennedy',
    "2" : 'El Batán',
    "3" : 'Bellavista',
    "4" : 'González Suárez',
    "5" : 'Guápulo',
    "6"  : 'Quito Tenis',
    "7"  : 'Iñaquito',
    "8"  : 'La Mariscal',
    "9"  : 'San Carlos',
    "10"  : 'Mena del Hierro',
    "11"  : 'El Condado',
    "12"  : 'Cotocollao',
    "13"  : 'Comité del Pueblo',
    "14"  : 'La Bota',
    "15"  : 'Ponceano',
    "16"  : 'Tumbaco',
    "17"  : 'El Inca',
    "18"  : 'La Luz',
    "19"  : 'Norte de Quito',
    "20"  : 'Pomasqui',
    
};

document.addEventListener("DOMContentLoaded", () => {
    app();
});

function app(){
    ValidarFormulario();
    MostrarBarrios();
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
                    campos.sector = true;   
                }else{
                    /* Dentro de esta seccion lo que haremos es verificar por nuestra dos opciones despues...
                        Centro nort de quito y norte quito... lo que vamos a realizar es desplegar por un listado de barrios especificos.
                    */
                    if(value.trim() === "centroNorte-quito" || value.trim() === "norte-quito"){
                        const identificador = "desplegar-listado";
                        document.getElementsByClassName("listado_barrios")[0].id = identificador;
                    }

                   campos.sector = false;
                }

                MostrarBarrios();
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

        if(campos.habitaciones && campos.parqueadero && campos.buscarPor && campos.sector && campos.tipo_acabado){
            // el usuario completo todos los campos...
        } else {
            e.preventDefault();

            if(!campos.habitaciones){
                this.ejecutarCarga("habitaciones", "2");
            }

            if(!campos.parqueadero){
                this.ejecutarCarga("parqueadero", "3");
            }

            if(!campos.tipo_acabado){
                this.ejecutarCarga("acabado", "4");
            }
        }
    });
}


function ejecutarCarga(campo, id){
    document.querySelector(`#${campo}`).classList.remove("form-control");
    document.querySelector(`#${campo}`).classList.add("border-danger");
    document.querySelector(`#campo-${id} .entrada > .mensaje`).classList.add("mensaje-imprimir");
}


function MostrarBarrios(){
    if(document.getElementById("desplegar-listado")){
        document.querySelector("#desplegar-listado button").classList.remove("collapsed");
        document.querySelector("#desplegar-listado #panelsStayOpen-collapseOne").classList.remove("collapse");
        document.querySelector("#desplegar-listado #panelsStayOpen-collapseOne").classList.add("show");
        
        // for(let i = 0; i < Object.keys(barrios).length; i++){
        //     let contenedor = document.createElement('TR');
        //     let texto = document.createElement('TD');
        //     let texto_2 = document.createElement('TD');
        //     let button = document.createElement('TD');
            

        //     texto.textContent = i.toString();
        //     texto_2.textContent = barrios[i.toString()];
        //     button.innerHTML = `
        //         <button type="button" class="btn btn-escoger" id="${i+1}">
        //         <img width="23" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAnZJREFUSEudlqGu1UAQhr/JtSjINVfgLwmKBASqCoflCZAoFArCC+DgDRA3KLgJAkiOIYEEQQgKCwEDAgQOlmy73c7uzmx7aHJOtu3uzPz//DNTQV0ChHTvrfX+Zq0PdTdC3Dr9zx6NB97r5XlardipQeZ7z9D4fHp5VeBKEN4SeL3Fj0eCg9jgSbhH4K56E9f3LUabNBneleOSrgY9fAfOKUfx/nBvx4m+PmLFMUKIOqiCn86vyaSRgCCl7Upj2qjnWBvtJr18mSM2oy55HHVfpSCdl5mQZcdKogvHTU2XFFWOxyCkqMKV2nXKqQmxTuiY4ZHxJaDS8QrVy9loZ8OV7DXgGsRaMJ7o1HPfdYmgcjyiT4h1jjf0ysidQbAtEFvwt4Ev6fcZ+Ar80QJMxWC29ZzLbhDasb0xGv8LfNPBCLwKcFr35b1z3KSxEZRJ9TPguu40bR03XSYbssSVhppHQa6CWAqHEH7kTrdCrw6/qWMzcY0E5xzJIISdnvfGPDbp2twrqu42F9AAYTe3vjrHR8Ad4CzwAjgBfqeTLpY6ciftg8CCWG2KyzfAZdWTfwGPgYfAh16F2s6KHu4iviTwrvjmMoS2TcRmiAOwy+JSWyLN763hbuesbPl2oyjCLKmuYjsPPAe50JnMG7rwIgflekKsWKwNnQGeCgzuh6ffuRYc7Z4u4vnggcCjINzMM3BL0erWVA/fwCbHMyO3gAfAgRaFW9CG8tSji8DHUlzGHF2Cl2sQngAxBdNlUL2i9k/A8ThEki/VQPyZKnAc4Eavjp2AIjkR5UvgZ81+CaQb+n9WcXNs/vTJ8MdP546M9nVcsqgz+g90yxEzwwR0JAAAAABJRU5ErkJggg=="/>
        //         Escoger Barrio</button>
        //         <input type="hidden" name="barrio-escogido" value="${barrios[i.toString()]}">
        //     `;

 
        //     contenedor.appendChild(texto);
        //     contenedor.appendChild(texto_2);
        //     contenedor.appendChild(button);

        //     // document.querySelector("#cuerpo_contenido").appendChild(contenedor);
        // }
    }else{
        document.querySelector("#accordionPanelsStayOpenExample button").classList.add("collapsed");
        document.querySelector("#accordionPanelsStayOpenExample #panelsStayOpen-collapseOne").classList.add("collapse");
        document.querySelector("#accordionPanelsStayOpenExample #panelsStayOpen-collapseOne").classList.remove("show");
    }
}
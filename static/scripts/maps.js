(() => {

    const iframesHTML = {
        "PUEMBO": `
        <iframe id="puembo" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63836.811962162064!2d-78.44673582371941!3d-0.17005154265714362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5923416590ffb%3A0x878bcd62a0fd662c!2sPuembo!5e0!3m2!1ses-419!2sec!4v1694967851581!5m2!1ses-419!2sec" 
            width="600" 
            height="450"
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        `,
        "CUMBAYA" : `
        <iframe id="cumbaya" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31918.339242500577!2d-78.45613750312903!3d-0.2065081366531639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5911fc4a2d301%3A0x75c0df62f9a789b0!2zQ3VtYmF5w6EsIFF1aXRv!5e0!3m2!1ses-419!2sec!4v1694967629394!5m2!1ses-419!2sec" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        `,
        "CENTRONORTE-QUITO" : `
        <iframe id="cn-quito" src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31918.44568515711!2d-78.50868855313003!3d-0.14405009068984048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1scentro%20norte%20de%20quito!5e0!3m2!1ses-419!2sec!4v1694967821652!5m2!1ses-419!2sec" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        `,
        "NORTE-QUITO" : `
        <iframe id="n-quito" src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31918.44568515711!2d-78.50868855313003!3d-0.14405009068984048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1scentro%20norte%20de%20quito!5e0!3m2!1ses-419!2sec!4v1694967821652!5m2!1ses-419!2sec" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        `
    };
    

    ejecutarFuncion();

    function ejecutarFuncion(){
        document.addEventListener("DOMContentLoaded", () => {
            //En caso de querer volver a usar esta funcion descomentarla, para poder hacer funcionar los mapas.
            // InputsRadio();
        });
    }

    function InputsRadio(){
        const inputRadios = document.querySelectorAll("input[type=radio]");
        inputRadios.forEach(radio => {
            radio.addEventListener("change", (e) => {
                const valor = e.target.value.toUpperCase();
                InsertarIframe(valor);
            });

            if(radio.checked){
                const valor = radio.value.toUpperCase();
                InsertarIframe(valor);
            }
        });
    }

    function InsertarIframe(valor){
        switch(valor){
            case "PUEMBO":
                document.getElementsByClassName('mapa-sectores')[0].innerHTML = iframesHTML[`${valor}`];
                break;

            case "CUMBAYA":
                document.getElementsByClassName('mapa-sectores')[0].innerHTML = iframesHTML[`${valor}`];
                break;

            case "CENTRONORTE-QUITO":
                document.getElementsByClassName('mapa-sectores')[0].innerHTML = iframesHTML[`${valor}`];
                IdentificarMapa();
                break;

            case "NORTE-QUITO":
                document.getElementsByClassName('mapa-sectores')[0].innerHTML = iframesHTML[`${valor}`];
                IdentificarMapa();
                break;

            default:
                break;
        }
    }

    function IdentificarMapa(){
        const botones = document.querySelectorAll(".boton-barrio > a");

        botones.forEach(boton => {
            boton.addEventListener("click", (e) => {
                const id = e.target.parentNode.classList[2];
                const tipo = e.target.parentNode.classList[3];
                
                if(tipo === "centroNorte-quito"){
                    let coordenadas = barrios_centroNorte[id].split(" ");
                    // iniciarMapa(coordenadas[0], coordenadas[1]);
                }else{
                    let coordenadas = barrios_centroNorte[id].split(" ");
                    // iniciarMapa(coordenadas[0], coordenadas[1]);
                }
            });
        });

    }
    

})();
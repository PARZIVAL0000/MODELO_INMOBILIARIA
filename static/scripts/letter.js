console.log('conexion...');

const type = new Typed('.typed', {
    strings: [
        '<i class="cabecera_texto">La casa de tus sueños.</i>', 
        '<i class="cabecera_texto">Los precios más baratos.</i>', 
        '<i class="cabecera_texto">Con nuestro buscador inteligente.</i>', 
        '<i class="cabecera_texto">Inmobiliarias al instante.</i>'
    ],
    loop: true,
    backSpeed: 75,
    typeSpeed: 75,
    startDelay: 1000,
    backDelay: 5000,
});

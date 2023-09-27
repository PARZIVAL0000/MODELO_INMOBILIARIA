from flask import Flask 
from flask import request
from flask import url_for
from flask import render_template
from ML import ml 
from json import loads

app = Flask(__name__)

@app.route("/")
def home(name = None):
    resultado = ml.obtenerML()
    resultado = resultado.to_json(orient="index")
    resultado = loads(resultado)

    return resultado
    

@app.route("/buscar/<habitaciones>/<parqueadero>/<tipoAcabados>/sector", methods=["POST"])
def buscar(habitaciones, parqueadero, tipoAcabados, sector):
    """
        habitaciones => 2/3/4/1
        parqueadero => 1/2/3/4/5
        tipoAcabados => 800(Gama alta)/ 400(gama media)/ 300(economico)
        sector => [...]
    """

    entrada = dict()
    datos = dict()

    if(request.method == "POST"):
        resultado = ml.entradas([
            {

                'Habitaciones' : habitaciones,
                'Parqueadero' : parqueadero,
                'TipoAcabados' : tipoAcabados,
                'Sector' : sector,
            }
        ])

    
        if(resultado):
            resultado = ml.ejecutarModelo()
            entrada['nombre'] = resultado['nombre'].values
            entrada['sector'] = resultado['sector'].values
            entrada['precio'] = resultado['precio'].values
            entrada['area'] = resultado['area'].values
            entrada['habitaciones'] = resultado['habitaciones'].values
            entrada['banos'] = resultado['banos'].values
            entrada['parqueadero'] = resultado['parqueadero'].values
            entrada['fecha'] = resultado['fecha'].values
            entrada['ciudad'] = resultado['ciudad'].values 
            entrada['precioXm2'] = resultado['precioXm2'].values

        return "METODO POST"

    return "[!] ATENCION: Debes usarlo con metodo POST" 





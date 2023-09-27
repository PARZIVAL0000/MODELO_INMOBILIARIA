from flask import Flask 
from flask import request
from ML import ml 
from json import loads

app = Flask(__name__)

@app.route("/")
def home(name = None):
    resultado = ml.obtenerML()
    resultado = resultado.to_json(orient="index")
    resultado = loads(resultado)

    return resultado
    

@app.route("/buscar/<habitaciones>/<parqueadero>/<tipoAcabados>/<sector>", methods=["POST"])
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
            resultado = ml.ML()
            resultado = resultado.to_json(orient="index")
            resultado = loads(resultado)

            resultado2 = ml.obtenerInfo()
            resultado2 = resultado2.to_json(orient="index")
            resultado2 = loads(resultado2)
            
        
            return {
                '0' : resultado, 
                '1' : resultado2
            }
        

        return "METODO POST"

    return "[!] ATENCION: Debes usarlo con metodo POST" 





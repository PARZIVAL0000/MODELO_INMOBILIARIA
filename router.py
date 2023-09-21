from flask import Flask 
from flask import request
from flask import url_for
from flask import render_template
from ML import ml 

app = Flask(__name__)

@app.get("/")
def home(name = None):
    return render_template('index.html', name=name)
    

@app.post("/buscar")
def buscar():
    entrada = dict()
    datos = dict()

    if(request.method == 'POST'):
        buscarPor = request.form['BuscarPor']
        habitaciones = request.form['Habitaciones']
        parqueadero = request.form['Parqueadero']
        tipoAcabados = request.form['TipoAcabados']
        sector = request.form['Sector']

        if(buscarPor != "" and habitaciones != "" and parqueadero != "" and tipoAcabados != "" and sector != ""):
            
            #Acomodamos nuestras variables... filtrandolas de la mejor manera.
            if(sector == "cumbaya"):
                sector = "Cumbayá"
            elif(sector == "puembo"):
                sector = "Puembo"
            
            resultado = ml.entradas([
                {
                    'BuscarPor' : buscarPor,
                    'Habitaciones' : habitaciones,
                    'Parqueadero' : parqueadero,
                    'TipoAcabados' : tipoAcabados,
                    'Sector' : sector,
                }
            ])


            if(buscarPor == "casas_venta"):
                buscarPor = "Casas en Venta"
            elif(buscarPor == "departamento_venta"):
                buscarPor = "Departamentos en Venta"

            #con esta entrada alimentamos a nuestro modelo...
            datos['BuscarPor'] = buscarPor
            datos['Habitaciones'] = habitaciones
            datos['Parqueadero'] = parqueadero
            datos['TipoAcabados'] = tipoAcabados
            datos['Sector'] = sector

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

        else:
            #redireccionamos al usuarioo... pero le generamos un parametros para que pueda ser consumido despues.\\
            return render_template('index.html')

    return render_template('buscar.html', entrada=entrada, datos=datos)




from flask import Flask 
from flask import request
from flask import url_for
from flask import render_template
from ML import ml as modelo

app = Flask(__name__)

@app.get("/")
def home():
    info = {'resultado' : 'vacio'}
    return render_template('index.html', info=info)
    

@app.post("/buscar")
def buscar():

    info = dict()

    if(request.method == 'POST'):
        habitaciones = request.form['Habitaciones']
        parqueadero = request.form['Parqueadero']
        tipoAcabados = request.form['TipoAcabados']
        sector = request.form['Sector']
        barrio = request.form['barrio']

        if(habitaciones != "" and parqueadero != "" and tipoAcabados != ""):
            if(sector != ""):
                if(sector == "cumbaya" or sector == "puembo"):
                    #Acomodamos nuestras variables... filtrandolas de la mejor manera.
                    if(sector == "cumbaya"):
                        sector = "Cumbayá"
                    elif(sector == "puembo"):
                        sector = "Puembo"

                elif(sector == "centroNorte-quito" or sector == "norte-quito"):
                    sector = barrio


                resultado = modelo.entradas([
                    {
                        'Habitaciones' : habitaciones,
                        'Parqueadero' : parqueadero,
                        'TipoAcabados' : tipoAcabados,
                        'Sector' : sector,
                    }
                ])

                try:
                    if(resultado):
                        modelo.limpiarDic()
                        resultado = modelo.modelo()
                        info['resultado'] = 'incompleto'
                        info['contenido'] = {}
                        
                        # print(resultado)
                   
                except ValueError:
                     return render_template('index.html', error="No se pudo verificar, vuelve a intentarlo nuevamente.")

        else:
            #redireccionamos al usuarioo... pero le generamos un parametros para que pueda ser consumido despues.\\
            return render_template('index.html')
        

    # return render_template('buscar.html', entrada=entrada, datos=datos)
    return render_template('index.html', info=info)



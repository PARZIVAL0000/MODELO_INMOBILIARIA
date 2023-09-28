import numpy as np
import pandas as pd
from sklearn.metrics import r2_score

""" 
==============================================================================
=========           ML INSTITUTO UNIVERSITARIO CORDILLERA           ==========
==============================================================================
"""
informacion = {
    'habitaciones' : '',
    'parqueadero' : '',
    'tipoAcabados' : '',
    'sector' : '',
}

fichero1 = 'ML/datas.csv'

info = {
    'precioMinimo' : [''],
    'precioMaximo' : [''],
    'precioPromedio' : [''],
    'PrecioSTD' : ['']
}

""" RAMA MASTER_DOS """
def ML():

    try:
        #obtenidos los datos de nuestro formulario... ahora lo que tenemos que realizar a continuacion es el medio de prediccion..
        data = pd.read_csv(fichero1)
        
        ciudad = []
        sector = []
        precios = []
        areas = []

        for key, value in data['sector'].items():
            valor = value.split(", ")
            sector.append(valor[0])
            ciudad.append(valor[len(valor)-2])


        for key, precio in data['precio'].items():
            valor = str(precio.split(" ")[1].split("\n")[0]).replace('.', '')
            precios.append(valor)

        data['sector'] = sector 
        data['ciudad'] = ciudad
        data['precio'] = precios

        for key, value in data['area'].items():
            value = str(value)
            if(value != 'nan'):
                areas.append(value.split(" ")[0])
            else:
                areas.append(value)
                
        data['area'] = areas

        resultado = data.loc[: , 'area'] != 'nan'
        data = data.loc[resultado]

        if(informacion['sector'] != '' and informacion['habitaciones'] != '' and informacion['parqueadero'] != '' and 
        informacion['tipoAcabados'] != '' and informacion['sector'] != ''):
            #filtrar por sector escogido del usuario...
            resultado = data.loc[:, 'sector'] == informacion['sector']
            data = data.loc[resultado]

            cantidad = data['precio']
            p = []

            for i,j in cantidad.items():
                if(j.isdigit()):
                    p.append(int(j))

            minimo = filtrarDatos(np.amin(p))
            maximo = filtrarDatos(np.amax(p))
            precioPromedio = filtrarDatos(np.mean(p))
            precioSTD = filtrarDatos(np.std(p))

            #---------------------
            info['precioMinimo'][0] = minimo
            info['precioMaximo'][0] = maximo
            info['precioPromedio'][0] = precioPromedio
            info['PrecioSTD'][0] = precioSTD

            return data

        return data
    except ValueError:
        return {
            "mensaje" : "Atención sector no encontrado, vuelve a intentarlo con otros sectores.",
            "estado" : "500"
        }
    
    

def filtrarDatos(entrada):
    entrada = str(entrada)

    if(len(str(entrada)) != 3):
        
        if(len(str(entrada)) > 4 and len(str(entrada)) <= 6):
            numeros = entrada[-3:]
            entrada = entrada.replace(numeros, '') 
            entrada += "."
            entrada += numeros
        elif(len(str(entrada)) >= 7): 
            entrada = round(float(entrada))
            entrada = str(entrada)
            
            if(len(str(entrada)) > 4 and len(str(entrada)) <= 6):
                numeros = entrada[-3:]
                entrada = entrada.replace(numeros, '') 
                entrada += "."
                entrada += numeros
            else:
                numeros = entrada[-6:]
                entrada = entrada.replace(numeros, '')
                entrada += "."
                entrada += numeros

                numeros = entrada[-3:]
                entrada = entrada.replace(numeros, '')
                entrada += "."
                entrada += numeros
                
    return entrada

def probar_aprendizaje(y_true, y_predict):
    score = r2_score(y_true, y_predict)
    # Return the score
    return score

def obtenerML():
    return ML()


def obtenerInfo():
    return pd.DataFrame(info)


#Esta funcion de aqui, procesa los datos del formulario y los almacena.
def entradas(entradas = []):
    if (len(entradas) != 0):
        informacion['habitaciones'] = entradas[0]['Habitaciones']
        informacion['parqueadero'] = entradas[0]['Parqueadero']
        informacion['tipoAcabados'] = entradas[0]['TipoAcabados']
        informacion['sector'] = entradas[0]['Sector']
        return True 
    else:
        return False 


def main():
    ML()
    

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        exit(1)
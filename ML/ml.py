import numpy as np
import pandas as pd
import re
import math
from sklearn.model_selection import ShuffleSplit
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import learning_curve
from sklearn.metrics import r2_score
import matplotlib.pyplot as pl
import seaborn as sns

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
    'precioTipoAcabados' : 0
}

fichero1 = 'ML/datas.csv'


""" RAMA MASTER_DOS """
def ML():
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
       informacion['tipoAcabados'] != '' and informacion['sector'] != '' and informacion['precioTipoAcabados'] > 0):
        #filtrar por sector escogido del usuario...
        resultado = data.loc[:, 'sector'] == informacion['sector']
        data = data.loc[resultado]

        # print("Precio Minimo: " + np.amin(precios))
        # print("Precio Maximo: " + np.amax(precios))
        # print("Precio Promedio: " + np.mean(precios))
        # print("Precio Desviacion Estandar: " + np.std(precios))
    
        return data


    return data
    


def obtenerML():
    return ML()


#funcion para verificar el nivel de prediccion de nuestro ML
def nivel_prediccion(y_true, y_prediccion):
    nivel = r2_score(y_true, y_prediccion)
    return nivel 


def formatearPresupuesto():
    precioCliente = informacion['presupuestoCliente']
    if(len(precioCliente) > 3 and len(precioCliente) <= 6):
        decimal = precioCliente[-3:]
        precioCliente = precioCliente.replace(decimal, ".")
        precioCliente += decimal
    return precioCliente


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


def ejecutarModelo():
    return ML()

def main():
    ejecutarModelo()
    

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        exit(1)
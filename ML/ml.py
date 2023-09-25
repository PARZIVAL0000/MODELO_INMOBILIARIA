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

fichero1 = 'ML/terrenos_quito.csv'
""" RAMA MASTER_DOS """
def ML():
    #obtenidos los datos de nuestro formulario... ahora lo que tenemos que realizar a continuacion es el medio de prediccion..
    data = pd.read_csv(fichero1)

    ciudad = []
    sector = []

    for key, value in data['sector'].items():
        valor = value.split(", ")
        sector.append(valor[0])
        ciudad.append(valor[len(valor)-1])

    data['sector'] = sector 
    data['ciudad'] = ciudad

    #nuestro db filtrado... solamente con los valores del sector que se esta especificando.
    sector = data.loc[:,"sector"] == informacion['sector'] 
    sector = data.loc[sector]

    print(sector)

    return 

    

    respuesta = sector.loc[:, "nombre"] != "NN"
    sector = sector.loc[respuesta]
    
    preciosFormateados = []
    areaFormateada = []
    parqueaderoFormateada = []
    for i,j in sector['precio'].items():
        j = str(j).replace(".", "")
        preciosFormateados.append(int(j))
    
    for i,j in sector['area'].items():
        j = str(j).replace(".", "")
        areaFormateada.append(int(j))
    
    for i,j in sector['parqueadero'].items():
        parqueaderoFormateada.append(int(j))

    sector['precio'] = preciosFormateados
    sector['area'] = areaFormateada
    sector['parqueadero'] = parqueaderoFormateada

    
    #(area+(acabados))*costo_m2 = resultado
    listado_preciom2 = []
    for key, value in sector['precio'].items():
        precio_m2 = sector['precio'][key]//sector['area'][key]
        
        listado_preciom2.append(precio_m2)

    sector['precioXm2'] = listado_preciom2


    precio_rCalculado = []
    for key, value in sector['area'].items():
        precio = (value+informacion['precioTipoAcabados'])*sector['precioXm2'][key]

        precio_rCalculado.append(precio)

    sector['precio'] = precio_rCalculado
    idHabitaciones = []
    idParqueaderos = []

    for key, value in sector["habitaciones"].items():
        if(str(value).isdigit()):
            if(value == informacion['habitaciones']):
                idHabitaciones.append(key)
            else:
                if(int(informacion['habitaciones']) > 2 and int(informacion['habitaciones']) <= 6):
                    idHabitaciones.append(key)

    r_ = sector.loc[idHabitaciones]

    for key, value in r_['parqueadero'].items():
        if(str(value).isdigit()):
            if(int(value) == int(informacion['parqueadero'])):
                idParqueaderos.append(key)
            else:
                if(int(informacion['parqueadero']) > 2 and int(informacion['parqueadero']) <= 8):
                    idParqueaderos.append(key)
    
    
    r_1 = r_.loc[idParqueaderos]

    return r_1


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


def ModelLearning(X, y):
    """ Calculates the performance of several models with varying sizes of training data.
        The learning and testing scores for each model are then plotted. """

    # Create 10 cross-validation sets for training and testing
    cv = ShuffleSplit(n_splits = 10, test_size = 0.2, random_state = 0)

    # Generate the training set sizes increasing by 50
    train_sizes = np.rint(np.linspace(1, X.shape[0]*0.8 - 1, 9)).astype(int)

    # Create the figure window
    fig = pl.figure(figsize=(10,7))

    # Create three different models based on max_depth
    for k, depth in enumerate([1,3,6,10]):

        # Create a Decision tree regressor at max_depth = depth
        regressor = DecisionTreeRegressor(max_depth = depth)

        # Calculate the training and testing scores
        sizes, train_scores, test_scores = learning_curve(regressor, X, y, \
            cv = cv, train_sizes = train_sizes, scoring = 'r2')

        # Find the mean and standard deviation for smoothing
        train_std = np.std(train_scores, axis = 1)
        train_mean = np.mean(train_scores, axis = 1)
        test_std = np.std(test_scores, axis = 1)
        test_mean = np.mean(test_scores, axis = 1)

        # Subplot the learning curve
        ax = fig.add_subplot(2, 2, k+1)
        ax.plot(sizes, train_mean, 'o-', color = 'r', label = 'Training Score')
        ax.plot(sizes, test_mean, 'o-', color = 'g', label = 'Testing Score')
        ax.fill_between(sizes, train_mean - train_std, \
            train_mean + train_std, alpha = 0.15, color = 'r')
        ax.fill_between(sizes, test_mean - test_std, \
            test_mean + test_std, alpha = 0.15, color = 'g')

        # Labels
        ax.set_title('max_depth = %s'%(depth))
        ax.set_xlabel('Number of Training Points')
        ax.set_ylabel('Score')
        ax.set_xlim([0, X.shape[0]*0.8])
        ax.set_ylim([-0.05, 1.05])

    # Visual aesthetics
    ax.legend(bbox_to_anchor=(1.05, 2.05), loc='lower left', borderaxespad = 0.)
    fig.suptitle('Decision Tree Regressor Learning Performances', fontsize = 16, y = 1.03)
    fig.tight_layout()
    fig.show()

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
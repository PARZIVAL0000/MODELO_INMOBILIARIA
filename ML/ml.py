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
        valor = str(precio.split(" ")[1].split("\n")[0])
        precios.append(valor)

    data['sector'] = sector 
    data['ciudad'] = ciudad

    for key, value in data['area'].items():
        value = str(value)
        if(value != 'nan'):
            areas.append(value.split(" ")[0])
        else:
            areas.append(value)
            
    data['area'] = areas

    resultado = data.loc[: , 'area'] != 'nan'
    data = data.loc[resultado]

    #vamos a calcular con una 'regresion'
    precios = data['precio']

    print("Precio Minimo: " + np.amin(precios))
    print("Precio Maximo: " + np.amax(precios))
    print("Precio Promedio: " + np.mean(precios))
    print("Precio Desviacion Estandar: " + np.std(precios))

    return 



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
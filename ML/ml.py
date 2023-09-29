# Import libraries necessary for this project
import numpy as np
import pandas as pd
from sklearn.model_selection import ShuffleSplit
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import make_scorer
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split


informacion = {
    'habitaciones' : '',
    'parqueadero' : '',
    'tipoAcabados' : '',
    'sector' : '',
}

resultado_final = {
    "Estadistica" : [
        {"Precio-Minimo" : '', "Precio-Maximo" : '', "Precio-Promedio" : '', "Precio-Medio" : '', "Desviacion" : ''},
    ],
    "InformacionCasas" : [
        
    ],

    "InformacionCliente" : [
        {"habitaciones" : '', "parqueadero" : '', "tipoAcabados" : '', "PrecioRango" : ''}
    ]
}



def modelo():
    data = pd.read_csv('ML/casas_venta.csv')

    respuesta = data.loc[:, 'nombre'] != 'NN'
    data = data.loc[respuesta]

    data['sector'] = data['sector'].str.split(",")[0]
    data['ciudad'] = data['sector'].str.split(",")[1]
    data['precio'] = int(data['precio'].str.replace('.', ''))

    listado_areas = []
    for key,value in data['area'].items():
        if(str(value).find('m²') != -1):
            listado_areas.append(int(value))
        else:
            signo = value[-2:]
            value = value.replace(signo, '')
            listado_areas.append(int(value))

    data['habitaciones'] = int(data['habitaciones'].str)
    data['banos'] = int(data['banos'].str)
    data['parqueadero'] = int(data['parqueadero'].str)

    respuesta = data.loc[:, 'sector'] == informacion['sector']
    data = data.loc[respuesta]

    #----------------------------------
    #Clasificacion de la informacion....
    precio = data['precio']
    caracteristica = data.drop(['precio', 'sector', 'ciudad', 'fecha', 'nombre'], axis = 1)

    precio_minimo = np.amin(precio)
    precio_maximo = np.amax(precio)
    precio_promedio = np.mean(precio)
    precio_medio = np.median(precio)
    precio_std = np.std(precio)

    # Show the calculated statistics
    print("Estadisticas del dataset terrenos:\n")
    print("Precio Minimo: ${}".format(precio_minimo)) 
    print("Precio Maximo: ${}".format(precio_maximo))
    print("Precio Promedio: ${}".format(precio_promedio))
    print("Precio Medio ${}".format(precio_medio))
    print("Desviacion Estandar del precio: ${}".format(precio_std))

    resultado_final['Estadistica'][0]['Precio-Minimo'] = str(precio_minimo)
    resultado_final['Estadistica'][0]['Precio-Maximo'] = str(precio_maximo)
    resultado_final['Estadistica'][0]['Precio-Promedio'] = str(precio_promedio)
    resultado_final['Estadistica'][0]['Precio-Medio'] = str(precio_medio)
    resultado_final['Estadistica'][0]['Desviacion'] = str(precio_std)
    
    resultado_final['InformacionCliente'][0]['habitaciones'] = informacion['habitaciones']
    resultado_final['InformacionCliente'][0]['parqueadero'] = informacion['parqueadero']
    resultado_final['InformacionCliente'][0]['tipoAcabados'] = informacion['tipoAcabados']

    X_train, X_test, y_train, y_test = train_test_split(caracteristica, precio, test_size=0.2, random_state = 42)

    reg = fit_model(X_train, y_train)
    print("El parametro 'max_depth' {} es el mas optimo para el modelo.".format(reg.get_params()['max_depth']))

    client_data = []
    c = []
    #Recolectamos los datos de nuestros clietes....
    #area - habitaciones
    for k,v in data['area'].items():
        i_c = {"nombre" : '', "precioBase" : '', "sector" : '', "ciudad" : '', "PrecioPredecido" : "", "area" : ""}
        i_c['nombre'] = data['nombre'][k]
        i_c['precioBase'] = str(data['precio'][k])
        i_c['sector'] = data['sector'][k]
        i_c['ciudad'] = data['ciudad'][k]
        i_c['PrecioPredecido'] = data['precio'][k]
        i_c['area'] = str(data['area'][k])


        data = []
        data.append(v)
        data.append(informacion['habitaciones'])
        data.append(informacion['parqueadero'])
        data.append(informacion['tipoAcabados'])

        client_data.append(data)
        c.append(i_c)

    # client_data = [[1200, 2, 5, 300]]  # Client 3
    # # Show predictions
    for i, price in enumerate(reg.predict(client_data)):
        c[i]['PrecioPredecido'] = "${:,.0f}".format(price)
        print("El ML predijo la terreno-{} con un precio estimado de: ${:,.0f}".format(i+1, price))

        resultado_final['InformacionCasas'].append(c[i])


    resultado = PredictTrials(caracteristica, precio, fit_model, client_data)
    resultado_final['InformacionCliente'][0]['PrecioRango'] = resultado
    
    return resultado_final
    

def performance_metric(y_true, y_predict):
    score = r2_score(y_true, y_predict)
    return score


def fit_model(X, y):  
    cv_sets = ShuffleSplit(n_splits = 10, test_size = 0.20, random_state = 0)
    regressor = DecisionTreeRegressor()
    params = {'max_depth':[1,2,3,4,5,6,7,8,9,10]}
    scoring_fnc = make_scorer(performance_metric)
    grid = GridSearchCV(estimator=regressor, param_grid=params, scoring=scoring_fnc, cv=cv_sets)
    grid = grid.fit(X, y)
    return grid.best_estimator_


def PredictTrials(X, y, fitter, data):
    prices = []
    for k in range(10):
        X_train, X_test, y_train, y_test = train_test_split(X, y, \
            test_size = 0.2, random_state = k)
        reg = fitter(X_train, y_train)
 
        pred = reg.predict([data[0]])[0]
        prices.append(pred)
        print("Trial {}: ${:,.2f}".format(k+1, pred))
            
    # print("\nRango de Precio: ${:,.2f}".format(max(prices) - min(prices)))

    return  "{:,.2f}".format((max(prices) - min(prices)))


def entradas(entradas = []):
    if (len(entradas) != 0):
        informacion['habitaciones'] = entradas[0]['Habitaciones']
        informacion['parqueadero'] = entradas[0]['Parqueadero']
        informacion['tipoAcabados'] = entradas[0]['TipoAcabados']
        informacion['sector'] = entradas[0]['Sector']
        return True 
    else:
        return False 



def limpiarDic():
    resultado_final['Estadistica'][0]['Precio-Minimo'] = ""
    resultado_final['Estadistica'][0]['Precio-Maximo'] = ""
    resultado_final['Estadistica'][0]['Precio-Promedio'] = ""
    resultado_final['Estadistica'][0]['Precio-Medio'] = ""
    resultado_final['Estadistica'][0]['Desviacion'] = ""

    resultado_final['InformacionCasas'] = []

    resultado_final['InformacionCliente'][0]['habitaciones'] = ""
    resultado_final['InformacionCliente'][0]['parqueadero'] = ""
    resultado_final['InformacionCliente'][0]['tipoAcabados'] = ""
    resultado_final['InformacionCliente'][0]['PrecioRango'] = ""
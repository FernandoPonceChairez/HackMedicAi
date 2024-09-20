# Importar bibliotecas necesarias
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Ejemplo de datos de entrenamiento
# Las preguntas están codificadas en 0 o 1 según la respuesta
# (0 = No, 1 = Sí), y la columna "Diagnóstico" representa la enfermedad diagnosticada
data = {
    'edad': [45, 50, 60, 40, 35, 55, 65],
    'sexo': [1, 1, 0, 0, 1, 0, 1],  # 1: Masculino, 0: Femenino
    'cansancio': [1, 0, 1, 0, 1, 1, 0],
    'perdidaPeso': [0, 1, 1, 0, 0, 1, 1],
    'sedConstante': [1, 0, 1, 0, 1, 1, 0],
    'miccionFrecuente': [1, 0, 1, 0, 1, 1, 0],
    'heridasCicatrizan': [1, 0, 1, 0, 0, 1, 1],
    'visionBorrosa': [1, 0, 1, 0, 0, 1, 1],
    'hormigueo': [0, 1, 1, 0, 0, 1, 0],
    'dolorCabeza': [1, 1, 0, 1, 0, 1, 1],
    'mareos': [1, 1, 0, 1, 0, 1, 1],
    'dificultadRespirar': [1, 1, 0, 1, 0, 1, 1],
    'diagnostico': ['Diabetes', 'Hipertensión', 'Diabetes', 'Hipertensión', 'Cáncer de mama', 'Diabetes', 'Hipertensión']
}

# Convertir el diccionario en un DataFrame de pandas
df = pd.DataFrame(data)

# Separar las características (X) de las etiquetas (y)
X = df.drop(columns=['diagnostico'])
y = df['diagnostico']

# Dividir el conjunto de datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo usando un Árbol de Decisión
modelo = DecisionTreeClassifier()
modelo.fit(X_train, y_train)

# Realizar predicciones sobre el conjunto de prueba
y_pred = modelo.predict(X_test)

# Evaluar el rendimiento del modelo
accuracy = accuracy_score(y_test, y_pred)
print(f'Precisión del modelo: {accuracy * 100:.2f}%')

# Función para predecir el diagnóstico basado en nuevas respuestas
def predecir_diagnostico(nuevas_respuestas):
    # Convertir las respuestas a un array de numpy y hacer la predicción
    respuestas_array = np.array([nuevas_respuestas]).reshape(1, -1)
    prediccion = modelo.predict(respuestas_array)
    return prediccion[0]

# Ejemplo de predicción con nuevas respuestas (edad, sexo, cansancio, etc.)
nuevas_respuestas = [40, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1]
diagnostico = predecir_diagnostico(nuevas_respuestas)
print(f'Diagnóstico predicho: {diagnostico}')

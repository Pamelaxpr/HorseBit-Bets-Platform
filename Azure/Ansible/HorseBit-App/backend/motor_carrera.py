import paho.mqtt.client as mqtt
import mysql.connector
import time
import random
import json

# --- CONFIGURACIÓN ---
BROKER = "localhost"
TOPIC  = "carrera/caballos"

# Configuración de MariaDB
DB_CONFIG = {
    "host":     "localhost",
    "user":     "horse_user",
    "password": "horse_pass",
    "database": "horsebit"
}

# --- FUNCIÓN 1: LEER STATS DE LA BASE DE DATOS ---
def obtener_stats_db():
    try:
        conn   = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, ganadas, derrotas FROM caballos")
        rows   = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"❌ Error leyendo DB: {e}")
        return []

# --- FUNCIÓN 2: GUARDAR RESULTADO EN LA BASE DE DATOS ---
def registrar_resultado_db(id_ganador):
    try:
        conn   = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Sumar victoria al ganador
        cursor.execute("UPDATE caballos SET ganadas = ganadas + 1 WHERE id = %s", (id_ganador,))
        # Sumar derrota a todos los demás
        cursor.execute("UPDATE caballos SET derrotas = derrotas + 1 WHERE id != %s", (id_ganador,))

        conn.commit()
        print(f"✅ [DB] Victoria guardada para ID {id_ganador}. Cambios confirmados.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error al guardar en DB: {e}")

# --- MOTOR PRINCIPAL DE LA CARRERA ---
client = mqtt.Client()

def ejecutar_gran_premio():
    try:
        client.connect(BROKER, 1883, 60)
        nombres = ["TRUENO", "RELÁMPAGO", "PEGASO", "TORNADO", "CENTELLA", "COMETA"]

        while True:
            # FASE 1: SINCRONIZACIÓN DE ESTADÍSTICAS REALES
            print("\nConsultando MariaDB para actualizar la web...")
            stats_reales = obtener_stats_db()
            client.publish(TOPIC, json.dumps({"comando": "SYNC_STATS", "datos": stats_reales}))

            # FASE 2: TIEMPO DE APUESTAS (20 segundos)
            print("Esperando apuestas... (Sincronizando relojes)")
            for i, nombre in enumerate(nombres):
                client.publish(TOPIC, json.dumps({"caballo": nombre, "pos": 0, "id": i}))
            time.sleep(20)

            # FASE 3: LA CARRERA (Aprox 25 segundos)
            print("INICIO DE CARRERA")
            posiciones    = {i: 0 for i in range(len(nombres))}
            carrera_viva  = True

            while carrera_viva:
                for i in range(len(nombres)):
                    avance       = random.uniform(0.2, 0.6)
                    posiciones[i] += avance

                    client.publish(TOPIC, json.dumps({
                        "caballo": nombres[i],
                        "pos":     round(posiciones[i], 2),
                        "id":      i
                    }))

                    if posiciones[i] >= 100:
                        ganador_id = i
                        print(f"🏆 ¡GANADOR: {nombres[i]}!")
                        client.publish(TOPIC, json.dumps({"caballo": nombres[i], "pos": 100, "id": i}))
                        registrar_resultado_db(ganador_id)
                        carrera_viva = False
                        break
                time.sleep(0.1)

    except Exception as e:
        print(f"💥 ERROR CRÍTICO EN EL MOTOR: {e}")

if __name__ == "__main__":
    ejecutar_gran_premio()

#!/bin/bash

echo "Iniciar la carrera"

# 1. Mosquitto (MQTT) esté corriendo
sudo systemctl start mosquitto

# 2. Verificar/Cargar la Base de Datos
echo "Sincronizando Base de Datos..."
sudo mysql < ../database/schema.sql

# 3. Lanzar el Director de la carrera
echo "Lanzando el motor de la carrera (director.py)..."
python3 ../logic/director.py

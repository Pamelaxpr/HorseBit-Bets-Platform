#!/bin/bash
set -e

echo "=========================================="
echo "🚀 INICIANDO DESPLIEGUE HORSEBIT PLATFORM "
echo "=========================================="

echo "▶️ Paso 0: Generando claves SSH (si no existen)..."
# Esto crea una clave RSA en silencio sin contraseña, solo si no existe ya una.
if [ ! -f ~/.ssh/id_rsa ]; then
  ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -q
  echo "Clave SSH generada correctamente."
else
  echo "La clave SSH ya existe, se usará la actual."
fi

echo "=========================================="
echo "🚀 INICIANDO DESPLIEGUE HORSEBIT PLATFORM "
echo "=========================================="

echo "▶️ Paso 1: Creación de Recursos Base..."
ansible-playbook 01_base_network.yml

echo "▶️ Paso 2: Configuración de Seguridad..."
ansible-playbook 02_security_group.yml

echo "▶️ Paso 3: Interfaz de Red e IP..."
ansible-playbook 03_network_interface.yml

echo "▶️ Paso 4: Creación de Máquina Virtual..."
ansible-playbook 04_virtual_machine.yml

echo "▶️ Obteniendo IP Pública dinámica de Azure..."
PUBLIC_IP=$(az network public-ip show --resource-group Horsebit_Productivo_rg --name IP_Publica_Web --query "ipAddress" --output tsv)

echo "▶️ Generando inventory.yml con clave SSH..."
cat << EOF > inventory.yml
productivo:
  hosts:
    $PUBLIC_IP:
      ansible_user: azureuser
      ansible_ssh_private_key_file: ~/.ssh/id_rsa
      ansible_ssh_common_args: "-o StrictHostKeyChecking=no"
EOF

echo "▶️ Paso 5: Aprovisionamiento de Servidor (Nginx)..."
# A partir de aquí incluimos el inventario para la conexión SSH
ansible-playbook -i inventory.yml 05_provision_server.yml

#echo "▶️ Paso 6: Entorno de Ejecución (Node.js)..."
#ansible-playbook -i inventory.yml 06_nodejs_setup.yml

echo "=========================================="
echo "✅ DESPLIEGUE COMPLETADO CORRECTAMENTE    "
echo "=========================================="
#!/bin/bash

echo "=========================================="
echo "🔥 DESTRUYENDO INFRAESTRUCTURA EN AZURE 🔥"
echo "=========================================="
echo "Eliminando el grupo de recursos: Horsebit_Productivo_rg..."
echo "(NOTA: Azure suele tardar entre 3 y 10 minutos en borrar todo. Ten paciencia y no cierres la terminal)."

az group delete --name Horsebit_Productivo_rg --yes

echo "=========================================="
echo "✅ INFRAESTRUCTURA ELIMINADA COMPLETAMENTE"
echo "=========================================="

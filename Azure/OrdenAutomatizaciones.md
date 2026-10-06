Recomendación para completar la Automatización
Para que Ansible despliegue la infraestructura de Azure idéntica al documento técnico productivo, deberías añadir al playbook los siguientes módulos de Azure:

azure_rm_subnet para crear la GatewaySubnet.

azure_rm_localnetworkgateway para crear el LNG_Proxmox.

azure_rm_virtualnetworkgateway para crear el VNG_Principal.

azure_rm_virtualnetworkgatewayconnection para establecer la Conexión IPSec.

Ampliar las reglas del puerto en el módulo azure_rm_securitygroup (añadir 80, 90, 224, 8080).

Ajustar las variables de nombres a Horsebit_Productivo_rg y NSG_Productivo_Azure.
---
- name: Despliegue desde Git
  hosts: webservers
  become: yes

  tasks:
    - name: Instalar nginx y git
      ansible.builtin.package:
        name: 
          - nginx
          - git  
          - ufw
        state: present
    
    - name: Limpiar directorio
      ansible.builtin.file:
        path: /var/www/html
        state: absent

    - name: Clonar el repositorio
      ansible.builtin.git:
        repo: 'https://github.com/Isabellasys/horsebit-web.git'
        dest: /var/www/html/
        force: yes
        version: main
      
    - name: Permisos para carpeta web
      ansible.builtin.file:
        path: /var/www/html/
        owner: www-data
        group: www-data
        recurse: yes      

    - name: Abrir puerto 80 en firewall 
      community.general.ufw:
        rule: allow
        port: '80'
        proto: tcp

    - name: Arrancar ngix
      ansible.builtin.service: 
        name: nginx
        state: started 
        enabled: yes

    - name: Reiniciar nginx
      ansible.builtin.service:
        name: nginx
        state: restarted



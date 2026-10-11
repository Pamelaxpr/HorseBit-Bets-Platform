---
- name: Configurar Balanceador con HTTPS
  hosts: localhost
  connection: local
  become: yes

  tasks:
    - name: 1. Instalar HAProxy
      ansible.builtin.package:
        name: haproxy
        state: present

    - name: 2. Crear certificado SSL autofirmado
      ansible.builtin.shell: |
        openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
        -keyout /etc/ssl/private/horsebit.key \
        -out /etc/ssl/certs/horsebit.crt \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=Horsebit Casino/CN=horsebit.local"
        cat /etc/ssl/certs/horsebit.crt /etc/ssl/private/horsebit.key > /etc/haproxy/horsebit.pem
      args:
        creates: /etc/haproxy/horsebit.pem

    - name: 3. Configurar HAProxy para Redirección HTTPS
      ansible.builtin.blockinfile:
        path: /etc/haproxy/haproxy.cfg
        block: |
          frontend http_front
              bind *:80
              bind *:443 ssl crt /etc/haproxy/horsebit.pem
              # Esto obliga a usar HTTPS siempre
              http-request redirect scheme https unless { ssl_fc }
              default_backend servidores_web

          backend servidores_web
              balance roundrobin
              server hipodromo-a 192.168.1.159:80 check
              server hipodromo-b 192.168.1.161:80 check

    - name: 4. Reiniciar HAProxy
      ansible.builtin.service:
        name: haproxy
        state: restarted

---
- name: Copiar index
  hosts: webservers
  become: yes 
  tasks:   
    - name: Colocar el index en el sitio correcto
      ansible.builtin.copy:
        src: /var/www/html/templates/index.html.j2
        dest: /var/www/html/index.html
        remote_src: yes

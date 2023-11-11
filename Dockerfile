# Use a imagem base do Nginx
FROM nginx:latest

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie a configuração do Nginx personalizada
COPY ./crud-ebook/nginx.conf /etc/nginx/conf.d/

# Copie a aplicação e defina permissões
COPY ./crud-ebook /usr/share/nginx/html/
RUN chown -R nginx:nginx /usr/share/nginx/html/
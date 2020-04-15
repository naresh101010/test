FROM httpd:alpine 
RUN rm -r /usr/local/apache2/htdocs/* 
COPY ./dist/ /usr/local/apache2/htdocs/ 
RUN chmod -R 755 /usr/local/apache2/htdocs/ 
EXPOSE 80 
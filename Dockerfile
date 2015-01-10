FROM ubuntu
RUN sudo apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install -y nodejs
RUN sudo npm update -g npm
RUN sudo apt-get install -y git
COPY dist /
RUN npm install
RUN sudo npm install -g forever
EXPOSE 8080
CMD ["forever", "/server/app.js"]

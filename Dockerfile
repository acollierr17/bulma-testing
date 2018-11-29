FROM node:latest

#Update container and install vim
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim-tiny", "apt-utils"]

#Create the directory
RUN mkdir -p /usr/src/bulma-testing
WORKDIR /usr/src/bulma-testing

#Copy and install the bot
COPY package.json /usr/src/bulma-testing
RUN npm install

#Now this is the bot
COPY . /usr/src/bulma-testing

#Start the bot!
CMD ["npm", "start"]
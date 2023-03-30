FROM node:19

# Update all the things
RUN apt-get update && apt-get -y upgrade

COPY ./live /live
WORKDIR /live
RUN npm install
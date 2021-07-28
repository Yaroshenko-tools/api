FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY ./backend /app
RUN yarn upgrade
EXPOSE 3000
CMD ["npm", "run", "start"]

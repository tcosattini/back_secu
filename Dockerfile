FROM node:14.17
WORKDIR /app
COPY . ./
RUN npm install
EXPOSE 8000
CMD ["node", "app/app.js"]
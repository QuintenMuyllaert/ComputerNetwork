FROM node:lts-alpine
WORKDIR /app
COPY apps/backend/package.json backend/package.json
RUN cd backend && npm install --production

COPY apps/backend/dist backend/dist
COPY apps/frontend/build frontend/build

EXPOSE 80

WORKDIR /app/backend
CMD ["npm", "start" ]
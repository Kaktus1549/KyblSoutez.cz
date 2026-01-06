FROM node:current-slim

WORKDIR /usr/src/app

COPY . .

RUN groupadd -r frontend && useradd -r -g frontend frontend
RUN chown -R frontend:frontend /usr/src/app

RUN npm install -g bun

RUN bun install 

RUN bun run build

EXPOSE 3000 
USER frontend

CMD ["bun", "run", "start"]
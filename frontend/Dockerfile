FROM node:24-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instala dependencias (ajusta a yarn/pnpm si es tu caso)
RUN npm install

# Next.js por defecto solo escucha en localhost. Esto permite acceso externo.
ENV HOSTNAME=0.0.0.0

# Copiar el resto del proyecto
COPY . .

EXPOSE 3000

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]


FROM apify/actor-node-playwright-chrome


COPY package*.json ./
COPY tsconfig.json ./

# copy source code to /app/src folder
COPY src src

RUN npm --quiet set progress=false && npm install && npm run build
RUN echo "Installed NPM packages:" && npm list || true
RUN echo "Node.js version:" && node --version \
 && echo "NPM version:" && npm --version

COPY . ./

CMD npm build
CMD npm start

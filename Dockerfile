FROM node:14.21.1

ENV YARN_CHECKSUM_BEHAVIOR="ignore"

WORKDIR /usr/app
COPY . .

RUN npm i -g -f yarn

RUN yarn install && \ 
    npx browserslist@latest --update-db && \
    yarn bootstrap && \
    yarn docs-sync pull microsoft/TypeScript-Website-localizations#main 1 && \
    yarn workspace typescriptlang-org setup-playground-cache-bust && \
    yarn build-site

EXPOSE 9000
CMD yarn workspace typescriptlang-org serve --host 0.0.0.0
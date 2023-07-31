FROM node:18-alpine As development

ENV WORK_DIR /usr/src/nestjs

WORKDIR $WORK_DIR

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --production=false

COPY --chown=node:node ./ ./

USER node

#################################
# BUILD FOR PRODUCTION
#################################

FROM node:18-alpine As build

USER node

ENV WORK_DIR /usr/src/nestjs
ENV NODE_ENV production

WORKDIR $WORK_DIR

COPY --chown=node:node --from=development $WORK_DIR/node_modules ./node_modules

COPY --chown=node:node ./ ./

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive --production=false

RUN yarn run build

#################################
# PRODUCTION
#################################

FROM node:18-alpine As production

USER node

ENV WORK_DIR /usr/src/nestjs
ENV NODE_ENV production

# build stage의 dist를 production stage로 복사
COPY --chown=node:node --from=build $WORK_DIR/node_modules ./node_modules
COPY --chown=node:node --from=build $WORK_DIR/dist ./dist

# 서버 시작
CMD [ "node", "dist/main.js" ]
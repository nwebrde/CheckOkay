# CheckOkay
Database must be configured to use UTC timeformat (for auto filled values like createdAt)!
All Dates stored are in UTC timeformat.

Native packages must be added to /apps/expo and /apps/next. Only adding to /packages/app is not possible as android builds do not find them there.

## Deployment of Server & Website
To build a docker image, run in repo root
```sh
docker-compose build .
```
This command builds a docker image that is optimized for ARM64 (as this is the operating architecture of our hosting server).
The image includes a nodejs next server that serves the API endpoint and the web app.
Also, the image includes an executable migrate.js that applies migration files to the host database.

To run a built image, execute
```sh
docker run -p 3000:3000 ghcr.io/nwebrde/checkokay
```

To deploy a built docker image to our hosting dokku server, run
```sh
docker image save ghcr.io/nwebrde/checkokay:latest | ssh -i /Users/niklasweber/.ssh/dokku.key ubuntu@dokku-ssh.nweber.de dokku git:load-image checkokay ghcr.io/nwebrde/checkokay:latest
```

To upload to ghcr, run
```sh
echo $CR_PAT | docker login ghcr.io -u nikwebr --password-stdin
docker push ghcr.io/nwebrde/checkokay:latest
```

## Database migrations
Changes to the database scheme must be committed by running 
```sh
cd packages/db
yarn migrations:generate
```
Please ensure that the generated mitigation file is added to git!

This command generates migration files. These migrations can then be applied to the local database by running
```sh
cd packages/db
yarn migrations:push-local
```
Host database migrations are applied automatically on push, they can be executed manually by running
```sh
dokku run checkokay /bin/sh -c 'cd packages/db; node dist/migrate.js'
```

## Environment variables
### Docker
The built docker image does not contain any environment variables. The docker image must be started with the environment variables needed for next (see step 8 of Setup Dokku Server and App)

### Next.js builds, dev servers
The env variables inside /apps/next must be adopted.
The database connection can be configured by either providing DATABASE_HOST, DATABASE, DATABASE_USER, and DATABASE_PASSWORD or by simply providing DATABASE_URL.
The DATABASE_URL env variable is provided automatically by dokku on linkage of mysql service with the app.

### Expo
The env variables inside /apps/expo must be adopted

## GitHub Actions
Builds and pushes every git push to dokku and ghcr.io.
Runs the database migration on the dokku server.

Important!: App must already be deployed to dokku. This GitHub Action only pushes changes to dokku app (see Setup Dokku Server and App, step 9)


## Setup Dokku Server and App
1. Install Dokku by following https://dokku.com/docs~v0.8.2/getting-started/installation/#1-install-dokku
2. Setup cloudflare tunnel
3. Add a new dokku app with
```sh
dokku apps:create checkokay
```
4. Add a mysql database service with
```sh
dokku mysql:create checkokay-db
```
5. Link database service with app
```sh
dokku mysql:link checkokay-db checkokay
```
6. Like mysql, add and link a redis service
7. Add domain checkokay.com to app
```sh
dokku domains:add checkokay checkokay.com
```
8. Add port mapping
```sh
dokku ports:add checkokay http:80:3000
```
9. Add env variables: Copy the content of apps/next/.env.production and paste it in this command:
```sh
dokku config:set checkokay CONTENT
```
10. Deploy first version of app manually (important! Github Actions only pushes changes)
```sh
dokku git:from-image checkokay ghcr.io/nwebrde/checkokay:latest
```
11. Setup env Variables in GitHub to enable GitHub Actions to push changes to dokku server

## Common Issues
### How to keep XCode Logs when building iOS App with EAS Build? Simply run
```sh
EAS_LOCAL_BUILD_SKIP_CLEANUP=1 eas build --profile development --platform ios --local
```
### iOS Build fails while Archiving with log entry Provisioning profile "*[expo] XXX AdHoc XXX" doesn't include signing certificate "Apple Distribution: XXX"
"In keychain access, under Login, my certificates, delete all "Apple Distribution: ......" Certificates, then no need to download / do anything else, it just works", taken from https://github.com/expo/eas-cli/issues/1201

### Was this repo forked from a template?
Yes, this repo was initially forked from a solito monorepo starter.
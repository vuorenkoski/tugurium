# Tugurium

Frontend and backend (running for example in local Raspberry pi server), which collects and visualizes data coming from different types of sensors (for example temperature, wind speed...). Frontend is build for both browser and Android device.

Mobile app in Play store (1.0.2 in production, 0.9.4 in beta testing): [https://play.google.com/store/apps/details?id=com.vuorenkoski.tuguriumMobile](https://play.google.com/store/apps/details?id=com.vuorenkoski.tuguriumMobile)

[User guide in Finnish](kayttoohje.md)

[Privacy policy in Finnish](tietosuojakaytanto.md)

There are also some example code snippets in C, Python and Arduino to send/get data from sensors, switches and cameras (tugurium-back/codeSnippetsForSending). Additionally, in tugurium-back/ folder one can find javascript progrms to get data to server from Finnish Meterological Institutes open data api: [https://en.ilmatieteenlaitos.fi/open-data](https://en.ilmatieteenlaitos.fi/open-data). These kind of programs could run for example hourly.

## Backend

Framework: javascript, Node, Express, graphQL, Apolloserver, Sequalize, Umzug

Database: Postgres

Data from sensors is pushed though api layear. Meteorological data is automatically collected hourly. Data is stored in SQL database (postgres). Sensor/image/Switch data can be fetched from api layer. When fetching sensor data, it can be aggregated hourly and daily (sum or average).

### Development environment api

- http://localhost:4000/api/image
- http://localhost:4000/api/graphql
- ws://localhost:4000/api/graphql

## Frontend

Framework: Javascipt, Node, React, Apollo-client, Victory, Bootstrap

Data is fetched from backend thourgh api layer and presented in different formats: current values, tables and graphs. In addition switches can be activated from frontend. Same functionalities are implemented to both browser and android platform (except settings are available only in browser).

Development environment url: http://localhost:3000/

Example production environment url: https://tugurium.herokuapp.com

## Mobile version

Framwork: Javascipt, Expo, React-native, Apollo-client, Victory-native

Build apk:

```
eas build -p android --profile apk
```

## Setting up production environment in raspberry pi

#### 1. Install node, npm and postgre

```
sudo apt install nodejs npm postgresql postgresql-contrib libpq-dev
```

#### 2. Create database

Create database:

```
sudo -u postgres psql
postgres=# create database tugurium_db;
postgres=# create user tugurium_user with encrypted password 'DB_PASSWORD';
postgres=# grant all privileges on database tugurium_db to tugurium_user;
postgres=# \q
```

#### 3. Clone repository

```
git clone git@github.com:vuorenkoski/tugurium.git
```

#### 4. Create service for backend and make it active run-on-boot

```
sudo cp /home/pi/tugurium/tugurium-back/tugurium.service /etc/systemd/system/.
sudo systemctl daemon-reload
sudo systemctl enable tugurium.service
```

#### 5. Apache2 config

Make necessary configs to tugurium-ssl.conf. After that:

```
sudo cp tugurium-ssl.conf /etc/apache2/sites-available/.
sudo a2enmod proxy
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2ensite tugurium-ssl.conf
sudo service apache2 restart
```

#### 6. Create .env file to tugurium-back/.env

- SECRET is random secret string
- SENSOR_TOKEN is static authorization token of sensors,
- DATABASE_URL is URL for postgre database (for example postgres://tugurium_user:DB_PASSWORD@localhost:5432/tugurium_db),
- ADMIN_PASSWORD initial admin password

These are for sending new important message as email. One needs access to smtp server for this to work.

- EMAIL_USERNAME
- EMAIL_PASSWORD
- EMAIL_FROM
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_TO

#### 7. Install dependencies, build frontend and start background service

copy tugurium-back/tugurium.service to /etc/systemd/system

```
npm install --prefix tugurium-back/
npm install --prefix tugurium-front/
npm run build --prefix tugurium-front/
sudo service tugurium start
```

#### 8. Insert to crontab a script to fetch data from FMI (in this example every 60 minutes)

```
30 * * * * sh /home/pi/tugurium/getFmiDataVihti.sh
15,45 * * * * sh /home/pi/tugurium/getFmiDataEspoo.sh
```

## Mobile version

Build apk:

```
eas build -p android --profile apk
```

## Some methods for database maintenance

Import old csv data to backend:

```
node importOld.js
```

Clear measurements when needed:

```
sudo -u postgres psql
postgres=# \c tugurium_db;
postgres=# truncate table measurements;
postgres=# \q
```

Dump and restore sql data when needed:

```
pg_dump -F c -U tugurium_user -h localhost tugurium_db -f sqlfile.sql

sudo -u postgres pg_restore -d tugurium_db -c sqlfile.sql
```

# Tugurium

This application is in Fullstack 2022 project course.

Idea: Frontend and backend (running for example in local Raspberry pi server), which collects and visualizes weather data and some other data. Frontend is build for both browser and Android device.

Running example application: [https://tugurium.herokuapp.com](https://tugurium.herokuapp.com)

- credentials (normal user): vieras, fullstack
- Heroku platform
- sample of 9k datapoints
- not connected to actual sensors, cameras, switches

Mobile in Expo: [https://expo.dev/@vuorenkoski/Tugurium](https://expo.dev/@vuorenkoski/Tugurium)

[User instructions in Finnish](userInstructions.md)

[Privacy policy in Finnish](tietosuojakaytanto.md)

[Time accounting](timeAccounting.md)

There are also some example code snippets in C, Python and Arduino to send/get data from sensors, switches and cameras (tugurium-back/codeSnippetsForSending).

## Backend

Framework: javascript, Node, Express, graphQL, Apolloserver, Sequalize, Umzug

Database: Postgres

Data from sensors is pushed though api layear. Meteorological data is automatically collected hourly. Data is stored in SQL database (postgres). Sensor/image/Switch data can be fetched from api layer. Sensordata can aggregated hourly and daily (sum or average).

### Development environment api

- http://localhost:4000/api/image
- http://localhost:4000/api/graphql
- ws://localhost:4000/api/graphql

### production environment api

- https://tugurium.herokuapp.com/api/image
- https://tugurium.herokuapp.com/api/graphql
- wss://tugurium.herokuapp.com/api/graphql

## Frontend

Framework: Javascipt, Node, React, Apollo-client, Victory, Bootstrap

Data is fetched from backend thourgh api layer and presented in different formats: current values, tables and graphs. In addition switches can be activated from frontend. Same functionalities are implemented to both browser and android platform (except settings are available only in browser).

Development environment url: http://localhost:3000/

Production environment url: https://tugurium.herokuapp.com

## Mobile version

Framwork: Javascipt, Expo, React-native, Apollo-client, Victory-native

Mobile in Expo: https://expo.dev/@vuorenkoski/Tugurium

Build apk:

```
eas build -p android --profile apk
```

## Setting up production environment in raspberry pi

#### 1. Install node, npm and postgre

```
sudo apt install postgresql postgresql-contrib nodejs
```

#### 2. Create database (instructions in Create database -section)

Install PostgreSQL:

```
sudo apt install postgresql postgresql-contrib libpq-dev
```

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

#### 4. Copy backround service script and activate run-on-boot

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

#### 7. Install dependencies, build frontend and start background service

copy tugurium-back/tugurium.service to /etc/systemd/system

```
npm install --prefix tugurium-back/
npm install --prefix tugurium-front/
npm run build --prefix tugurium-front/
sudo service tugurium start
sudo systemctl enable tugurium
```

#### 8. Insert to crontab a script to fetch data from FMI (in this example every 60 minutes)

```
30 * * * * sh /home/pi/tugurium/getFmiData.sh
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

# Tugurium

Project work for FullStack 2022

Idea: frontend and backend (running in local Raspberry pi server), which collects and visualizes temperature and some other data produced locally. Frontend is build for both browser and android device.

Running application: https://tempview.vuorenkoski.fi/

- Raspberry pi 2
- 2.9m datapoints
- somewhat slow with some queries concering many datapoints

Running application: https://tugurium.herokuapp.com

- Heroku platform
- 9k datapoints (there is 10k limit in free plan)
- not connected to actual sensors, cameras, witches of FMI data

[User instructions in Finnish](userInstructions.md)

[Time accounting](timeAccounting.md)

There are laos example codesnippets in c and python to send data from sensors, switches and camera (tugurium-back/codeSnippetsForSending).

## Data sources

Data is collected from sensors in two locations: home and summer cottage. In addition, some weather data is collected from Finnish Meterological Institute (https://en.ilmatieteenlaitos.fi/open-data).

### Home

- temperature (upstairs)
- temperature (downstairs)

### Cottage

- temperature (inside)
- temperature (outside)
- temperature (cellar)
- temperature (sauna)
- temperature (lake)
- temperature (sleeping barn)
- waterlevel (lake)
- motionsensor (inside)
- activity alert (mousetrap inside)

### Controls

- lights on/off (home)
- heating on/off (cottage)

### Finnish meteorological institute

- Rain (cottage, Röykkä observatory)
- Snow depth (cottage, Röykkä observatory)
- Wind speed (cottage, Röykkä observatory)
- Temperature (Home, Espoo)

## Basic functionalities

### Backend

Framework: Express, graphQL, Apolloserver, Sequalize, Umzug

Database: Postgres

Data from sensors is pushed though api layear. Meteorological data is automatically collected hourly. Data is stored in SQL database. Sensor/image/Switch data can be fetched from api layer. Sensordata can aggregated hourly and daily (sum or average).

ENV definitions:

- SECRET is random secret string
- SENSOR_TOKEN is static authorization token of sensors,
- DATABASE_URL is URL for postgre database (for example postgres://tugurium_user:secret@localhost:5432/tugurium_db),
- ADMIN_PASSWORD initial admin password

### Frontend

Framework: React (browser) and React native (mobile), Apollo-client, Victory, Bootstrap

Data is fetched from backend thourgh api layer and presented in different formats: current values, tables and graphs. In addition switches can be activated from frontend. Same functionalities are implemented to both browser and android platform (except settings are available only in browser).

## Development environment

Backend is running in http://localhost:4000/api/

Backend websocket: ws://localhost:4000/api/graphql

Frontend is running in http://localhost:3000/

### Set up the database

Install PostgreSQL:

```
sudo apt install postgresql postgresql-contrib libpq-dev
```

Create database:

```
sudo -u postgres psql
postgres=# create database tugurium_db;
postgres=# create user tugurium_user with encrypted password 'secret';
postgres=# grant all privileges on database tugurium_db to tugurium_user;
postgres=# \q
```

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

## Production environment

Frontend: https://tugurium.vuorenkoski.fi/

Backend: https://tugurium.vuorenkoski.fi/api/graphql

Backend websocket: wss://tugurium.vuorenkoski.fi/api/graphql

Backend image: https://tugurium.vuorenkoski.fi/api/image

### Setting up production environment

1. Install node, npm and postgre

```
sudo apt install postgresql postgresql-contrib nodejs
```

2. Create database (instructions in Create database -section)

3. Clone repository to /home/pi/tugurium

4. Copy backround service script and activate run-on-boot

```
sudo cp /home/pi/tugurium/tugurium-back/tugurium.service /etc/systemd/system/.
sudo systemctl daemon-reload
sudo systemctl enable tugurium.service
```

5. Apache2 config

Make necessary configs to tugurium-ssl.conf. After that:

```
sudo cp tugurium-ssl.conf /etc/apache2/sites-available/.
sudo a2enmod proxy
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2ensite tugurium-ssl.conf
sudo service apache2 restart
```

6. Create .env file to tugurium-back/.env

- SECRET is random secret string
- SENSOR_TOKEN is static authorization token of sensors,
- DATABASE_URL is URL for postgre database (for example postgres://tugurium_user:secret@localhost:5432/tugurium_db),
- ADMIN_PASSWORD initial admin password

7. Install dependencies, build frontend and start background service

copy tugurium-back/tugurium.service to /etc/systemd/system

```
npm install --prefix tugurium-back/
npm install --prefix tugurium-front/
npm run build --prefix tugurium-front/
sudo service tugurium start
sudo systemctl enable tugurium
```

8. Insert to crontab a script to fetch data from FMI (every 60 minutes)

```
30 * * * * sh /home/pi/tugurium/getFmiData.sh
```

## Mobile version

Build apk:

```
eas build -p android --profile apk
```

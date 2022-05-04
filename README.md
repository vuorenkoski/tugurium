# Tempview

Project work for FullStack 2022

Idea: frontend and backend running in local Raspberry pi server, which collects and visualizes temperature and some other data. Frontend is build for browser and android device. Javascript is used as programming language.

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
- waterlevel (well)
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

Data from sensors is pushed though api layear. Meteorological data is automatically collected hourly. Data is stored in SQL database. Data can be fetched from api layer by defining sensors, time period and aggregation method (hourly, daily, monthly average). When time period is defned current, most recent sensordata is given with timestamps.

ENV: SECRET is random secret string, SENSOR_TOKEN is static authorization token of sensors, DATABASE_URL is URL for postgre database, ADMIN_PASSWORD contains admin password

### Frontend

Framework: React (browser) and React native (mobile), Apollo-client, Victory, Bootstrap

Data is fetched from backend thourgh api layer and presented in different formats: current values, tables and graphs. In addition lights and heating can be activated from frontend. Same functionalities are implemented to both browser and andoird platform.

### Production server

Process manager: https://github.com/Unitech/pm2

## Development environment

Backend is running in http://localhost:4000/

Frontend is running in http://localhost:3000/

### Set up the database

Install PostgreSQL:

```
sudo apt install postgresql postgresql-contrib libpq-dev
```

Create database:

```
sudo -u postgres psql
postgres=# create database tempviewdb;
postgres=# create user tempviewuser with encrypted password 'secret';
postgres=# grant all privileges on database tempviewdb to tempviewuser;
postgres=# alter user tempviewuser createdb; --allow user to create a test database
postgres=# \q
```

Import old csv data to backend:

```
node importOld.js
```

Clear database:

```
sudo -u postgres psql
postgres=# \c tempviewdb;
postgres=# truncate table measurements;
postgres=# \q
```

Dump and restore sql data:

```
pg_dump -F c -U tempviewuser -h localhost tempviewdb -f sqlfile.sql

sudo -u postgres pg_restore -d tempviewdb -c sqlfile.sql

```

## Production environment

Production server will be run Raspberry Pi 2 in address https://tempview.vuorenkoski.fi.

Frontend: https://tempview.vuorenkoski.fi/

Backend: https://tempview.vuorenkoski.fi/graphql

### Setting up production environment

1. Install node, npm and postgre

```
sudo apt install postgresql postgresql-contrib nodejs
```

2. Create database (instructions in Create database -section)

3. Clone repository to /home/pi/tempview

4. Copy backround service script

```
sudo cp /home/pi/tempview/tempview-back/tempview.service /etc/systemd/system/.
```

5. Create .env file for backend

SECRET is random secret string, SENSOR_TOKEN is static authorization token of sensors, DATABASE_URL is URL for postgre database, ADMIN_PASSWORD contains admin password

6. Install dependencies, build frontend and start background service

```
sh build.sh
```

7. Insert to crontab a script to fetch data from FMI (every 60 minutes)

```
30 * * * * sh /home/pi/tempview/getFmiData.sh
```

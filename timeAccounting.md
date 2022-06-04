# Time accounting

|  day  | hours | activity                                                                                                                                              |
| :---: | :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25.4. | 6     | Planning basic design and frameworks, inital framework, graphql scetching                                                                             |
| 26.4. | 6     | Postgre connection + setting up production server                                                                                                     |
| 27.4. | 9     | Prod-serv configuration, data-push running, walking skeleton for front, authorizatio for backend, skeleton for navigation                             |
| 28.4. | 9     | Init victory library, added more sensors, bootstrap init, selection in timeseies view, tuning VictoryGraph                                            |
| 2.5.  | 2     | tuning VictoryGraph, current temps view                                                                                                               |
| 3.5.  | 9     | hour and day aggregate values, script to import old data, year selection, Exploration of FMI opendata api                                             |
| 4.5.  | 10    | fmi get data, loading... message, login, settings-tab, del/update/add sensors                                                                         |
| 10.5. | 10    | error handling, add+delete users, annual comparisons -view, timeseries: data processed only when needed, more efficient sql search                    |
| 11.5. | 8     | c-code to send measurement, index for meas-table, backend refactored, aggragate method col, motion sensor, lake surface, importOld                    |
| 12.5. | 8     | sensorlist ordering, only recent fmi data, tuning axis, statistcs page, login screen fix                                                              |
| 13.5. | 8     | monthly data view (this was a battle...), automatic x10 or /10 scale to timeseries -view, to apollo-express-server, image loading, varia-view         |
| 16.5. | 6     | dt images, get+post images, images to postgre                                                                                                         |
| 18.5. | 8     | c-code for https, lakedata view fixed, fixes to yearview&timeseries, fix stats if 0 datapoints, full image view, automatic frst year                  |
| 19.5. | 8     | switches implemented, c-code for sending switch status, graphql subscription, getCommand route and c-code to retrieve it, refactoring                 |
| 20.5. | 6     | Comprehensive bootstrap structure refactoring, working in different screen sizes, css-file, faster sql-script for stats                               |
| 21.5. | 7     | Several performance improvements for timeseries-view, viewchart tuning, faster solution to current temps, other time intervals than years             |
| 22.5. | 3     | tooltips for chart, chart as own component, resolvers refactored to seperate files, small fixes                                                       |
| 23.5. | 9     | tempview mobile walking skeleton, login, current temps view, switch-view                                                                              |
| 24.5. | 10    | web-socket running, first APK build, timeseries view, dropdown navigation                                                                             |
| 25.5. | 8     | theme refactored, timeseries tuned, years-view created, new DropDownSelector and ItemBox components                                                   |
| 30.5. | 3     | improved error handling to c snippets, improved view in tablet device and other refactoring to components                                             |
| 31.5. | 9     | improvements to browser-front, authentiaction check to websocket, better error messages to all views (mobile+browser), refetch after being background |
| 1.6.  | 9     | statistics-view, name change to tugurium, images-view, front queires divided to multiple files                                                        |
| 2.6.  | 9     | change ops only visible to admin, login+settings major refactor, password-change, heroku init and db dumb to heroku                                   |
| 3.6.  | 8     | showcase to heroku, paths refactored, backend hostname can be changed in mobile, websocket subprotocol changed (back+browser)                         |
| 4.6.  |       | websocket subprotocol changed (mobile), publish in expo                                                                                               |
| total | 188   |                                                                                                                                                       |

## Product backlog

- koodaa uudelleen lämpötilanäyttö
- käyttöohjeet
- hostin vaihto
- aitan kytkimen koodaus
- kameroiden token kuntoon

sensorit:

- aitta: kytkin, lämpötila, kamera
- mökki: lämpötilat, kamerat
- koti: nappi, alakerran lämpö, yläkerran lämpö

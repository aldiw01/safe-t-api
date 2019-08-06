# [API] Safe-t - Smart IoT Applications for Orderly Traffic
This project is under development, feel free to contact me for question.

## Installation

### clone the repo
``` bash
$ git clone https://aldiw01@bitbucket.org/aldiw01/safe-t-api.git
```

### go into app's directory
``` bash
$ cd safe-t-api
```

### import database safe_t.sql into mySQL server

### install node and npm
For windows version, you can get it here -> https://nodejs.org/en/download/ 

### install app's dependencies
``` bash
$ npm install
```

## Set Environment Variables
DATABASE_HOST
DATABASE_USER
DATABASE_PASSWORD
DATABASE_DB
EMAIL_USER
EMAIL_PASSWORD
TOKEN_ADMIN_SECRET
TOKEN_USER_SECRET

## Deploy API
``` bash
$ node src/index
```
or
``` bash
$ npm start
```

# Status Info
Info about status id

## Admin privilege_id
0. Not verified
1. Active/Staff
2. Super Admin
9. Deactivated

## User status
0. Not verified
1. Pending / Not Validated
2. Active
9. Deactivated

## Ticket status
0. Active
1. Closed
9. Archived

## History status
0. Unread
1. Read

## Reset Password status
0. Available User
1. Not available User
2. Available Admin
3. Not available Admin

## Verification token status
0. Available User
1. Not available User
2. Available Admin
3. Not available Admin

## Violation type
1. Lalu lintas
2. Identitas Pengendara
3. Atribut Kendaraan
4. Atribut Berkendara
5. Ugal-ugalan

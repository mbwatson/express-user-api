# Basic User API
# Served by Express

## What This Accomplishes

Simple API served via containerized Express and MongoDB.

## Getting Started

1. Clone this repository.

```bash
$ git clone https://github.com/renciweb/express-user-api.git
```

2. Install dependencies.

```bash
$ npm install
```

3. Define enfironment variables

To define any defaults used by this API, create a file `.env` in the project root. Use the existing `.env.example` file as a guide, which can be safely removed or renamed. The `.env` file may look like the following.

```bash
$ cat .env
DOMAIN_NAME=mydomain.org
```

- DOMAIN_NAME
    + This defines the default email address assigned to new  users. For example, setting `DOMAIN_NAME=mydomain.org` and posting a new user with username `johnDoe` will be initially stored with the email address `johnDoe@mydomain.org`. This can be changed later--see the `PUT` route below.

4. Then you're ready to start things up.

## Starting the Service

### Development

Build...

```bash
$ docker-compose build
```
and start...

```bash
$ docker-compose up
```

Serves to port 3030 with some basic [endpoints](#endpoints).

Or, more simply, just...

```bash
$ docker-compose up --build -d
```
to build and start detached in one line. Then stop with

```bash
$ docker-compose down
```

### Production

Serves to port 80 with some basic [endpoints](#endpoints).

...

## The User Model

```json
{
    "_id": "5bf0314ff9dcf500201e6a53"
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CEO",
    "aliases": ["Jane Doe", "J. Doe", "Jane B. Doe"]
    "phone": "123-456-7890",
}
```

The `_id` field is defined by Mongoose, but the `user` objects are accessible by the `username` field. All fields other than the `_id` field are strings.

## Routing

To keep things tidy, all routing logic is kept in a `/routes` directory. The routes file references the request type and makes the appropriate calls to the controller, passing along the request parameters for the ride.

## Controller

Receiving data from the routes, the controller defines the relationship between the data and the database model they interact with. For the sake of tidyness, the controller lives in the `/controllers` directory. The controller communicates with the database and returns the appropriate payloads for various requests.

## Endpoints

http://HOSTNAME:PORT

### `/` [GET] returns JSON array of users 
### `/` [POST] create a user

A POST request to the root path creates a new user. Only the `username` field is required to create the user.

Thus the minimal payload required to create a new user is one containing a username, as in the following example.

```json
{
    "username": "jdoe",
}
```

Inspecting the source code, you'll find the the `email` field is also required, but because it is constructed at the time of creation, it is unnecessary to pass in. It can be edited later.

### `/:username` [GET] return JSON user with username `username`

A GET request to `http://HOSTNAME:PORT/jdoe` returns the user with username `jdoe`, perhaps the JSON below would be returned.

```json
{
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CEO",
    "aliases": ["Jane Doe", "J. Doe", "Jane B. Doe"]
    "phone": "123-456-7890"
}
```

### `/:username` [PUT] update user with username `username`

This route expects an array of property-value objects in the form here.

```json
[
    {
        "property": "SOME_PROPERTY_NAME",
        "value": "NEW_VALUE_1"
    },
    {
        "property": "ANOTHER_PROPERTY_NAME",
        "value": "NEW_VALUE_2"
    },
]
```

For example, consider the following user information.

```json
{
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CEO",
    "aliases": ["Jane Doe", "J. Doe", "Jane B. Doe"]
    "phone": "123-456-7890"
}
```

We can update this user with a `PUT` request to `/jdoe` with the following payload.

```json
[
    {
        "property": "phone",
        "value": "888-888-8888"
    },
    {
        "property": "title",
        "value": "CFO"
    }
]
```

Then the user now looks like the following.

```json
{
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CFO",
    "aliases": ["Jane Doe", "J. Doe", "Jane B. Doe"]
    "phone": "888-888-8888"
}
```

### `/:username/alias` [PUT] update user with username `username`

We have separate routes for adding/removing user aliases one-at-a-time.
This one is for adding an alias. The payload looks like the following.

```json
{
    "alias": "J. B. Doe"
}
```

### `/:username/alias` [DELETE] update user with username `username`

Delete an alias. This payload looks identical.

```json
{
    "alias": "J. Doe"
}
```

Sending these alias requests would yield the following if we started with the last example.

```json
{
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CFO",
    "aliases": ["Jane Doe", "Jane B. Doe", "J. B. Doe"]
    "phone": "888-888-8888"
}
```

### `/:username` [DELETE] delete user with username `username`

### `/:username/photo` [GET] return static image associated with user

For the username `username`, the API looks for the image file `/public/photos/username.jpg`. Dump user photos into that `/public/photos` directory to use this feature. A defualt image (`public/photos/default.jpg`) is in place for users without associated image files.

### `/delete/all` [DELETE] deletes all users

# Basic User API
# Served by Express

## What This Accomplished

Simple API served with Express from the a Node Docker container.

Serves to port 3030 with some basic [endpoints](#endpoints).

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
Or just...
```bash
$ docker-compose up -d --build
```
to build and start detached in one line. Then stop with
```bash
$ docker-compose down
```

### Production

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
    "phone": "123-456-7890",
}
```

The `_id` field is defined by Mongoose, but the `user` objects are accessible by the `username` field. All fields other than the `_id` field are strings.


## Endpoints

http://localhost:3030

### `/` [GET] returns JSON array of users 
### `/` [POST] create a user

A POST request to the root path creates a new user. Only the `username` field is required to create the user.

Thus the minimal payload required to create a new user is one containing a username, as in the following example.

```json
{
    "username": "jdoe",
}
```

Inspecting the source code, you'll find the the `email` field is also required, but because it is constructed at the time of creation, it is unnecessary to pass in. It can be edited (`PATCH`ed) later.

### `/:username` [GET] return JSON user with username `username`

A GET request to `http://localhost:3030/jdoe` returns the user with username `jdoe`, perhaps the JSON below would be returned.

```json
{
    "username": "jdoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "email@ddre.ss",
    "title": "CEO",
    "phone": "123-456-7890"
}
```

### `/:username` [PATCH] update user with username `username`

This route expects an array of propperty-value objects in the form here.

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
    "phone": "123-456-7890"
}
```

We can update this user with a `PATCH` request to `/jdoe` with the following payload.

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
    "phone": "888-888-8888"
}
```

### `/:username` [DELETE] delete user with username `username`

### `/:username/photo` [GET] return static image associated with user

For the username `username`, the API looks for the image file `/public/photos/username.jpg`. Dump user photos into that `/public/photos` directory to use this feature. A defualt image (`public/photos/default.jpg`) is in place for users without associated image files.

### `/delete/all` [DELETE] deletes all users

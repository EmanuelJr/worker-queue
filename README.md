# Worker Queue
:warning::warning: **It's just a PoC  made in a few hours, there is a lot of optimizations to be done and refactoring to be really usable** :warning::warning:

## Basic use
1. Generate an authorization basic token following the [authorization guide](#authorization) 
2. Add some element in the queue using the [put endpoint](#push-an-element)
3. Get the queue elements with [get endpoint](#get-next-element)

## Setup
There are some configurations to be done in the worker:

### Environment variables
- `TTL` - Time to the element in the queue live
- `PASSWORD` - Global user password

### Worker KV
A Worker KV labeled as `QUEUE`.

## Authorization
Authorization is made through the [basic authorization](https://datatracker.ietf.org/doc/html/rfc7617) method, where the `user` can be any username and the `password` is the `PASSSWORD` enviroment variable.

## Endpoints

### Get next element
**Endpoint**: `/queue/{queue name}`

**HTTP method**: `GET`

**Headers**:
- `Authorization`: Basic authorization token

**Response**:
```json
{
  "index": "202110302133649351abaa14edfb4b72a54ca8ac305047ea",
  "data": "Test"
}
```

### Push an element
**Endpoint**: `/queue/{queue name}`

**HTTP method**: `PUT`

**Headers**:
- `Authorization`: Basic authorization token

**Body**: Any data JSON encoded

**Response**:
```json
{
  "status": "ok"
}
```
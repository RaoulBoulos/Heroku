const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurants');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Restaurants = require('../models/restaurants');
const restaurantRouter = express.Router();

restaurantRouter.use(bodyParser.json());

restaurantRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors, (req, res, next) => {
        Restaurants.find()
            .then((Restaurants) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Restaurants);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Restaurants.create(req.body)
            
            .then((restaurant) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(restaurant);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Update operation not supported for /Restaurants.");
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Restaurants.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

restaurantRouter.route('/id/:restaurantId')
    .get(cors.cors,(req, res, next) => {
        Restaurants.findById(req.params.restaurantId)
            .then((restaurant) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(restaurant);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported for /Restaurants/' + req.params.restaurantId + '.')
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Restaurants.findById(req.params.restaurantId)
            .then((restaurant) => {
                if (restaurant === null) {
                    err = new Error('restaurant ' + req.params.restaurantId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                if (restaurant != null) {
                    if (req.body.description) {
                        restaurant.description = req.body.description;
                    }
                    if (req.body.price) {
                        restaurant.price = req.body.price;
                    }
                    restaurant.save()
                        .then((restaurant) => {
                            Restaurants.findById(restaurant._id)
                                .then((restaurant) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(restaurant);
                                })
                        }, (err) => next(err));
                }

                else {
                    err = new Error('restaurant ' + req.params.restaurantId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Restaurants.findById(req.params.restaurantId)
            .then((restaurant) => {
                if (restaurant === null) {
                    err = new Error('restaurant ' + req.params.restaurantId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                if (restaurant != null) {
                    restaurant.remove();

                    restaurant.save()
                        .then((restaurant) => {
                            Restaurants.findById(restaurant._id)
                                .then((restaurant) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(restaurant);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('restaurant ' + req.params.restaurantId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = restaurantRouter;
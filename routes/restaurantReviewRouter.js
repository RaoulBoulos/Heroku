const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Reviews = require('../models/restaurantReview');
const authenticate = require('../authenticate');
const cors = require('./cors');
const restaurantReviewRouter = express.Router();

restaurantReviewRouter.use(bodyParser.json());

restaurantReviewRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors, (req, res, next) => {
        Reviews.find()
            .then((reviews) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(reviews);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Reviews.create(req.body)
            
            .then((review) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(review);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Update operation not supported for /reviews.");
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Reviews.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = restaurantReviewRouter;
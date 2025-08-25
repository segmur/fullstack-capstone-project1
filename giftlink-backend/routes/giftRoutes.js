/*jshint esversion: 8 */
// This file has been refined to use modern ES6 and ES8 JavaScript syntax.

import express from 'express';
// To query MongoDB documents by their unique ID, you need to import ObjectId.
import { ObjectId } from 'mongodb'; 
import connectToDatabase from '../models/db.js';
import logger from '../logger.js';

// Create a new router instance.
const router = express.Router();

// Get all gifts.
// The async/await syntax (ES8) is already used, which is great for handling asynchronous database calls.
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();

        res.json(gifts);
    } catch (e) {
        // Corrected the logger call from logger.console.error to logger.error.
        logger.error('Oops, something went wrong', e);
        next(e);
    }
});

// Get a single gift by its MongoDB ID.
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;

        // CRITICAL FIX: To query by MongoDB's unique _id, you must use the ObjectId type.
        // The original code used { id: id }, which would not work for a MongoDB _id.
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send("Gift not found");
        }

        res.json(gift);
    } catch (e) {
        logger.error('Error fetching single gift', e);
        next(e);
    }
});

// Add a new gift.
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        
        // Use a variable to hold the new gift data for clarity.
        const newGift = req.body;
        const result = await collection.insertOne(newGift);

        // Modern way to send back a successful response with the inserted ID.
        // The ops[0] property is deprecated.
        res.status(201).json({ 
            message: 'Gift created successfully', 
            insertedId: result.insertedId,
            gift: newGift
        });
    } catch (e) {
        logger.error('Error adding new gift', e);
        next(e);
    }
});

// Use ES6 module syntax for exporting the router.
export default router;


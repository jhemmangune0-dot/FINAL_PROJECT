const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getDb } = require('../db');
const { getAIAdvice } = require('../services/ai');

// POST /api/habits - Log a habit and get AI advice
router.post('/', [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('category').isIn(['Growth', 'Discipline', 'Health', 'Learning', 'Work', 'Other']).withMessage('Invalid category'),
    body('description').optional().trim().escape()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, category, description } = req.body;
    const userId = 1;

    try {
        const db = await getDb();

        // 1. Save habit
        const habitResult = await db.run(
            'INSERT INTO habits (user_id, title, description, category) VALUES (?, ?, ?, ?)',
            [userId, title, description, category]
        );
        const habitId = habitResult.lastID;

        // 2. Call AI Service
        const aiResponse = await getAIAdvice(title, category, description);

        // 3. Save AI response
        await db.run(
            'INSERT INTO ai_responses (habit_id, response_text, sentiment) VALUES (?, ?, ?)',
            [habitId, aiResponse.text, aiResponse.sentiment]
        );

        res.status(201).json({
            message: 'Habit logged successfully',
            habit: { id: habitId, title, category, description },
            ai_advice: aiResponse
        });

    } catch (error) {
        next(error);
    }
});

// GET /api/habits - Retrieve history
router.get('/', async (req, res, next) => {
    try {
        const db = await getDb();
        const rows = await db.all(`
            SELECT h.id, h.title, h.description, h.category, h.status, h.logged_at,
                   a.response_text as ai_advice, a.sentiment as ai_sentiment
            FROM habits h
            LEFT JOIN ai_responses a ON h.id = a.habit_id
            ORDER BY h.logged_at DESC
        `);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

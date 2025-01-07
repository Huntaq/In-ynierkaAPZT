const express = require('express');
const db = require('../config/db');

const router = express.Router();

/**
 * @swagger
 * /api/ranking/ranking:
 *   get:
 *     summary: Get CO2, kcal, and money savings ranking
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ranking data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user
 *                   total_CO2:
 *                     type: number
 *                     format: float
 *                     description: Total CO2 saved by the user
 *                   total_kcal:
 *                     type: number
 *                     format: float
 *                     description: Total calories burned by the user
 *                   total_money:
 *                     type: number
 *                     format: float
 *                     description: Total money saved by the user
 *       401:
 *         description: Token is required
 *       500:
 *         description: Database error
 */

//pobieranie danych rankingu Co2 Kcal i zaoszczędzonych pieniędzy
router.get('/ranking', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  const sqlRanking = `
    SELECT user_id,
      SUM(CO2) AS total_CO2,
      SUM(kcal) AS total_kcal,
      SUM(money) AS total_money
    FROM user_routes
    GROUP BY user_id
    ORDER BY total_CO2 DESC, total_kcal DESC, total_money DESC
  `;
  
  db.query(sqlRanking, (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
    
    if (results.length === 0) {
      console.log('error');
    }

    res.json(results);
  });
});

module.exports = router;

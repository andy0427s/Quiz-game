const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Teams route is working' });
});

module.exports = router;
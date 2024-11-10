const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Questions route is working' });
});

module.exports = router;
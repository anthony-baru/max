const express = require('express');
const router = express.Router();
router.get('/add-product', (req, res, next) => {
    res.send('<form action="/addproduct" method="POST" ><input name="title" type="text" ><button type="submit">Add Prodcuct</button></form>')
});
router.post('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/');
});
module.exports = router;
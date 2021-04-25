const express =  require('express');
const router = express.Router();

// item Model
const Item = require('../../models/item')

// @route   GET api/items   http://localhost:5000/api/items
// @desc    get all items
// @access  Public
// ------------------------------------
router.get('/', (req,res) => {
    Item.find()
        .sort({date: -1})
        .then(items => {
            res.json(items)
        })
        .catch(err => {
            res.json(err.message)
            //res.json("123")
        })
})

// @route   Post api/items  http://localhost:5000/api/items
// headers  key: Content-Type, value: application/json
// body     raw: {name: milk}
// @desc    Create An Item
// @access  Public
// ------------------------------------
router.post('/', (req,res) => {
    const newItem = new Item({
        name: req.body.name
    })

    newItem.save().then((item) => res.json(item));
})

// @route   DELETE api/items/:id  http://localhost:5000/api/items
// headers  key: Content-Type, value: application/json
// body     raw: {name: milk}
// @desc    Delete An Item
// @access  Public
// ------------------------------------
router.delete('/:id', (req,res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}))
})

module.exports = router;


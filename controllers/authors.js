const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op, fn, col } = require('sequelize')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        group: 'author',
        attributes: ['author', [fn('COUNT', col('author')), 'articles'], [fn('SUM', col('likes')), 'likes']],
        order: [['likes', 'DESC']],
    })
    res.json(blogs)
})

module.exports = router
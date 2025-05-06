const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const { Op, fn, col } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.body.blogId)
    next()
}

const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.body.userId)
    next()
}

router.post('/', [blogFinder, userFinder], async (req, res) => {
    if (req.blog && req.user) {
        const entry = await ReadingList.create({userId: req.user.id, blogId: req.blog.id})
        res.json(entry)
    } else {
        res.status(404).end()   
    }
})

module.exports = router
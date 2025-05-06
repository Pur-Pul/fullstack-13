const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const { Op, fn, col } = require('sequelize')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.body.blogId)
    next()
}

const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.body.userId)
    next()
}

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const decodedToken = jwt.verify(authorization.substring(7), SECRET)
            req.user = await User.findByPk(decodedToken.id)
        } catch(e) {
            next(e)
        }
    }  else {
        return res.status(401).json({ error: 'token missing' })
    }
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

router.put('/:id', tokenExtractor, async (req, res, next) => {
    const reading = await ReadingList.findByPk(req.params.id)
    try {
        if (reading) {
            if (reading.userId === req.user.id) {
                reading.read = req.body.read
                await reading.save()
                res.json(reading)
            } else {
                res.status(403).end()
            }
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
    
})

module.exports = router
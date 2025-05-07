const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')
const { tokenExtractor } = require('../middleware')

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
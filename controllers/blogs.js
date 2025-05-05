const router = require('express').Router()
const { removeTicks } = require('sequelize/lib/utils')
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
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

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        order: [['likes', 'DESC']],
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where: {
            [Op.or] : [
                {
                    title: { [Op.iLike]: req.query.search ? `%${req.query.search}%` : '%%' }
                },
                {
                    author: { [Op.iLike]: req.query.search ? `%${req.query.search}%` : '%%' }
                }
            ]
            
        }
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const blog = await Blog.create({...req.body, userId: req.user.id})
        return res.json(blog)
    } catch(error) {
        next(error)
    }
})

router.delete('/:id', [tokenExtractor, blogFinder], async (req, res) => {
    if (req.blog) {
        if (req.blog.userId === req.user.id) {
            await req.blog.destroy()
        } else {
            res.status(403).end()
        }
    }
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        if (req.blog) {
            req.blog.likes = req.body.likes
            await req.blog.save()
            res.json(req.blog)
        } else {
            res.status(404).end()
        }
    } catch(error) {
        next(error)
    }
})

module.exports = router
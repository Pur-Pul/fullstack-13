const router = require('express').Router()

const { User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.put('/:username', async (req, res, next) => {
    const user = await User.findOne({ where: { username: req.params.username }})
    try {
        if (user) {
            user.username=req.body.username
            await user.save()
            res.json(user)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router
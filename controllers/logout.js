const router = require('express').Router()

const { Session } = require('../models')
const { tokenExtractor } = require('../middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  if (req.user) {
    const sessions = Session.findAll({ where: { userId: req.user.id }})
    ;(await sessions).forEach((session) => {
      session.destroy()
    })
  }
  res.status(204).end()
})

module.exports = router
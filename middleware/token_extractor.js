const { SECRET } = require("../util/config")
const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7)
            const decodedToken = jwt.verify(token, SECRET)
            const session = await Session.findOne({ where: { token }})
            if (session) { 
                const user = await User.findByPk(decodedToken.id)
                if (user.disabled) {
                    return res.status(403).json({ error: 'user has been disabled' })
                }
                req.user = user
            } else {
                return res.status(401).json({ error: 'token expired' })
            }
        } catch(e) {
            next(e)
        }
    }  else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = tokenExtractor

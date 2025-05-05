const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const errorHandler = (error, req, res, next) => {
  console.error(error)
  if (error.name === 'SequelizeDatabaseError' || error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error:error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error:"token invalid" })
  }
  next(error)
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
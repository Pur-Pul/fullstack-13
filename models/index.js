const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList })
Blog.belongsToMany(User, { through: ReadingList })

//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
  Blog,
  User,
  ReadingList
}
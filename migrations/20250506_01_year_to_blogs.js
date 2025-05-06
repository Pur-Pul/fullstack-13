const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1991],
          msg: "Must be at least 1991"
        },
        customValidator(value) {
          const current_year = new Date().getFullYear()
          if (Number(value) > Number(current_year)) {
            throw new Error(`Must be less or equal to ${current_year}`)
          }
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
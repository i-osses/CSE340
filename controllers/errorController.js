const errorController = {}

errorController.triggerError = (req, res, next) => {
  try {
    throw new Error("This is a test 500 error.")
  } catch (err) {
    next(err)
  }
}



module.exports = errorController
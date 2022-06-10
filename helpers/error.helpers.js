const logRepo = require('/repos/logRepos')

const errorHelpers = {

  logErrorsToConsole: (err, req, res, next) => {
    console.error("Log entry" + JSON.stringify(errorHelpers.errorBuilder(err)));
    console.error("*".repeat(80));
    next(err);
  },

logErrorsToFile: (err, req, res, next) => {
    let errorObject = errorsHelpers.errorBuilder(err);
    errorObject.requestInfo = {
        'hostname': req.hostname,
        'path': req.path,
        'app': req.app
    }
    logRepo.writeError(errorObject, (data) => {
        console.log(data)
    })
    next(err)
},


  clientErrorHandler: (err, req, res, next) => {
    if ((req, xhr)) {
      res.status(500).json({
        status: 500,
        statusText: "server error",
        message: "XMLHttpRequest error",
        error: {
          errno: 0,
          call: "XMLHttpRequest Call",
          code: "SERVER_ERROR",
          message: "XMLHttpRequest error",
        },
      });
    } else {
      next(err);
    }
  },
  errorHandler: (err, req, res, next) => {
    res.status(500).json(errorHelpers.errorBuilder(err));
  },
  errorBuilder: (err) => {
    return {
      status: 500,
      statusText: "server error",
      message: err.message,
      error: {
        errno: err.errno,
        call: err.syscall,
        code: "server error",
        message: err.message,
      },
    };
  },
};

module.exports = errorHelpers;

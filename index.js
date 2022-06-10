const express = require("express");
const app = express();
const pieRepo = require("./repos/pieRepo");
let errorHelper = require('./helpers/error.helpers')

// Express Router Object
const router = express.Router();

// Middleware
app.use(express.json());

// Returns list of all pies
router.get("/", (req, res, next) => {
  (pieRepo.get = (data) => {
    res.status(200).json({
      status: 200,
      statusText: "OK",
      message: "All pies retrieved",
      data: pies,
    });
  }),
    function (err) {
      next(err);
    };
});

// Search for pies by id or name
router.get("/search", (req, res, next) => {
  const searchObject = {
    id: req.query.id,
    name: req.query.name,
  };

  pieRepo.search(
    searchObject,
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved",
        data: data,
      });
    },
    (err) => {
      next(err);
    }
  );
});

// Returns a single pie
router.get("/:id", (req, res, next) => {
  pieRepo.getbyId(
    req.params.id,
    (data) => {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "Pie was found successfully",
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not found",
          message: "The pie " + req.params.id + " does not exist",
          error: {
            code: "NOT_FOUND",
            message: "The pie " + req.params.id + " was not found",
          },
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

// Inserts a new pie
router.post("/", (req, res, next) => {
  pieRepo.insert(
    req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "New pie was added successfully",
        data: data,
      });
    },
    (err) => {
      next(err);
    }
  );
});

// Updates a pie
router.put("/:id", (req, res, next) => {
  pieRepo.getbyId(req.params.id),
    (data) => {
      if (data) {
        pieRepo.update(req.body, req.params.id, (data) => {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "Pie was found successfully",
            data: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Error",
          message:
            "Pie ' " + req.params.id + " wasn't able to be added successfully",
          error: {
            code: "NOT_FOUND",
            message: "The pie " + req.params.id + " doesn't exist'",
          },
        });
      }
    };
});

// Patch update for specific property
router.patch("/", (req, res, next) => {
  pieRepo.getbyId(req.params.id, (data) => {
    if (data) {
      pieRepo.update(req.body, req.params.id, (data) => {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "The pie" + req.params.id + " is patched",
          data: data,
        });
      });
    }
  });
});

// Deletes the pie
router.delete("/:id", (req, res, next) => {
  pieRepo.getbyId(req.params.id, (data) => {
    if (data) {
      pieRepo.delete(req.params.id, (data) => {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "The pie" + req.params.id + " is deleted",
          data: "The pie " + req.params.id + "is deleted forever",
        });
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "OK",
        message: "The pie" + req.params.id + " is deleted",
        error: {
          code: "NOT_FOUND",
          message: "The pie " + req.params.id + "is deleted forever",
        },
      });
    }
  });
});

// Configured router for all routes
app.use("/api/", router);


// Configure clients for errors
app.use(errorHelper.logErrorsToConsole)
app.use(errorHelper.clientErrorHandler)
app.use(errorHelper.errorHandler)
app.use(errorHelper.logErrorsToFile)

// Exception logger
app.use(function(err,req,res,next) {
  console.error(errorBuilder(err));
  next(err);
})


// Middleware exceptions last
app.use(function (err, req, res, next) {
  res.status(500).json(errorBuilder(err))
});

// server
const server = app.listen(5000, () => {
  console.log("server listening on port 5000");
});

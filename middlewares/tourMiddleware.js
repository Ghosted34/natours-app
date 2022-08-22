export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty,duration";
  next();
};

export const aliasAllPremium = (req, res, next) => {
  req.query.premium = true;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields =
    "name,price,ratingsAverage,summary,difficulty,premium,duration";

  next();
};

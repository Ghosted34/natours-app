class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedObj = ["page", "sort", "limit", "fields", "field"];
    excludedObj.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matched) => `$${matched}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(defSort) {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defSort);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectBy = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectBy);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limitValue = this.queryString.limit * 1 || 3;
    const skipValue = (page - 1) * limitValue;

    this.query = this.query.skip(skipValue).limit(limitValue);

    return this;
  }
}

export default APIFeatures;

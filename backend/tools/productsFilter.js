class ProductsFilter {
  constructor(query, parameters) {
    this.query = query
    this.parameters = parameters
  }
  search() {
    const name = this.parameters.name

    this.query = this.query.find(
      name
        ? {
            name: {
              $regex: name,
              $options: 'i',
            },
          }
        : {}
    )

    return this
  }
}

module.exports = ProductsFilter

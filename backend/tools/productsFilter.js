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
  splitIntoPages(productsPerPage) {
    const currentPage = this.parameters.page || 1

    const productsToSkip = (currentPage - 1) * productsPerPage

    this.query = this.query.limit(productsPerPage).skip(productsToSkip)

    return this
  }
  filter() {
    const parameters = {}

    for (parameter in this.parameters) {
      if (parameter !== 'page' && parameter !== 'name') {
        parameters[parameter] = this.parameters[parameter]
      }
    }

    let parametersString = JSON.stringify(parameters)

    parametersString = parametersString
      .replace('lte', '$lte')
      .replace('gte', '$gte')

    this.query = this.query.find(JSON.parse(parametersString))

    return this
  }
}

module.exports = ProductsFilter

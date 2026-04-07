const defaultCatalog = require('../data/catalog');

let catalog = [...defaultCatalog];

function getCatalog() {
  return [...catalog];
}

function addIfNotExists(institution) {
  if (!catalog.includes(institution)) {
    catalog.push(institution);
    return true;
  }
  return false;
}

function resetCatalog() {
  catalog = [...defaultCatalog];
}

module.exports = { getCatalog, addIfNotExists, resetCatalog };

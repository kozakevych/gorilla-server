const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('', '');
const index = client.initIndex('gorilla_king');

router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page
    }, (err, content) => {
      res.json({
        success: true,
        message: "Seach successfull",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});

module.exports = router;
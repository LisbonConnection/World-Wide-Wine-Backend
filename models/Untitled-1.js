
router.post("/reviews", () => {
    Review.create(req.body)
        .then(review => {
        })
        .catch(err => {
            res.status(400).json(err)
        })
})



/////


router.get("/wines/:id", () => {
    Wine.findById(y)
        .then(review => {
            Review.find()
        })
        .catch(err => {
            res.status(400).json(err)
        })
})
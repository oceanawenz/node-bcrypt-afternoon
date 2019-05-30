module.exports = {
    dragonTreasure: async(req, res, next) => {
        //get the db object and runs the get_dragon_treasure sql file, passing in number 1.
        const treasure = await req.app.get('db').get_dragon_treasure(1);
        return res.status(200).send(treasure)
    },
    getUserTreasure: async (req, res, next) => {
      const userTreasure = await req.app.get('db').get_user_treasure([req.session.user.id]);
      return res.status(200).send(userTreasure);
    }
}
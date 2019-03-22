
const handleAddcard = (req, res, db) => {
    const {name, description, price, character_type, image_path, owner_id} = req.body;
    console.log(req.body);

    if (!name || !price || !character_type || !image_path || !owner_id) {
        return res.status(400).json("incorrect submission form");
    }
        db('card')
        .returning('*')
        .insert({
            name: name,
            description: req.body.description ? description : null,
            price: Number(price),
            character_type: character_type,
            image_path: image_path,
            production_date: new Date(),
            owner_id: Number(owner_id)
        })
        .then(card => {
            res.json(card);
        })
        .catch(err => res.status(400).json(err));
}

const handleUpdatecard = (req, res, db) => {
    const {id, name, description, price, character_type, image_path} = req.body;
    console.log(req.body);

    if (!id || !name || !price || !character_type || !image_path) {
        console.log("owner_id");
        return res.status(400).json("incorrect submission form");
    }
        db('card')
        .where('id', '=', Number(id))
        .returning('*')
        .update({
            name: name,
            description: req.body.description ? description : null,
            price: Number(price),
            character_type: character_type,
            image_path: image_path,
        })
        .then(card => {
            res.json(card);
        })
        .catch(err => res.status(400).json(err));

}

const handleDeletecard = (req, res, db) => {
    const {id} = req.body;
    console.log(req.body);
    console.log(req.body);

    if (!id) {
        return res.status(400).json("incorrect submission form");
    }
        db('card')
        .where('id', '=', Number(id))
        .returning('*')
        .del()
        .then(card => {
            res.json(card);
        })
        .catch(err => res.status(400).json(err));

}

const handleGetUserCard = (req, res, db) => {
    const { owner_id } = req.body;
    console.log(req.body);
    if (!owner_id) {
        console.log("owner_id");
        return res.status(400).json("incorrect submission form");
    }

    db("card")
    .where("owner_id", owner_id)
    .then(cards => {
        res.json(cards);
    })
    .catch(err => res.status(400).json(err));
}

const handleGetCheapestCards = (req, res, db) => {
    const { character_type } = req.body;
    console.log(req.body);
    if (!character_type) {
        console.log("character_type");
        return res.status(400).json("incorrect submission form");
    }

    db("card")
    .where("character_type", "=", character_type)
    .orderBy("price", 'asc')
    .limit(6)
    .then(cards => {
        res.json(cards);
    })
    .catch(err => res.status(400).json(err));
}

const handleGetCardsByTheMenu = (req, res, db) => {
    const { time, characters, price } = req.body;
    console.log(req.body);
    if (!time || !characters || !price) {
        console.log(time);
        return res.status(400).json("incorrect submission form");
    }
    console.log(price.length);
    let d = new Date();
    let database = db("card");
    switch (time) {
        case 'today':
            database = database
                .where("production_date", ">=" , (d.getDate()) + "/" 
                                                + (d.getMonth() + 1) + "/" 
                                                + d.getFullYear());
            break;

        case 'this week':
            d.setDate(d.getDate() - d.getDay());
            database = database
                .where("production_date", ">=" , (d.getDate()) + "/" 
                                                + (d.getMonth() + 1) + "/" 
                                                + d.getFullYear());
            break;
    
        case 'this month':
            database = database
                .where("production_date", ">=" , 1 + "/" 
                                                + (d.getMonth() + 1) + "/" 
                                                + d.getFullYear());
            break;

        default:
            break;
    }

    if (characters.length) {
        database = database
            .whereIn('character_type', characters);
    }
    
    database
    .where((dataBasePrice)=> {
        if (price.includes("0")) {
            dataBasePrice = dataBasePrice.orWhere('price', "<", 1);
        }

        if (price.includes("1")) {
            dataBasePrice = dataBasePrice.orWhereBetween('price', [1,2]);
        }
        if (price.includes("2 above")) {
            dataBasePrice = dataBasePrice.orWhere('price', ">=", 2);
        }
    })
    .then(cards => {
        res.json(cards);
    })
    .catch(err => res.status(400).json(err));
}

const handleGetCardsByName = (req, res, db) => {
    const { name } = req.body;
    if (!name) {
        console.log('\n'+name);
        return res.status(400).json("incorrect submission form");
    }
    console.log("*" + name + "*");
    db('card')
    .where('name', 'like', "%" + name.trim() + "%")
    .then(card => {
        res.json(card);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
    handleAddcard: handleAddcard,
    handleUpdatecard: handleUpdatecard,
    handleDeletecard:handleDeletecard,
    handleGetUserCard: handleGetUserCard,
    handleGetCheapestCards: handleGetCheapestCards,
    handleGetCardsByTheMenu: handleGetCardsByTheMenu,
    handleGetCardsByName: handleGetCardsByName
}
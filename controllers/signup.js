const handleSignup = (req,res, db, bcrypt) => {
    const {email, nickname, password} = req.body;

    if (!email || !nickname || !password) {
        console.log(req.body);
        return res.status(400).json("incorrect submission form");
        
    }

    const hash =bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    nickname: nickname,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to signup"));
}

module.exports = {
    handleSignup: handleSignup
}
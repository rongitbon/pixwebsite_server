const handleUpdateProfile = (req, res, db) => {
    const {id, nickname, description, email, image_path, pre_email} = req.body;
    console.log(req.body);

    if (!id || !nickname || !email || !pre_email) {
        return res.status(400).json("incorrect submission form");
    }
    db.transaction(trx => {
        trx.update({
            email: email
        })
        .into('login')
        .where('email', '=', pre_email)
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
                .returning('*')
                .update({
                    nickname: nickname,
                    email: email,
                    description: description,
                    image: image_path,
                })
                .where('email', '=', pre_email)
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err));

}

module.exports = {
    handleUpdateProfile: handleUpdateProfile
}
"unable to update user profile"
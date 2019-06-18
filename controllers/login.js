const dataBase = require('dataBase').getInstance();
const bcrypt = require('bcrypt');
const  tokinazer = require('../../helpers/tokinazer');

module.exports = async (req, res)=>{
    try {
        const User = await dataBase.getModel('User');

        const {name, password} = req.body;
        if (!name || !password) throw new Error('Some fields are empty');

        const isPresent = await User.findOne({
            where:{
                name
            }
        });
        if (!isPresent)throw new Error('User with this name does not exist');

        const correctPassword = await new Promise((resolve, reject)=>{
            bcrypt.compare(password, isPresent.password, (err, result)=>{
                if (err){
                    console.log(err);
                    return reject(arr);

                }
                if (result) return resolve(true);

            });
        });

        const {id, name:Name} = isPresent;
        const accessToken = tokinazer(id, Name);

        if (!correctPassword){
            res.json({
                success:false,
                message:'Wrong password'
            });

        }else if (correctPassword){
            res.json({
                success:true,
                message:accessToken
            })
        }

    }catch (e) {
        console.log(e);
        res.json({
            success:false,
            message: e.message
        })

    }
};

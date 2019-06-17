const dataBase = require('../../dataBase').getInstance();
const bcrypt = require('bcrypt');


module.exports = async (req, res) =>{
    try {
        const User = dataBase.getModel('User');

        const cafeInfo = req.body;
        if (!cafeInfo) throw new Error('No user information');

        const token = req.get('Authorization');
        if (!token) throw new Error('No token');

        const {name, password} = cafeInfo;
        if (!name || !password) throw new  Error('Some fields are empty');

        const alreadyExist = await User.findOne({
            where:{
                name
            }
        });

        const saltRounds = 10;

        if (alreadyExist){
            throw new Error('User with this name already exist')
        }else bcrypt.hash(password, saltRounds, async(err, hash)=>{
            if (err)console.log(err);
            else await User.create({
                name,
                password: hash
            });
        });

        res.json({
            success: true,
            message:'User successfully inserted'
        });
        
    }catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        });
        
    }
};

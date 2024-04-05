const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
mongoose.connect('mongodb://localhost:27017/loginPrac')
.then(
    console.log("Connected")
).catch(
    console.log("Not Connected")
)

// mongoose.connect('mongodb://127.0.0.1:27017/loginPrac');
// mongoose.connection.on('connected', () => console.log('Connected'));
// mongoose.connection.on('error', () => console.log('Connection failed with - ',err));

const newSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

// newSchema.pre('insertMany',function (next) {
//     const user = this;
    

//     if(user.isModified('password')) {
//         console.log("egdg")
//         bcrypt.hash(this.password,8,(err,hash) => {
//             if(err) return next(err);

//             this.password = hash;
//             next();
//         });
//     }
// });

const collection = mongoose.model("logininfo",newSchema)

module.exports = collection 
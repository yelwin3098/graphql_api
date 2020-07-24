import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    carts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'cartItem'
        }
    ],
    createdAt:{
        type:Date,
        required:true,
        default:()=>Date.now()
    }
})

const User=mongoose.model('User',UserSchema);
export default User;
import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const cartItemSchema=new Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product',
    },
    quantity:{
        type:Number,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=>Date.now()
    }

})

const cartItem=mongoose.model('cartItem',cartItemSchema);
export default cartItem;
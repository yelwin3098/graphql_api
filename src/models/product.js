import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const ProductSchema=new Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
        trim:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=>Date.now()
    }

})

const Product=mongoose.model('Product',ProductSchema);
export default Product;
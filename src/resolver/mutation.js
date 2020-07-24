import bcrypt from 'bcryptjs';
import User from '../models/user';
import Product from '../models/product';
import CartItem from '../models/cartitem';

const Mutation={
    signup:async (parent,args,context,info) => {

        const email=args.email.trim().toLowerCase()

        const currentUsers=await User.find({})
        const isEmailExit=currentUsers.findIndex(user=> user.email === email ) > -1

        if(isEmailExit){
            throw new Error('Email already exits')
        }

        if(args.password.trim().length < 6){
            throw new Error ('Password must be at least 6 characters.')
        }
        const password=await bcrypt.hash(args.password, 10)
        return User.create({...args, email, password});
    },
    createProduct:async (parent,args,{userId},info) =>{

        // const userId="5f194c23099567295010eb43"

        //Check user is logged in
        if(!userId) throw new Error("Please login")

        if(!args.description || !args.price || !args.imageUrl){
            throw new Error('Pleas provide all requied fields.')
        }

        const product=await Product.create({...args,user:userId})
        const user=await User.findById(userId);

        if(!user.products){
            user.products=[product]
        }else{
            user.products.push(product);
        }
        await user.save();

        return Product.findById(product.id).populate({
            path:"user",
            populate:{path:"products"}
        })
    },
    updateProduct:async (parent,args,{userId},info) =>{
        const {id, description, price, imageUrl} =args;

        //TODO::Check user is logged in
        if(!userId) throw new Error("Please login")

        //Find product from database
         const product=await Product.findById(id);

         //Check if user is the owner of the products
        // const userId="5f191f0b2af4ad1820e308ae"

        if(userId !== product.user.toString()){
            throw new Error('You are not authorized.')
        }

        //form updated information
        const updateInfo={
            description: !!description ? description : product.description,
            price: !!price ? price : product.price,
            imageUrl: !!imageUrl ? imageUrl : product.imageUrl
        }
        //Update product in database

        await Product.findByIdAndUpdate(id,updateInfo)

        //find the updated prduct
        const updatedProduct = await Product.findById(id).populate({path:'user'})

        return updatedProduct

    },
    addToCart:async (parent,args,{userId},info) =>{
        //id-> product id

        const {id}=args;

        if(!userId) throw new Error("Please login")

        // const userId="5f191f0b2af4ad1820e308ae";

        try{
            //Check if the new addToCart item is laready in user.carts
            const user=await User.findById(userId).populate({
                path:"carts",
                populate:{path:"product"}
            })

            const findCartItemIndex=user.carts.findIndex(
                cartItem => cartItem.product.id === id
            )

            if(findCartItemIndex > -1){
   
            //A. The new AddtoCart item is already in cart
            //A1. Find the cartItem from database
                user.carts[findCartItemIndex].quantity +=1;

                await CartItem.findByIdAndUpdate(user.carts[findCartItemIndex].id,{
                    quantity:user.carts[findCartItemIndex].quantity
                })
                
                 //A2 Update quantity of that cartItem--->increase

                const updateCartItem=await CartItem.findById(user.carts[findCartItemIndex].id)
                                .populate({path:"product"})
                                .populate({path:"user"})

                return updateCartItem;
            }else{
                 //B. The new addToCart item is not in cart yet
                //B1 create new CartIrem 
                    const cartItem=await CartItem.create({
                        product:id,
                        quantity:1,
                        user:userId
                    })
                //Find newCart
                    const newCartItem=await CartItem.findById(cartItem.id)
                    .populate({path:"product"})
                    .populate({path:"user"})
                //B2 update user carts
                await User.findByIdAndUpdate(userId,{carts:[...user.carts,newCartItem]})

                return newCartItem;
            }

        }catch(err){
            console.log(err)
        }
    },
    deleteCart:async (parent,args,{userId},info) =>{
        const {id} =args

        //Find cart from given id
        const cart =await CartItem.findById(id)

        //TODO::Check user is logged in
        if(!userId) throw new Error("Please login")
        //Usr id from request --->find user
        // const userId="5f194c23099567295010eb43"

        const user=await User.findById(userId)

        //Check owneeship of the cart
        if(cart.user.toString() !== userId){
            throw new Error('Not authorized.')
        }

        //Delete cart
        const deletedCart=await CartItem.findByIdAndRemove(id)

        const updatedUserCarts=user.carts.filter(
            cartId=> cartId.toString() !== deletedCart.id.toString()
        )

        await User.findByIdAndUpdate(userId,{carts:updatedUserCarts})

        return deletedCart;
    }
}

export default Mutation;
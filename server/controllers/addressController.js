import Address from "../models/Address.js";

export const addAddress = async(req, res)=>{
    try {
        console.log("BODY RECEIVED:", req.body);
        await Address.create({
            userId: req.userId,  
            ...req.body
        });

        res.json({success: true, message: 'Address added successfully'})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message}); 
    }
}

export const getAddress = async(req, res)=>{
    try {
        const addresses = await Address.find({ userId: req.userId });
        res.json({success: true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message}); 
    }
}

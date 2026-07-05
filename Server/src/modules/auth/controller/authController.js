import {loginAdminService} from "../service/authService.js"

export const loginAdmin = async (req,res,next)=>{
    const response = await loginAdminService(req.body);
    res.status(200).json({
        success:true,
        message:"Admin logged in successfully",
        ...response
    })
}

export const getAdmin = async(req,res)=>{
 
    res.status(200).json({
        success:true,
        response:req.admin
    })
}
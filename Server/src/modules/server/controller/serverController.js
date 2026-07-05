import { getServerService,createServerService,getServerByIdService,updateServerService,deleteServerService} from "../service/serverService.js";

export const getServers = async(req,res)=>{
    const servers = await getServerService(req.admin.id);
    return res.status(200).json({
        success:true,
        servers
    })
}
export const createServers = async(req,res)=>{
    const response = await createServerService(req.body, req.admin.id);
    return res.status(201).json({
        success:true,
        data:response
    })

}
export const getServerById = async(req,res)=>{
    const server = await getServerByIdService(req.params.id,req.admin.id);
    return res.status(200).json({
        success:true,
        server
    })
}

export const updateServer = async(req,res)=>{
    
    const server = await updateServerService(req.params.id, req.body, req.admin.id);
    return res.status(200).json({
        success:true,
        server
    })
 
}
export const removeServer = async(req,res)=>{
    await deleteServerService(req.params.id, req.admin.id);
    res.status(204).send();
 
}


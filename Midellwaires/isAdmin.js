const isAdmin= (req,res,next)=>{
    if(res.user.role==='user'){
        return {
            message : 'must be admin'
        }
    }
next()
}
module.exports=isAdmin

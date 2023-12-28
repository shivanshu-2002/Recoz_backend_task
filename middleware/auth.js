exports.auth = async (req, res, next) => {
    try {
        //    Extract token 
        const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ", "");
        // if token is missing return response.
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            })
        }
        //    find out values from the token
        try {
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
           
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                 success:false,
                 message:"TOken is invalid"
            })
        }
        next();
    }
    catch (error)
    {
        console.log(error);
            return res.status(401).json({
                 success:false,
                 message:"TOken Verification failed"
            })
    }
}

// isInstructor
exports.isInstructor = async (req,res,next)=>{
    try{
      
     if(req.user.accountType!=='Instructor'){
        console.log(req.user.accoutType)
         return res.status(401).json({
             success:false,
             message:"This is protected Route for the Instructors"
         })
     }
     next();

    } catch(error){
     console.log(error);
     return res.status(500).json({
         success:false,
         message:"User Role Can not be verified please try again!"
     })
    }
}

// isStudent

exports.isStudent = async (req,res,next)=>{
    try{
     if(req.user.accountType!=='Student'){
         return res.status(401).json({
             success:false,
             message:"This is protected Route for the students"
         })
     }
     next();

    } catch(error){
     console.log(error);
     return res.status(500).json({
         success:false,
         message:"User Role Can not be verified please try again!"
     })
    }
}
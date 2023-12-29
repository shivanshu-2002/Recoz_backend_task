const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body or header
		console.log(req.cookies.token);
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			// Verifying the JWT using the secret key stored in environment variables
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};

// isInstructor
exports.isInstructor = async (req,res,next)=>{
    try{
      
     if(req.user.role!=='Instructor'){
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
     if(req.user.role!=='Student'){
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
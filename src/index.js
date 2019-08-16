require('dotenv/config')

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
var db = require('./database.js');
const crypto = require("crypto");
var mailService = require('./mailService.js');
const path = require('path');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Instantiating the express app
const app = express();
// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Instantiating the express-jwt middleware
const jwtMW = exjwt({
	secret: process.env.APP_TOKEN_ADMIN_SECRET
});

/////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANT LIST

const ADMIN_SECRET = process.env.APP_TOKEN_ADMIN_SECRET;
const USER_SECRET = process.env.APP_TOKEN_USER_SECRET;
// Initialize Cipher Option
const ALGORITHM = 'aes-192-cbc';
const SECRET_CIPHER = 'safe-t_dijalan';
const CIPHER_SALT = '4Ld1_1337';
const CIPHER_KEY = crypto.scryptSync(SECRET_CIPHER, CIPHER_SALT, 24);
const CIPHER_IV = Buffer.alloc(16, 0); // Initialization vector.
const CIPHER_BASE = 'base64';
// Initialize Hash Option
const HASH_ALGORITHM = 'sha256';

/////////////////////////////////////////////////////////////////////////////////////////////
// Multer for File Handling in AWS

aws.config.update({
	accessKeyId: process.env.APP_AWS_ACCESS_KEY,
	secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
	region: process.env.APP_AWS_REGION
})

const s3 = new aws.S3();

const storageAdminsAWS = multerS3({
	s3: s3,
	bucket: process.env.APP_AWS_BUCKET + '/admins',
	contentType: multerS3.AUTO_CONTENT_TYPE,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: "Safe-T Admin ID" });
	},
	key: function (req, file, cb) {
		cb(null, Date.now().toString())
	}
})

const storagetTicketsAWS = multerS3({
	s3: s3,
	bucket: process.env.APP_AWS_BUCKET + '/tickets',
	contentType: multerS3.AUTO_CONTENT_TYPE,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: "Safe-T Ticket" });
	},
	key: function (req, file, cb) {
		cb(null, Date.now().toString())
	}
})

const storageUsersAWS = multerS3({
	s3: s3,
	bucket: process.env.APP_AWS_BUCKET + '/users',
	contentType: multerS3.AUTO_CONTENT_TYPE,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: "Safe-T User ID" });
	},
	key: function (req, file, cb) {
		cb(null, Date.now().toString())
	}
})

function fileFilter(req, file, cb) {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb({ message: 'Only for image (jpg/jpeg/png).' }, false);
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Multer for File Handling in Local

const storageAdmin = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/image/admin/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
	}
})

const storageUser = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/image/user/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
	}
})

const storageVehicle = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/image/vehicle/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
	}
})

const storageTicket = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/image/ticket/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
	}
})

function fileFilter(req, file, cb) {
	if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb({ message: 'Only for image (jpg/jpeg/png).' }, false);
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////
// LOGIN ROUTE

app.post('/api/loginAdmin', (req, res) => {
	const { email } = req.body;
	console.log("loginAdmin")

	const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);

	db.cekLoginAdmin(email, password, function (err, data) {
		if (data.length === 1 && (data[0].status === "2" || data[0].status === "3")) {
			//If all credentials are correct do this
			let token = jwt.sign({
				id: data[0].id,
				name: data[0].name,
				email: data[0].email,
				phone: data[0].phone,
				citizen_id: data[0].citizen_id,
				captured_id: data[0].captured_id,
				gender: data[0].gender,
				address: data[0].address,
				status: data[0].status,
				created: data[0].created,
				updated: data[0].updated,
				user_type: "Admin"
			}, ADMIN_SECRET, { expiresIn: 43210 }); // Sigining the token
			res.json({
				success: true,
				err: null,
				token
			});
		}
		else if (data.length === 1 && data[0].status === "1") {
			res.json({
				success: false,
				token: null,
				err: 'User is not validated by Admin'
			});
		}
		else if (data.length === 1 && data[0].status === "0") {
			res.json({
				success: false,
				token: null,
				err: 'Email is not verified'
			});
		}
		else {
			res.json({
				success: false,
				token: null,
				err: 'Username or password is incorrect'
			});
		}
	});
});

app.post('/api/loginUser', (req, res) => {
	const { email } = req.body;
	console.log("loginUser")

	const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);

	db.cekLoginUser(email, password, function (err, data) {
		if (data.length === 1 && data[0].status === "2") {
			//If all credentials are correct do this
			let token = jwt.sign({
				id: data[0].id,
				name: data[0].name,
				email: data[0].email,
				phone: data[0].phone,
				citizen_id: data[0].citizen_id,
				captured_id: data[0].captured_id,
				gender: data[0].gender,
				address: data[0].address,
				status: data[0].status,
				created: data[0].created,
				updated: data[0].updated,
				user_type: "User"
			}, USER_SECRET, { expiresIn: 43210 }); // Sigining the token
			res.json({
				success: true,
				err: null,
				token
			});
		}
		else if (data.length === 1 && data[0].status === "1") {
			res.json({
				success: false,
				token: null,
				err: 'User is not validated by Admin'
			});
		}
		else if (data.length === 1 && data[0].status === "0") {
			res.json({
				success: false,
				token: null,
				err: 'Email is not verified'
			});
		}
		else {
			res.json({
				success: false,
				token: null,
				err: 'Username or password is incorrect'
			});
		}
	});
});

app.get('/api/', jwtMW /* Using the express jwt MW here */, (req, res) => {
	res.send({ message: 'You are authenticated' }); //Sending some response when authenticated
});

/////////////////////////////////////////////////////////////////////////////////////////////
// API User

app.get('/api/user', jwtMW, (req, res) => {
	db.getUserAll(req.body, res);
})

app.get('/api/user/:id', (req, res) => {
	db.getUser(req.params, res);
})

app.get('/api/user/status/:id', jwtMW, (req, res) => {
	db.getUserStatus(req.params, res);
})

app.post('/api/user', (req, res) => {
	if (process.env.NODE_ENV === "development") {
		var upload = multer({
			storage: storageUser,
			limits: {
				fileSize: 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	} else {
		var upload = multer({
			storage: storageUsersAWS,
			limits: {
				fileSize: 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	}
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			res.send(err);
			return
		} else if (err) {
			// An unknown error occurred when uploading.
			res.send(err);
			return
		} else if (req.file == undefined) {
			res.send('index', { message: 'No file selected!' })
			return
		}
		// Everything went fine.
		console.log('Upload success.');

		// var mykey = crypto.createCipher('aes-128-cbc', SECRET_CIPHER);
		// var password = mykey.update(req.body.password, 'utf8', 'hex')
		// password += mykey.final('hex');

		const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);
		const token = crypto.randomBytes(16).toString('hex');
		req.body.captured_id = req.file.key || req.file.filename;
		req.body.token = token;

		db.newUser(req.body, password, res);
	})
})

app.put('/api/user/:id', jwtMW, (req, res) => {
	db.updateUser(req.body, res);
})

app.delete('/api/user/:id', jwtMW, (req, res) => {
	db.deactivateUser(req.params, res);
})

app.delete('/api/user/ever/:id', jwtMW, (req, res) => {
	db.deleteUser(req.params, res);
})

app.delete('/api/user/all/ever', jwtMW, (req, res) => {
	console.log('deleteUserAll')
	db.deleteUserAll(req.params, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API Admin

app.get('/api/admin', jwtMW, (req, res) => {
	db.getAdminAll(req.body, res);
})

app.get('/api/admin/:id', jwtMW, (req, res) => {
	db.getAdmin(req.params, res);
})

app.get('/api/admin/status/:id', jwtMW, (req, res) => {
	db.getAdminStatus(req.params, res);
})

app.post('/api/admin', (req, res) => {
	if (process.env.NODE_ENV === "development") {
		var upload = multer({
			storage: storageAdmin,
			limits: {
				fileSize: 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	} else {
		var upload = multer({
			storage: storageAdminsAWS,
			limits: {
				fileSize: 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	}
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			res.send(err);
			return
		} else if (err) {
			// An unknown error occurred when uploading.
			res.send(err);
			return
		} else if (req.file == undefined) {
			res.send('index', { message: 'No file selected!' })
			return
		}
		// Everything went fine.
		console.log('Upload success.');

		// var mykey = crypto.createCipher('aes-128-cbc', SECRET_CIPHER);
		// var password = mykey.update(req.body.password, 'utf8', 'hex')
		// password += mykey.final('hex');

		const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);
		const token = crypto.randomBytes(16).toString('hex');
		req.body.captured_id = req.file.key || req.file.filename;
		req.body.token = token;

		db.newAdmin(req.body, password, res);
	})
})

app.put('/api/admin/:id', jwtMW, (req, res) => {
	db.updateAdmin(req, res);
})

app.delete('/api/admin/:id', jwtMW, (req, res) => {
	db.deactivateAdmin(req, res);
})

app.delete('/api/admin/ever/:id', jwtMW, (req, res) => {
	db.deleteAdmin(req, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API Kendaraan

app.get('/api/vehicle', (req, res) => {
	db.getVehicleAll(req.body, res);
})

app.get('/api/vehicle/:id', (req, res) => {
	db.getVehicle(req.params, res);
})

app.post('/api/vehicle', jwtMW, (req, res) => {
	db.newVehicle(req, res);
})

app.put('/api/vehicle/:id', jwtMW, (req, res) => {
	db.updateVehicle(req, res);
})

app.delete('/api/vehicle/:id', jwtMW, (req, res) => {
	db.deleteVehicle(req, res);
})

app.delete('/api/vehicle/all/ever', jwtMW, (req, res) => {
	db.deleteVehicleAll(req, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API Pelanggaran

app.get('/api/ticket', jwtMW, (req, res) => {
	db.getTicketAll(req.body, res);
})

app.get('/api/ticket/:id', (req, res) => {
	db.getTicket(req.params, res);
})

app.get('/api/ticket/status/:id', jwtMW, (req, res) => {
	db.getTicketStatus(req.params, res);
})

app.get('/api/ticket/user/:id', (req, res) => {
	db.getUserTicket(req.params, res);
})

app.post('/api/ticket', (req, res) => {
	if (process.env.NODE_ENV === "development") {
		var upload = multer({
			storage: storageTicket,
			limits: {
				fileSize: 5 * 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	} else {
		var upload = multer({
			storage: storagetTicketsAWS,
			limits: {
				fileSize: 5 * 1024 * 1024
			},
			fileFilter: fileFilter
		}).single('fileImage');
	}
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			res.send(err);
			return
		} else if (err) {
			// An unknown error occurred when uploading.
			res.send(err);
			return
		} else if (req.file == undefined) {
			res.send('index', { message: 'No file selected!' })
			return
		}
		// Everything went fine.
		console.log('Upload success.');

		req.body.documentation = req.file.key || req.file.filename;

		db.newTicket(req.body, res);
	})
})

app.put('/api/ticket/:id', jwtMW, (req, res) => {
	db.updateTicket(req, res);
})

app.put('/api/ticket/close/:id', jwtMW, (req, res) => {
	db.closeTicket(req.params, res);
})

app.delete('/api/ticket/:id', jwtMW, (req, res) => {
	db.deactivateTicket(req.params, res);
})

app.delete('/api/ticket/ever/:id', jwtMW, (req, res) => {
	db.deleteTicket(req.params, res);
})

app.delete('/api/ticket/all/ever', jwtMW, (req, res) => {
	db.deleteTicketAll(req.params, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API Point

app.get('/api/point', (req, res) => {
	db.getPointAll(req.body, res);
})

app.get('/api/point/:id', (req, res) => {
	db.getPoint(req.params, res);
})

app.get('/api/point/user/:id', (req, res) => {
	db.getUserPoint(req.params, res);
})

app.post('/api/point', jwtMW, (req, res) => {
	// FOR FURTHER DEVELOPMENT
	// const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, CIPHER_IV);
	// let point = cipher.update(req.body.point, 'utf8', 'hex');
	// point += cipher.final('hex');

	const point = req.body.point;
	db.newPoint(req, point, res);
})

app.put('/api/point/:uid', jwtMW, (req, res) => {
	// FOR FURTHER DEVELOPMENT
	// const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, CIPHER_IV);
	// let point = cipher.update(req.body.point, 'utf8', 'hex');
	// point += cipher.final('hex');

	const point = req.body.point;
	db.updatePoint(req.params, point, res);
})

app.delete('/api/point/:uid', jwtMW, (req, res) => {
	db.deletePoint(req.params, res);
})

app.delete('/api/point/all/ever', jwtMW, (req, res) => {
	db.deletePointAll(req.params, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API History

app.get('/api/history', (req, res) => {
	db.getHistoryAll(req.body, res);
})

app.get('/api/history/:id', (req, res) => {
	db.getHistory(req.params, res);
})

app.get('/api/history/from/:id', (req, res) => {
	db.getFromHistory(req.params, res);
})

app.get('/api/history/to/:id', (req, res) => {
	db.getToHistory(req.params, res);
})

app.get('/api/history/ticket/:id', (req, res) => {
	db.getTicketHistory(req.params, res);
})

app.post('/api/history', (req, res) => {
	db.newHistory(req.body, res);
})

app.put('/api/history/:id', jwtMW, (req, res) => {
	db.updateHistory(req, res);
})

app.delete('/api/history/ticket/:id', jwtMW, (req, res) => {
	db.deleteTicketHistory(req.params, res);
})

app.delete('/api/history/all/ever', jwtMW, (req, res) => {
	db.deleteHistoryAll(req.params, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API Get Image

if (process.env.NODE_ENV === "development") {
	app.use('/api/image', express.static(path.join(__dirname, 'image')));
} else {
	app.get('/api/image/admin/:imageID', (req, res) => {
		var params = {
			Bucket: process.env.APP_AWS_BUCKET + '/admins',
			Key: req.params.imageID
		};
		s3.getObject(params, function (err, data) {
			if (err) {
				res.send({
					message: err.message,
					statusCode: err.statusCode
				});
				console.log(err);
				return
			}
			res.writeHead(200, { 'Content-Type': data.ContentType });
			res.write(data.Body, 'binary');
			res.end(null, 'binary');
		});
	})

	app.get('/api/image/ticket/:imageID', (req, res) => {
		var params = {
			Bucket: process.env.APP_AWS_BUCKET + '/tickets',
			Key: req.params.imageID
		};
		s3.getObject(params, function (err, data) {
			if (err) {
				res.send({
					message: err.message,
					statusCode: err.statusCode
				});
				console.log(err);
				return
			}
			res.writeHead(200, { 'Content-Type': data.ContentType });
			res.write(data.Body, 'binary');
			res.end(null, 'binary');
		});
	})

	app.get('/api/image/user/:imageID', (req, res) => {
		var params = {
			Bucket: process.env.APP_AWS_BUCKET + '/users',
			Key: req.params.imageID
		};
		s3.getObject(params, function (err, data) {
			if (err) {
				res.send({
					message: err.message,
					statusCode: err.statusCode
				});
				console.log(err);
				return
			}
			res.writeHead(200, { 'Content-Type': data.ContentType });
			res.write(data.Body, 'binary');
			res.end(null, 'binary');
		});
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Forgot and Reset Password

app.post('/api/forgot-password', (req, res) => {
	const token = crypto.randomBytes(16).toString('hex');
	db.forgotPassword(req.body, res, token);
})

app.post('/api/forgot-password-admin', (req, res) => {
	const token = crypto.randomBytes(16).toString('hex');
	db.forgotPassword_Admin(req.body, res, token);
})

app.get('/api/forgot-password/get-token/:token', (req, res) => {
	db.forgotPassword_getToken(req.params, res);
})

app.put('/api/forgot-password/edit-password', (req, res) => {
	const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);
	db.forgotPassword_editPassword(req.body, password, res);
})

app.put('/api/forgot-password/edit-password-admin', (req, res) => {
	const password = crypto.createHmac(HASH_ALGORITHM, SECRET_CIPHER).update(req.body.password).digest(CIPHER_BASE);
	db.forgotPassword_Admin_editPassword(req.body, password, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// API List

app.post('/api/check-admin-registered', (req, res) => {
	db.checkAdminRegistered(req.body, res);
})

app.post('/api/check-user-registered', (req, res) => {
	db.checkUserRegistered(req.body, res);
})

app.put('/api/admin/set-privilege/:id', (req, res) => {
	db.setAdminPrivilege(req, res);
})

app.get('/api/user/verify/:id', (req, res) => {
	db.checkVerified(req.params, res);
})

app.put('/api/user/verify/:id', jwtMW, (req, res) => {
	db.verifyUser(req.params, res);
})

app.post('/api/user/verify-token', (req, res) => {
	db.verifyToken(req.body, res);
})

app.delete('/api/token/verification/all', (req, res) => {
	db.deleteVerificationToken(req.params, res);
})

app.delete('/api/token/reset-password/all', (req, res) => {
	db.deleteResetPasswordToken(req.params, res);
})

app.delete('/api/token/inactive/all', (req, res) => {
	db.deleteInactiveToken(req.params, res);
})

/////////////////////////////////////////////////////////////////////////////////////////////
// Test only

// app.post('/api/user/verify/send-mail', (req, res) => {
// 	const token = crypto.randomBytes(16).toString('hex');
// 	mailService.sendVerification(req.body.email, req.body.name, token);
// })

// UPLOAD FILE
// app.post('/api/upload/tickets', (req, res) => {
// 	var upload = multer({
// 		storage: storagetTicketsAWS,
// 		limits: {
// 			fileSize: 1024 * 1024
// 		},
// 		fileFilter: fileFilter
// 	}).single('fileImage');
// 	upload(req, res, function (err) {
// 		if (err instanceof multer.MulterError) {
// 			// A Multer error occurred when uploading.
// 			res.send(err);
// 			return
// 		} else if (err) {
// 			// An unknown error occurred when uploading.
// 			res.send(err);
// 			return
// 		}
// 		// Everything went fine.
// 		res.status(200).send({
// 			message: "upload success.",
// 			imageUrl: req.file.location,
// 			file: req.file
// 		});
// 	})
// 	console.log(req.body);
// })

// Error handling 
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
		res.status(401).send(err);
	}
	else {
		next(err);
	}
});

app.get('/', (req, res) => {
	res.redirect('https://safe-t.netlify.com');
});

// Starting the app on PORT 3000
const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
	// eslint-disable-next-line
	console.log(`Magic happens on port ${PORT}`);
});

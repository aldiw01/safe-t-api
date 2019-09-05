const express = require('express');
const bodyParser = require('body-parser');
var mailService = require('./mailService.js');
const Client = require('mariasql');
const c = new Client({
	host: process.env.APP_DATABASE_HOST,
	user: process.env.APP_DATABASE_USER,
	password: process.env.APP_DATABASE_PASSWORD,
	db: process.env.APP_DATABASE_DB
});

module.exports = {

	cekLoginAdmin: function (email, pass, callback) {
		var req = [email, pass];
		c.query("SELECT * FROM `data_user` WHERE `email`=? AND `password`=? AND id LIKE 'A%'", req, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			if (rows.info.numRows !== '0') {
				rows.forEach(function (items) {
					data.push({
						id: items[0],
						name: items[2],
						email: items[3],
						phone: items[4],
						citizen_id: items[5],
						captured_id: items[6],
						gender: items[7],
						address: items[8],
						status: items[9],
						created: items[10],
						updated: items[11]
					});
				});
			}
			callback(err, data);
		});
		c.end();
	},
	cekLoginUser: function (email, pass, callback) {
		var req = [email, pass];
		c.query("SELECT * FROM data_user WHERE email=? AND password=? AND id LIKE 'U%'", req, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			if (rows.info.numRows !== '0') {
				rows.forEach(function (items) {
					data.push({
						id: items[0],
						name: items[2],
						email: items[3],
						phone: items[4],
						citizen_id: items[5],
						captured_id: items[6],
						gender: items[7],
						address: items[8],
						status: items[9],
						created: items[10],
						updated: items[11]
					});
				});
			}
			callback(err, data);
		});
		c.end();
	},
	verifyToken: function (req, res) {
		const waktu = new Date().toISOString();
		c.query("SELECT `email`, `status` FROM `verification_token` WHERE `token`=? AND (`status`=0 OR `status`=2)", [req.token], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.numRows !== '0') {
				rows.forEach(function (items) {
					if (items[1] === '2') {
						c.query("UPDATE `verification_token` SET `status`='3', `updated`=? WHERE `token`=?", [waktu, req.token], { metadata: true, useArray: true }, function (err, rows) {
							if (err) {
								res.status(500).send({ message: "Error 500: Internal Server Error" });
								console.log(err);
								return
							}
						});
						c.query("UPDATE `data_user` SET status='1', `updated`=? WHERE `email`=? AND `id` LIKE 'A%'", [waktu, items[0]], { metadata: true, useArray: true }, function (err, rows) {
							if (err) {
								res.status(500).send({ message: "Error 500: Internal Server Error" });
								console.log(err);
								return
							}

							res.json({
								success: true,
								err: null,
								message: "Thank you for verifying your email. Please wait until our staff validate your data."
							});
						});
					} else {
						c.query("UPDATE `verification_token` SET `status`='1', `updated`=? WHERE `token`=?", [waktu, req.token], { metadata: true, useArray: true }, function (err, rows) {
							if (err) {
								res.status(500).send({ message: "Error 500: Internal Server Error" });
								console.log(err);
								return
							}
						});
						c.query("UPDATE `data_user` SET status='1', `updated`=? WHERE `email`=? AND `id` LIKE 'U%'", [waktu, items[0]], { metadata: true, useArray: true }, function (err, rows) {
							if (err) {
								res.status(500).send({ message: "Error 500: Internal Server Error" });
								console.log(err);
								return
							}

							res.json({
								success: true,
								err: null,
								message: "Thank you for verifying your email. Please wait until our staff validate your data."
							});
						});
					}
				});
			} else {
				res.json({
					success: false,
					err: null,
					message: "Invalid token!"
				});
			}
		});
		c.end();
	},
	verifyUser: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.id, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `data_point` (`user_id`, `point`, `created`, `updated`) VALUES (?, 0, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});
		c.query("UPDATE `data_user` SET `status`='2', `updated`=? WHERE `id`=? AND `id` LIKE 'U%'", [waktu, req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "User has verified successfully",
				success: true
			});
		});
		c.end();
	},
	checkVerified: function (req, res) {
		c.query("SELECT `status` FROM `data_user` WHERE `id`=? AND `status`=1", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.numRows !== '0') {
				res.json({
					success: true,
					err: null,
					message: "User was already verified"
				});
			} else {
				res.json({
					success: false,
					err: null,
					message: "User is not verified"
				});
			}
		});
		c.end();
	},
	forgotPassword(req, res, token) {
		const expired = new Date().valueOf() + 3 * 60 * 60 * 1000;
		const waktu = new Date().toISOString()
		var request = [req.email, token, expired, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("SELECT `name` FROM `data_user` WHERE `email`=? AND `id` LIKE 'U%'", [req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					name: items[0]
				});
			});
			if (data.length < 1) {
				res.send({
					message: "User is not registered",
					success: false
				});
			} else {
				c.query("INSERT INTO `reset_password` (`email`, `token`, `expired`, `status`, `created`, `updated`) VALUES (?, ?, ?, 0, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
					if (err) {
						res.status(500).send({ message: "Error 500: Internal Server Error" });
						console.log(err);
						return
					}

					mailService.sendResetPassword(req.email, data[0].name, token, res);
				});
			}
		});
		c.end();
	},
	forgotPassword_Admin(req, res, token) {
		const expired = new Date().valueOf() + 3 * 60 * 60 * 1000;
		const waktu = new Date().toISOString();
		var request = [req.email, token, expired, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("SELECT `name` FROM `data_user` WHERE `email`=? AND `id` LIKE 'A%'", [req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					name: items[0]
				});
			});
			if (data.length < 1) {
				res.send({
					message: "User not registered",
					success: false
				});
			} else {
				c.query("INSERT INTO `reset_password` (`email`, `token`, `expired`, `status`, `created`, `updated`) VALUES (?, ?, ?, 2, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
					if (err)
						throw err;

					mailService.sendResetPassword(req.email, data[0].name, token, res);
				});
			}
		});
		c.end();
	},
	forgotPassword_getToken(req, res) {
		c.query("SELECT `email`, `expired`, `status` FROM `reset_password` WHERE `token`=? AND (`status`=0 OR `status`=2)", [req.token], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					email: items[0],
					expired: items[1],
					status: items[2]
				});
			});
			if (data.length < 1) {
				res.json({
					message: "Token not found",
					success: false,
					err: null,
					affectedRows: rows.info.affectedRows
				});
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	forgotPassword_editPassword: function (req, password, res) {
		const waktu = new Date().toISOString();
		c.query("UPDATE `data_user` SET `password`=?, `updated`=? WHERE `email`=? AND `id` LIKE 'U%'", [password, waktu, req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
			res.json({
				message: "Your password has changed successfully",
				success: true,
				affectedRows: rows.info.affectedRows
			});
		});
		c.query("UPDATE `reset_password` SET `status`=1, `updated`=? WHERE `token`=?", [waktu, req.token], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});

		c.end();
	},
	forgotPassword_Admin_editPassword: function (req, password, res) {
		const waktu = new Date().toISOString();
		c.query("UPDATE `data_user` SET `password`=?, `updated`=? WHERE `email`=? AND `id` LIKE 'A%'", [password, waktu, req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
			res.json({
				message: "Your password has changed successfully",
				success: true,
				affectedRows: rows.info.affectedRows
			});
		});
		c.query("UPDATE `reset_password` SET `status`=3, `updated`=? WHERE `token`=?", [waktu, req.token], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});

		c.end();
	},
	checkAdminRegistered: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE `email`=? AND `id` LIKE 'A%'", [req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.numRows !== '0') {
				res.json({
					success: true,
					err: null,
					message: "email already registered"
				});
			} else {
				res.json({
					success: false,
					err: null,
					message: "email not registered"
				});
			}
		});
		c.end();
	},
	checkUserRegistered: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE `email`=? AND `id` LIKE 'U%'", [req.email], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.numRows !== '0') {
				res.json({
					success: true,
					err: null,
					message: "email already registered"
				});
			} else {
				res.json({
					success: false,
					err: null,
					message: "email not registered"
				});
			}
		});
		c.end();
	},
	getUserAll: function (req, res) {
		c.query("SELECT * FROM `data_user` AND `id` LIKE 'U%' ORDER BY `created` DESC", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getUserStatus: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE status=? AND `id` LIKE 'U%' ORDER BY `created` DESC", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getUser: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE id=? `id` LIKE 'U%'", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newUser: function (req, password, res) {
		const waktu = new Date().toISOString();
		var request = ['U' + new Date(waktu).valueOf().toString(32).toUpperCase(), password, req.name, req.email, req.phone, req.citizen_id, req.captured_id, req.gender, req.address, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `verification_token`(`email`, `token`, `status`, `created`, `updated`) VALUES (?, ?, '0', ?, ?)", [req.email, req.token, waktu, waktu], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			mailService.sendVerification(req.email, req.name, req.token);
		});
		c.query("INSERT INTO `data_user`(`id`, `password`, `name`, `email`, `phone`, `citizen_id`, `captured_id`, `gender`, `address`, `status`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '0', ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "User has registered successfully",
				success: true
			});
		});
		c.end();
	},
	updateUser: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.name, req.email, req.phone, req.citizen_id, req.captured_id, req.gender, req.address, waktu, req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_user` SET `name`=?,`email`=?,`phone`=?,`citizen_id`=?,`captured_id`=?,`gender`=?,`address`=?, `updated`=? WHERE `id`=? AND `id` LIKE 'U%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "User has updated successfully",
				success: true
			});
		});
		c.end();
	},
	deactivateUser: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [waktu, req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_user` SET `status`='9', `updated`=? WHERE `id`=? AND `id` LIKE 'U%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					err: null,
					message: "User has deactivate successfully",
					success: true
				});
			}
		});
		c.end();
	},
	deleteUser: function (req, res) {
		var request = [req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("DELETE FROM `data_point` WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});
		c.query("DELETE FROM `data_user` WHERE `id`=? AND `id` LIKE 'U%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					err: null,
					message: "User has deleted successfully",
					success: true
				});
			}
		});
		c.end();
	},
	deleteUserAll: function (req, res) {
		c.query("DELETE FROM `data_point`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});
		c.query("DELETE FROM `data_user` WHERE `id` LIKE 'U%'", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
			console.log(rows.info)
			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					message: "All User has deleted successfully :[",
					success: true
				});
			}
		});
		c.end();
	},
	getAdminAll: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE `id` LIKE 'A%' ORDER BY `id`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getAdmin: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE `id`=? AND `id` LIKE 'A%'", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getAdminStatus: function (req, res) {
		c.query("SELECT * FROM `data_user` WHERE `status`=? AND `id` LIKE 'A%'", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					name: items[2],
					email: items[3],
					phone: items[4],
					citizen_id: items[5],
					captured_id: items[6],
					gender: items[7],
					address: items[8],
					status: items[9],
					created: items[10],
					updated: items[11]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newAdmin: function (req, password, res) {
		const waktu = new Date().toISOString();
		var request = ['A' + new Date(waktu).valueOf().toString(32).toUpperCase(), password, req.name, req.email, req.phone, req.citizen_id, req.captured_id, req.gender, req.address, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `verification_token`(`email`, `token`, `status`, `created`, `updated`) VALUES (?, ?, '2', ?, ?)", [req.email, req.token, waktu, waktu], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			mailService.sendVerification(req.email, req.name, req.token);
		});
		c.query("INSERT INTO `data_user` (`id`, `password`, `name`, `email`, `phone`, `citizen_id`, `captured_id`, `gender`, `address`, `status`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '0', ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Admin has registered successfully",
				success: true
			});
		});
		c.end();
	},
	deactivateAdmin: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [waktu, req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_user` SET `status`='9', `updated`=? WHERE `id`=? AND `id` LIKE 'A%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					err: null,
					message: "User has deactivate successfully",
					success: true
				});
			}
		});
		c.end();
	},
	deleteAdmin: function (req, res) {
		var request = [req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("DELETE FROM `data_user` WHERE `id`=? AND `id` LIKE 'A%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					err: null,
					message: "Admin has deleted successfully",
					success: true
				});
			}
		});
		c.end();
	},
	getVehicleAll: function (req, res) {
		c.query('SELECT * FROM `data_kendaraan` ORDER BY `id`', null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					owner: items[1],
					brand: items[2],
					type: items[3],
					build_year: items[4],
					color: items[5],
					documentation: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getVehicle: function (req, res) {
		var request = [req.id];
		c.query("SELECT * FROM `data_kendaraan` WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					owner: items[1],
					brand: items[2],
					type: items[3],
					build_year: items[4],
					color: items[5],
					documentation: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newVehicle: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.id.toUpperCase(), req.owner, req.brand, req.type, req.build_year, req.color, req.documentation, waktu, waktu]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `data_kendaraan` (`id`, `owner`, `brand`, `type`, `build_year`, `color`, `documentation`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.send({
					message: err.message,
					err: err
				});
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Vehicle has recorded successfully",
				success: true
			});
		});
		c.end();
	},
	updateVehicleData: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.id, req.body.owner, req.body.brand, req.body.type, req.body.build_year, req.body.color, waktu, req.params.id]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_kendaraan` SET `id`=?,`owner`=?, `brand`=?, `type`=?, `build_year`=?, `color`=?, `updated`=? WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Vehicle has updated successfully",
				success: true
			});
		});
		c.end();
	},
	updateVehicleDataImg: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.id, req.body.owner, req.body.brand, req.body.type, req.body.build_year, req.body.color, req.body.documentation, waktu, req.params.id]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_kendaraan` SET `id`=?,`owner`=?, `brand`=?, `type`=?, `build_year`=?, `color`=?, `documentation`=?, `updated`=? WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Vehicle has updated successfully",
				success: true
			});
		});
		c.end();
	},
	deleteVehicle: function (req, res) {
		c.query("DELETE FROM `data_kendaraan` WHERE `id`=?", [req.params.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Vehicle has deleted successfully",
				success: true
			});
		});
		c.end();
	},
	deleteVehicleAll: function (req, res) {
		c.query("DELETE FROM `data_kendaraan`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "All Vehicle has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	getTicketAll: function (req, res) {
		// c.query("SELECT t1.id,t2.name AS reporter,t3.owner AS violator,t3.vehicle_id,t4.type AS violation_type,t1.detail,t1.incident_date,t1.documentation,t1.status,t1.created,t1.updated FROM data_pelanggaran t1 LEFT JOIN (data_user t2, data_kendaraan t3, violation_list t4) ON (t2.id=t1.reporter_id AND t3.id=t1.vehicle_id AND t4.id=t1.violation_type)", null, { metadata: true, useArray: true }, function (err, rows) {
		c.query('SELECT * FROM `data_pelanggaran` ORDER BY `created` DESC', null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					reporter_id: items[1],
					vehicle_id: items[2],
					violation_type: items[3],
					detail: items[4],
					incident_date: items[5],
					documentation: items[6],
					status: items[7],
					created: items[8],
					updated: items[9]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getTicket: function (req, res) {
		// c.query("SELECT t1.id,t2.name AS reporter,t3.owner AS violator,t3.vehicle_id,t4.type AS violation_type,t1.detail,t1.incident_date,t1.documentation,t1.status,t1.created,t1.updated FROM data_pelanggaran t1 LEFT JOIN (data_user t2, data_kendaraan t3, violation_list t4) ON (t2.id=t1.reporter_id AND t3.id=t1.vehicle_id AND t4.id=t1.violation_type) WHERE t1.id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
		c.query("SELECT * FROM `data_pelanggaran` WHERE `id`=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					reporter_id: items[1],
					vehicle_id: items[2],
					violation_type: items[3],
					detail: items[4],
					incident_date: items[5],
					documentation: items[6],
					status: items[7],
					created: items[8],
					updated: items[9]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getTicketStatus: function (req, res) {
		var request = [req.id]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query('SELECT * FROM `data_pelanggaran` WHERE `status`=? ORDER BY `created` DESC', request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					reporter_id: items[1],
					vehicle_id: items[2],
					violation_type: items[3],
					detail: items[4],
					incident_date: items[5],
					documentation: items[6],
					status: items[7],
					created: items[8],
					updated: items[9]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getUserTicket: function (req, res) {
		c.query("SELECT * FROM `data_pelanggaran` WHERE reporter_id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					reporter_id: items[1],
					vehicle_id: items[2],
					violation_type: items[3],
					detail: items[4],
					incident_date: items[5],
					documentation: items[6],
					status: items[7],
					created: items[8],
					updated: items[9]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newTicket: function (req, res) {
		const waktu = new Date().toISOString();
		const ticket_id = 'T' + new Date(waktu).valueOf().toString(32).toUpperCase();
		var request = [ticket_id, req.reporter_id, req.vehicle_id, req.violation_type, req.detail, req.incident_date, req.documentation, waktu, waktu]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `data_pelanggaran` (`id`, `reporter_id`, `vehicle_id`, `violation_type`, `detail`, `incident_date`, `documentation`, `status`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			// Write ticket history
			var request = [
				ticket_id,
				req.reporter_id,
				"A",
				"telah mengajukan tiket",
				"",
				waktu,
				waktu
			]
			if (request.includes(undefined)) {
				res.send({ message: 'Bad Request: Parameters cannot empty.' });
				return
			}
			c.query("INSERT INTO `history` (`ticket_id`, `from_id`, `to_id`, `info`, `message`, `status`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, 0, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
				if (err) {
					res.status(500).send({ message: "Error 500: Internal Server Error" });
					console.log(err);
					return
				}
			});

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Ticket has recorded successfully",
				success: true
			});
		});
		c.end();
	},
	updateTicket: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.reporter_id, req.body.vehicle_id, req.body.violation_type, req.body.detail, req.body.incident_date, waktu, req.params.id]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_pelanggaran` SET `reporter_id`=?, `vehicle_id`=?, `violation_type`=?, `detail`=?, `incident_date`=?, `updated`=? WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				success: true,
				err: null,
				message: "Ticket has updated successfully",
				affectedRows: rows.info.affectedRows
			});
		});
		c.end();
	},
	closeTicket: function (req, res) {
		const waktu = new Date().toISOString();
		// c.query("SELECT t1.id,t2.name AS reporter,t3.owner AS violator,t3.vehicle_id,t4.type AS violation_type,t1.detail,t1.incident_date,t1.documentation,t1.status,t1.created,t1.updated FROM data_pelanggaran t1 LEFT JOIN (data_user t2, data_kendaraan t3, violation_list t4) ON (t2.id=t1.reporter_id AND t3.id=t1.vehicle_id AND t4.id=t1.violation_type)", null, { metadata: true, useArray: true }, function (err, rows) {
		c.query("SELECT t1.reporter_id, t2.point, t3.status FROM `data_pelanggaran` t1 INNER JOIN `data_point` t2 ON t1.id=? INNER JOIN `history` t3 ON t1.id=?", [req.id, req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.numRows !== '0') {
				rows.forEach(function (items) {
					c.query("UPDATE `data_pelanggaran` SET `status`=1, `updated`=? WHERE `id`=?", [waktu, req.id], { metadata: true, useArray: true }, function (err, rows) {
						if (err) {
							res.status(500).send({ message: "Error 500: Internal Server Error" });
							console.log(err);
							return
						}
					});
					c.query("UPDATE `history` SET `status`=1, `updated`=? WHERE `id`=?", [waktu, req.id], { metadata: true, useArray: true }, function (err, rows) {
						if (err) {
							res.status(500).send({ message: "Error 500: Internal Server Error" });
							console.log(err);
							return
						}
					});
					c.query("UPDATE `data_point` SET `point`=?, `updated`=? WHERE `user_id`=?", [parseInt(items[1]) + 10, waktu, items[0]], { metadata: true, useArray: true }, function (err, rows) {
						if (err) {
							res.status(500).send({ message: "Error 500: Internal Server Error" });
							console.log(err);
							return
						}

						res.json({
							success: true,
							err: null,
							message: "Ticket closed successfully"
						});
						return
					});
				});
			} else {
				res.status(404).send({
					success: false,
					err: null,
					message: "Data not found."
				});
			}
		});
		c.end();
	},
	deactivateTicket: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [waktu, req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_pelanggaran` SET `status`='9', `updated`=? WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			if (rows.info.affectedRows < 1) {
				res.status(404).send({ message: 'Data not found.' });
			} else {
				res.json({
					affectedRows: rows.info.affectedRows,
					message: "Ticket has deactivate successfully",
					success: true
				});
			}
		});
		c.end();
	},
	deleteTicket: function (req, res) {
		var request = [req.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("DELETE FROM `data_pelanggaran` WHERE id=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Ticket has deleted successfully",
				success: true
			});
		});
		c.end();
	},
	deleteTicketAll: function (req, res) {
		c.query("DELETE FROM `data_pelanggaran`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "All Ticket has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	setAdminPrivilege: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.privilege_id, waktu, req.params.id];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_user` SET `status`=?, `updated`=? WHERE `id`=? AND `id` LIKE 'A%'", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Privilege has updated successfully",
				privilege_id: req.body.privilege_id,
				success: true
			});
		});
		c.end();
	},
	getPointAll: function (req, res) {
		c.query('SELECT * FROM `data_point` ORDER BY id', null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					user_id: items[1],
					point: items[2],
					created: items[3],
					updated: items[4]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getPoint: function (req, res) {
		c.query("SELECT * FROM `data_point` WHERE id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					user_id: items[1],
					point: items[2],
					created: items[3],
					updated: items[4]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getUserPoint: function (req, res) {
		c.query("SELECT * FROM `data_point` WHERE user_id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					user_id: items[1],
					point: items[2],
					created: items[3],
					updated: items[4]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newPoint: function (req, point, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.user_id, req.body.point, waktu, waktu];
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `data_point` (`user_id`, `point`, `created`, `updated`) VALUES (?, ?, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "Point has recorded successfully",
				success: true
			});
		});
		c.end();
	},
	updatePoint: function (req, point, res) {
		const waktu = new Date().toISOString();
		var request = [point, waktu, req.uid]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `data_point` SET `point`=?, `updated`=? WHERE `user_id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "Point has updated successfully",
				success: true
			});
		});
		c.end();
	},
	deletePoint: function (req, res) {
		var request = [req.uid]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("DELETE FROM `data_point` WHERE user_id=?", [req.uid], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "Point has deleted successfully",
				success: true
			});
		});
		c.end();
	},
	deletePointAll: function (req, res) {
		c.query("DELETE FROM `data_point`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "All Point has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	getHistoryAll: function (req, res) {
		c.query('SELECT * FROM `history` ORDER BY id', null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					ticket_id: items[1],
					from_id: items[2],
					to_id: items[3],
					info: items[4],
					message: items[5],
					status: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getHistory: function (req, res) {
		c.query("SELECT * FROM `history` WHERE id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					ticket_id: items[1],
					from_id: items[2],
					to_id: items[3],
					info: items[4],
					message: items[5],
					status: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getFromHistory: function (req, res) {
		c.query("SELECT * FROM `history` WHERE from_id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					ticket_id: items[1],
					from_id: items[2],
					to_id: items[3],
					info: items[4],
					message: items[5],
					status: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getToHistory: function (req, res) {
		c.query("SELECT * FROM `history` WHERE to_id=?", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					ticket_id: items[1],
					from_id: items[2],
					to_id: items[3],
					info: items[4],
					message: items[5],
					status: items[6],
					created: items[7],
					updated: items[8]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	getTicketHistory: function (req, res) {
		c.query("SELECT t1.id, t1.ticket_id, t2.name, t1.info, t1.message, t1.status, t1.created, t1.updated FROM `history` t1 INNER JOIN `data_user` t2 ON (t1.from_id=t2.id AND ticket_id=?) ORDER BY t1.created DESC", [req.id], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			var data = [];
			rows.forEach(function (items) {
				data.push({
					id: items[0],
					ticket_id: items[1],
					from_name: items[2],
					info: items[3],
					message: items[4],
					status: items[5],
					created: items[6],
					updated: items[7]
				});
			});
			if (data.length < 1) {
				res.status(404).send('Data not found.');
			} else {
				res.json(data);
			}
		});
		c.end();
	},
	newHistory: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.ticket_id, req.from_id, req.to_id, req.info, req.message, waktu, waktu]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("INSERT INTO `history` (`ticket_id`, `from_id`, `to_id`, `info`, `message`, `status`, `created`, `updated`) VALUES (?, ?, ?, ?, ?, 0, ?, ?)", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "History has recorded successfully",
				success: true
			});
		});
		c.end();
	},
	updateHistory: function (req, res) {
		const waktu = new Date().toISOString();
		var request = [req.body.ticket_id, req.body.from_id, req.body.to_id, req.body.info, req.body.message, waktu, req.params.id]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("UPDATE `history` SET `ticket_id`=?, `from_id`=?, `to_id`=?, `info`=?, `message`=?, `updated`=? WHERE `id`=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				err: null,
				message: "History has updated successfully",
				success: true
			});
		});
		c.end();
	},
	deleteTicketHistory: function (req, res) {
		var request = [req.uid]
		if (request.includes(undefined) || request.includes("")) {
			res.send({ message: 'Bad Request: Parameters cannot empty.' });
			return
		}
		c.query("DELETE FROM `history` WHERE ticket_id=?", request, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "Ticket History has deleted successfully",
				success: true
			});
		});
		c.end();
	},
	deleteHistoryAll: function (req, res) {
		c.query("DELETE FROM `history`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "All History has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	deleteVerificationToken: function (req, res) {
		c.query("DELETE FROM `verification_token`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "All Verification Token has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	deleteResetPasswordToken: function (req, res) {
		c.query("DELETE FROM `reset_password`", null, { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				affectedRows: rows.info.affectedRows,
				message: "All Reset Password Token has deleted successfully :[",
				success: true
			});
		});
		c.end();
	},
	deleteInactiveToken: function (req, res) {
		const waktu = new Date().valueOf();
		c.query("DELETE FROM `reset_password` WHERE `status`=1 OR `status`=3 OR `expired`<?", [waktu], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}
		});
		c.query("DELETE FROM `verification_token` WHERE `status`=1 OR `status`=3", [waktu], { metadata: true, useArray: true }, function (err, rows) {
			if (err) {
				res.status(500).send({ message: "Error 500: Internal Server Error" });
				console.log(err);
				return
			}

			res.json({
				message: "All Inactive Token has deleted successfully :]",
				success: true
			});
		});
		c.end();
	},

}

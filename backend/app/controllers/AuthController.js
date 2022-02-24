const { registerValidation, loginValidation } = require('../helpers/JoiAuthHelper.js')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const env = require('dotenv');
env.config();

exports.login = async (req, res) => {
	const { error } = loginValidation(req.body);

	if (error) {
		return res.json({
			message: error.details[0].message
		});
	}

	const user = await User.findOne({
		email: req.body.email
	});
	
	if (!user || !user.checkPassword(req.body.password)) {
		return res.status(401).json({
			message: 'Invalid email or password'
		});
	}
	
	const token = user.getJwtToken();
	user.token = token;
	user.save();
	
	return res.json(user);
};

exports.logout = async (req, res) => {
	if (res.locals.user._id) {
		res.locals.user.token = null;
		await res.locals.user.save();
		return res.status(200).json({
			message: 'Logged out.'
		});
	} else {
		return res.status(404).json({
			message: 'User not found'
		});
	}
};

exports.signUp = async (req, res) => {
	const { error } = registerValidation(req.body);

	if (error) {
		return res.json({
			message: error.details[0].message
		});
	}

	const password = await bcrypt.hash(req.body.password, 12);

	const usersCount = await User.count();
	let userRole = (usersCount === 0) ? await Role.findOne({ name: 'admin'}) : await Role.findOne({ name: 'user'});

	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: password,
		role: userRole._id
	});

	const token = user.getJwtToken();
	user.token = token;

	user.save((error) => {
		if (!error) {
			return res.json(user);
		}

		if (error.errors['username']) {
			return res.json({
				message: error.errors['username'].message
			});
		}

		if (error.errors['email']) {
			return res.json({
				message: error.errors['email'].message
			});
		}
	});
};

exports.isAdmin = async (req, res) => {
	const user = res.locals.user;
	
	const role = await Role.findOne({
		_id: user.role
	});

	if (role === null) {
		res.status(200).json({
			admin: false
		})
	}

	return res.status(200).json({
		admin: role.name === 'admin'
	});
};
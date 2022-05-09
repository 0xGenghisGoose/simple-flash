require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

module.exports = {
	solidity: '0.8.10',
	networks: {
		hardhat: {
			forking: {
				url: ALCHEMY_API_KEY,
			},
		},
	},
};

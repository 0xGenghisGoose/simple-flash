const { expect, assert } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, waffle, artifacts } = require('hardhat');
const hre = require('hardhat');

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require('../config');

describe('Deploy a flash loan', function () {
	it('Should take a flash loan and be able to return it', async function () {
		const flashLoanContract = await ethers.getContractFactory('SimpleFlash');
		const flashLoan = await flashLoanContract.deploy(POOL_ADDRESS_PROVIDER);
		await flashLoan.deployed();

		const token = await ethers.getContractAt('IERC20', DAI); // get instance of DAI deployed on Polygon mainnet
		const BALANCE_AMOUNT_DAI = ethers.utils.parseEther('2000');

		// impersonate the DAI whale
		await hre.network.provider.request({
			method: 'hardhat_impersonateAccount',
			params: [DAI_WHALE],
		});

		const signer = await ethers.getSigner(DAI_WHALE);
		await token.connect(signer).transfer(flashLoan.address, BALANCE_AMOUNT_DAI); // send `flashLoan` 2000 DAI from whale

		const tx = await flashLoan.createFlashLoan(DAI, 1000); // borrow 1,000 DAI
		await tx.wait();

		const remainingBalance = await token.balanceOf(flashLoan.address); // check `flashLoan` DAI balance
		expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true; // check for less than 2000 DAI since we paid premium
	});
});

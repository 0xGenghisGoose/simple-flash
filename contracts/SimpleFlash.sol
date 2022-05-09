//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol"; // used to set up receiver
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleFlash is FlashLoanSimpleReceiverBase {
    using SafeMath for uint256;

    event Log(address asset, uint256 val);

    constructor(IPoolAddressesProvider _provider)
        public
        FlashLoanSimpleReceiverBase(_provider)
    {}

    function createFlashLoan(address _asset, uint256 _amount) external {
        address receiver = address(this);
        bytes memory params = ""; // used to pass arbitrary data to `executeOperation`
        uint16 referralCode = 0; // executed directly

        POOL.flashLoanSimple(receiver, _asset, _amount, params, referalCode);
    }

    function executeOperation(
        address _asset,
        uint256 _amount,
        uint256 _premium,
        address _initiator,
        bytes calldata _params
    ) external returns (bool) {
        // arb here

        uint256 amountOwing = _amount.add(_premium);
        IERC20(_asset).approve(address(POOL), amountOwing);
        emit Log(_asset, amountOwing);
        return true;
    }
}

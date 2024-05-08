// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract ERC20Faucet {
    string public constant name = "Mock USDC";
    string public constant symbol = "USDC";
    uint8 public constant decimals = 6;

    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    mapping(address => mapping(address => uint256)) private _allowances;


    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        _mint(msg.sender, 5000000); // Mint 1000 tokens for the faucet owner
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function sendTokens(address token, address recipient, uint256 amount) external {
        IERC20(token).transfer(recipient, amount);
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(_balances[sender] >= amount, "Insufficient balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) private {
        require(account != address(0), "Mint to the zero address");
        require(amount > 0, "Mint amount must be greater than zero");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
    require(_allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");
    _transfer(sender, recipient, amount);
    _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
    return true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
}

    function allowance(address owner, address spender) external view returns (uint256) {
    return _allowances[owner][spender];
    }
}

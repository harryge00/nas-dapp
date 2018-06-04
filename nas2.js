'use strict';

var SlotMachine = function () {
};

// save value to contract, only after height of block, users can takeout
SlotMachine.prototype = {
  init: function (balance) {
    Math.random.seed("I am a fucking genuis. ~~");
    LocalContractStorage.set("balance", 0);
  },

  spin: function () {
    var topPrize = new BigNumber(7000000000000000);
    var secPrize = new BigNumber(3000000000000000);
    var thrPrize = new BigNumber(2000000000000000);
    var balance = new BigNumber(LocalContractStorage.get("balance"));
    var prizes = [secPrize, thrPrize, thrPrize, thrPrize, secPrize, topPrize];
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    var result = {
      "fromValue": value,
      "prize": 0
    };

    balance.plus(value);
    if(value.lt(1000000000000000)) {
      LocalContractStorage.set("balance", balance.toNumber());
      throw new Error("Insufficient nas to play!");
    }
    var arr = [];
    for(var i = 0; i < 3; i++) {
      arr[i] = Math.floor(Math.random() * prizes.length)
    }
    if(arr[0] == arr[1] && arr[1] == arr[2]) {
      var prize = prizes[arr[0]];
      if(prize.gt(balance)) {
        LocalContractStorage.set("balance", balance.toNumber());
        throw new Error("Oops...Prize pool is insufficient!");
      }
      var res = Blockchain.transfer(address, prize);
      if(!res) {
        console.log("Transaction failed!");
        result.failed = true;
      }
      balance.minus(prize);
      LocalContractStorage.set("balance", balance.toNumber());
      result.prize = prize;
      
    }
    result.slots = arr;
    return result;
  },

  balanceOf: function () {
    return LocalContractStorage.get("balance");
  },
  
  claim: function() {
    var balance = new BigNumber(LocalContractStorage.get("balance"));
    var res = {
      failed: true
    };
    if(balance.gt(100000000000000000)) {
      var res = Blockchain.transfer("n1GHASp6Pku4D35hvgGipS3Pjt2iX7uYhBZ", balance);
      if(!res) {
        console.log("Transaction failed!");
      } else {
        res.failed = false;
      }
    }
    return res;
  },

  verifyAddress: function (address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  }
};
module.exports = SlotMachine;
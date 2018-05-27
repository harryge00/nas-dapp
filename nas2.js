'use strict';

var SlotMachine = function () {
  // LocalContractStorage.defineProperty(this, "balance", {
  //   stringify: function (obj) {
  //       return obj.toString();
  //   },
  //   parse: function (str) {
  //       return new BigNumber(str);
  //   }
  // });
};

// save value to contract, only after height of block, users can takeout
SlotMachine.prototype = {
  init: function (balance) {
    Math.random.seed("I am a fucking genuis. ~~");
    LocalContractStorage.set("balance", 0);
  },

  spin: function () {
    var topPrize = new BigNumber(0.007);
    var secPrize = new BigNumber(0.003);
    var thrPrize = new BigNumber(0.002);
    var balance = new BigNumber(LocalContractStorage.get("balance"));
    var prizes = [secPrize, thrPrize, thrPrize, thrPrize, secPrize, topPrize];
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    balance.plus(value);
    if(value.lt(0.001)) {
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
      }
      balance.minus(prize);
      LocalContractStorage.set("balance", balance.toNumber());
      
    }
    return arr;
  },

  balanceOf: function () {
    return LocalContractStorage.get("balance");
  },
  add: function(i) {
    if(i > 0.000000001) {
      var balance = new BigNumber(LocalContractStorage.get("balance"));
      balance.plus(i);
      LocalContractStorage.set("balance", balance.toNumber());
    }
    return balance.toNumber();
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
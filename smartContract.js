'use strict';

var SlotMachine = function () {
  LocalContractStorage.defineProperty(this, "balance", {
      stringify: function (obj) {
          return obj.toString();
      },
      parse: function (str) {
          return new BigNumber(str);
      }
  });
};

SlotMachine.prototype = {
  init: function (balance) {
    this.balance = balance;
  },

  spin: function () {
    var topPrize = new BigNumber(7000000000000000);
    var secPrize = new BigNumber(3000000000000000);
    var thrPrize = new BigNumber(2000000000000000);
    var prizes = [secPrize, thrPrize, thrPrize, thrPrize, secPrize, topPrize];
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    var result = {
      "fromValue": value,
      "prize": 0
    };

    this.balance.plus(value);
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
        throw new Error("Oops...Prize pool is insufficient! Please contact the author harryge@qq.com!");
      }
      var res = Blockchain.transfer(address, prize);
      if(!res) {
        console.log("Transaction failed!");
        result.failed = true;
      }
      this.balance.minus(prize);
      result.prize = prize;
      
    }
    result.slots = arr;
    return result;
  },

  balanceOf: function () {
    return this.balance;
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
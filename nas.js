'use strict';


// var RankingItem = function (text) {
//   if (text) {
//     var o = JSON.parse(text);
//     this.balance = o.balance;
//     this.author = o.author;
//   } 
// };

// RankingItem.prototype = {
//   toString: function () {
//     return JSON.stringify(this);
//   }
// };

var SlotMachine = function () {
  LocalContractStorage.defineMapProperty(this, "data", {
    parse: function (text) {
      return new RankingItem(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

// save value to contract, only after height of block, users can takeout
SlotMachine.prototype = {
  init: function () {
    Math.random.seed("I am a fucking genuis. ~~");
  },

  spin: function () {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    if(value.lt(0.001)) {
      throw new Error("Insufficient nas to play!")
    }
    var arr = [];
    for(var i = 0; i < 3; i++) {
      arr[i] = Math.floor(Math.random() * 6)
    }
    if(arr[0] == arr[1] && arr[1] == arr[2]) {
      switch(arr[0]) {
        case 5:
          // Lucky 7
        case 4:
          // bar
        case 0:
          // cherry
        default:

      }
    }
    return arr;
  },
  
  balanceOf: function () {
    var from = Blockchain.transaction.from;
    return this.bankVault.get(from);
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
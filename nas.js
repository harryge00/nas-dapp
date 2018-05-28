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

var Pool = function(text) {
  if (text) {
    var o = JSON.parse(text);
    this.balance = new BigNumber(o.balance);
  } else {
    this.balance = new BigNumber(0);
  }
  var topPrize = new BigNumber(0.007);
  var secPrize = new BigNumber(0.003);
  var thrPrize = new BigNumber(0.002);
  this.prizes = [secPrize, thrPrize, thrPrize, thrPrize, secPrize, topPrize];
}

Pool.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var SlotMachine = function () {
  LocalContractStorage.set("testBalance", new BigNumber(0));
  // LocalContractStorage.defineMapProperty(this, "pool", {
  //   parse: function (text) {
  //     return new Pool(text);
  //   },
  //   stringify: function (o) {
  //     return o.toString();
  //   }
  // });
};

// save value to contract, only after height of block, users can takeout
SlotMachine.prototype = {
  init: function (balance) {
    Math.random.seed("I am a fucking genuis. ~~");
    this.pool.balance = new BigNumber(balance);
  },

  spin: function () {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    this.pool.balance.plus(value);
    if(value.lt(0.001)) {
      throw new Error("Insufficient nas to play!");
    }
    var arr = [];
    for(var i = 0; i < 3; i++) {
      arr[i] = Math.floor(Math.random() * this.prizes.length)
    }
    if(arr[0] == arr[1] && arr[1] == arr[2]) {
      var prize = this.pool.prizes[arr[0]];
      if(prize.gt(this.pool.balance)) {
        throw new Error("Oops...Prize pool is insufficient!");
      }
      var res = Blockchain.transfer(address, prize);
      if(!res) {
        console.log("Transaction failed!");
      }
      this.pool.balance.minus(prize);
      // switch(arr[0]) {
      //   case 5:
      //     // Lucky 7
      //     var prize = new BigNumber(0.007);
      //     var res = Blockchain.transfer(address, prize);
      //     if(!res) {
      //       console.log("transfer failed!");
      //     }
      //     break;
      //   case 4:
      //     // bar
      //     var prize = new BigNumber(0.003);
      //     var res = Blockchain.transfer(address, prize);
      //     if(!res) {
      //       console.log("transfer failed!");
      //     }
      //     break;
      //   case 0:
      //     // cherry
      //     var prize = new BigNumber(0.003);
      //     var res = Blockchain.transfer(address, prize);
      //     if(!res) {
      //       console.log("transfer failed!");
      //     }
      //     break;
      //   default:
      //     var prize = new BigNumber(0.001);
      //     var res = Blockchain.transfer(address, prize);
      //     if(!res) {
      //       console.log("transfer failed!");
      //     }
      // }
    }
    return arr;
  },

  balanceOf: function () {
    // return this.pool.balance;
    return LocalContractStorage.get("testBalance");
  },
  add: function(i) {
    var bal = new BigNumber(LocalContractStorage.get("testBalance"));
    bal.plus(i);
    LocalContractStorage.set("testBalance", bal);
    return bal;
  },
  getPrize: function(i) {
    if(i < 0 || i >= this.pool.prizes.length) {
      throw new Error("Illegal argument!");
    }
    return this.pool.prizes[i];
  },
  claim: function(){

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
let count = 0;
      const btnShuffle = document.querySelector('#casinoShuffle');
      const btnStop = document.querySelector('#casinoStop');
      const casino1 = document.querySelector('#casino1');
      const casino2 = document.querySelector('#casino2');
      const casino3 = document.querySelector('#casino3');
      const mCasino1 = new SlotMachine(casino1, {
        active: 0,
        delay: 500
      });
      const mCasino2 = new SlotMachine(casino2, {
        active: 1,
        delay: 500
      });
      const mCasino3 = new SlotMachine(casino3, {
        active: 2,
        delay: 500
      });
      btnShuffle.addEventListener('click', () => {
        onPayClick();
        count = 3;
        mCasino1.shuffle(99999);
        mCasino2.shuffle(99999);
        mCasino3.shuffle(99999);
      });
      
      var NebPay = require("nebpay");
      var nebPay = new NebPay();
      var serialNumber;
      var intervalQuery;
      //var callbackUrl = NebPay.config.mainnetUrl;
      var callbackUrl = NebPay.config.testnetUrl;
      var toAddr = "n21msTLFKy9uFdnvTQAwUZJjg6VdwKJM4Qz";
      var options = {
          goods: {
              name: "Lucky 7 Slot Machine ",
              desc: "Win money if the 3 slots are same"
          },
          callback:callbackUrl
      };
      function onPayClick() {
          serialNumber = nebPay.call(toAddr, 0.001, "spin", "[]", options);
          //Set a periodically query
          intervalQuery = setInterval(function() {
              funcIntervalQuery();
          }, 10000); //it's recommended that the query frequency is between 10-15s.
      }
      //Query the result of the transaction. queryPayInfo returns a Promise object.
      // {"code":0,"data":{"execute_error":"","gas_price":"1000000","data":"eyJGdW5jdGlvbiI6InNwaW4iLCJBcmdzIjoiW10ifQ==","gas_used":"20356","contract_address":"","type":"call","nonce":37,"gas_limit":"200000","chainId":1001,"from":"n1GHASp6Pku4D35hvgGipS3Pjt2iX7uYhBZ","to":"n21msTLFKy9uFdnvTQAwUZJjg6VdwKJM4Qz","execute_result":"{\"fromValue\":\"1000000000000000\",\"prize\":0,\"slots\":[3,0,4]}","value":"1000000000000000","hash":"02ed848ef7f85f0bc5b32a1306c0297882f393f748ed099c4bd3ab8dfe023121","status":1,"timestamp":1527865082},"msg":"success"}
      function funcIntervalQuery() {   
          nebPay.queryPayInfo(serialNumber, options)   //search transaction result from server (result upload to server by app)
              .then(function (resp) {
                  console.log("tx result: " + resp);   //resp is a JSON string
                  var respObject = JSON.parse(resp);
                  console.log(respObject.slots);
                  if(respObject.code === 0 && respObject.execute_result.prize){
                      //The transaction is successful 
                      clearInterval(intervalQuery);    //stop the periodically query 

                  }
              })
              .catch(function (err) {
                  console.log(err);
              });
      }
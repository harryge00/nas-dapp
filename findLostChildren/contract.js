"use strict";

var Child = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.name = obj.name;
		this.birthyear = obj.birthyear;
        this.contact = obj.contact;
        this.place = obj.place;
		this.url = obj.url;
	} else {
	    this.name = "";
	    this.birthyear = 2010;
        this.contact = 110;
        this.place = "中国";
	    this.url = "";
	}
};

Child.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var SuperDictionary = function () {
    LocalContractStorage.defineMapProperty(this, "children", {
        parse: function (text) {
            return new Child(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.set("count", 0);
};

SuperDictionary.prototype = {
    init: function () {
        // todo
    },

    save: function (name, birthyear, contact, place, url) {
        if (name === "" || birthyear === ""){
            throw new Error("empty name / birthyear");
        }
        if (name.length > 64){
            throw new Error("name exceed limit length")
        }
        if(birthyear > 2018 || birthyear < 1980) {
            throw new Error("Please check the birth year.")
        }
        var count = LocalContractStorage.get("count");
        Child = new Child();
        Child.name = name;
        Child.birthyear = birthyear;
        Child.contact = contact;
        Child.place = place;
        Child.url = url;
        this.children.put(count, Child);
        count++;
        LocalContractStorage.set("count", count);
        return count;
    },

    get: function (id) {
        return this.children.get(id);
    },
    list: function() {
        var result = [];
        var count = LocalContractStorage.get("count");
        for(var i = 0; i < count; i++) {
            result[i] = this.children.get(i);
        }
        return result;
    },
    count: function() {
        return LocalContractStorage.get("count");
    },
    setCount: function(count) {
        return LocalContractStorage.set("count", count);
    },
};
module.exports = SuperDictionary;
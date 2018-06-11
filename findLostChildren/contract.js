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
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "children", {
        parse: function (text) {
            return new Child(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

SuperDictionary.prototype = {
    init: function () {
        this.size = 0;
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
        
        Child = new Child();
        Child.name = name;
        Child.birthyear = birthyear;
        Child.contact = contact;
        Child.place = place;
        Child.url = url;
        this.children.put(this.size, Child);
        this.size++;
        return this.size;
    },

    get: function (id) {
        return this.children.get(id);
    },
    list: function() {
        var result = {};
        result.count = this.size;
        result.array = [];
        for(var i = 0; i < result.count; i++) {
            result.array[i] = this.children.get(i);
        }
        return result;
    },
    size: function() {
        return this.size;
    },
    setSize: function(size) {
        this.size = size;
        return this.size;
    },
};
module.exports = SuperDictionary;
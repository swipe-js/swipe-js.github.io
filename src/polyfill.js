
(function(){

    // Object.assign
    Object.assign = !!Object.assign ? Object.assign : function() {
        var i = '';
        var j = '';
        var obj = {};

        for ( i in arguments ) {
            if ( Object.prototype.toString.call(arguments[i]).toLowerCase().split(" ")[1].replace(/]/gi, "") === "object" ) {
                for ( j in arguments[i] ) obj[j] = arguments[i][j];
            }
        }

        return obj;
    }

})();

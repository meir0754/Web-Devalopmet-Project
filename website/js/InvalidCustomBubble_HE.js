(function (exports) {
    function valOrFunction(val, ctx, args) {
        if (typeof val == "function") {
            return val.apply(ctx, args);
        } else {
            return val;
        }
    }

    function InvalidInputHelper(i_ElemToCheck, options) {
        $.each(i_ElemToCheck, function (key, input) {
            input.setCustomValidity(valOrFunction(options.defaultText, window, [input]));

            function changeOrInput() {
                if (input.value == "") {
                    input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
                } else {
                    input.setCustomValidity("");
                }
            }

            function invalid() {
                if (input.value == "") {
                    input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
                } else {
                    input.setCustomValidity(valOrFunction(options.invalidText, window, [input]));
                }
            }

            input.addEventListener("change", changeOrInput);
            input.addEventListener("input", changeOrInput);
            input.addEventListener("invalid", invalid);
        });
    }

    exports.InvalidInputHelper = InvalidInputHelper;
})(window);

$(function () {
    var k_InvalidMsg = 'הערך אינו תקין!',
        _Elements = ['input', 'select'];

    $.each(_Elements, function (key, val) {
        InvalidInputHelper($(val), {
            defaultText: k_InvalidMsg,
            emptyText: k_InvalidMsg,
            invalidText: function (input) {
                return 'הערך "' + input.value + '" אינו תקין!';
            }
        });
    });
});
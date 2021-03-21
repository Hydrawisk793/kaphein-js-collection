const { ArrayQueue } = require("../../src");
const {
    nextInteger,
    nextIntegers,
} = require("../utils.test");
const queueCommon = require("./queue-common.test");

module.exports = function ()
{
    (queueCommon.bind(this))(
        ArrayQueue,
        [],
        nextIntegers(nextInteger(3, 10), -10, 10),
        "ArrayQueue"
    );
};

module.exports = (function ()
{
    /**
     *  @param {number} milliseconds
     */
    function waitFor(milliseconds)
    {
        return /** @type {Promise<void>} */(new Promise(function (resolve)
        {
            setTimeout(resolve, milliseconds);
        }));
    }

    /**
     *  @param {number} start
     *  @param {number} end
     *  @param {number} increment
     */
    function createNumberSequence(start, end, increment)
    {
        /** @type {number[]} */var sequence = [];

        if(Math.abs(end - start) < 1e-6)
        {
            sequence.push(start);
        }
        else if(Math.abs(increment) < 1e-6)
        {
            sequence.push(start);
            sequence.push(end);
        }
        else
        {
            var v = start;
            do
            {
                sequence.push(v);

                v += increment;
            }
            while(v < end);

            if(sequence.length > 0)
            {
                var last = sequence[sequence.length - 1];
                if(
                    Math.abs(last - end) >= 1e-6
                    && last < end
                )
                {
                    sequence.push(end);
                }
            }
        }

        return sequence;
    }

    /**
     *  @param {number} min
     *  @param {number} max
     */
    function nextInteger(min, max)
    {
        return Math.floor((Math.random() * (max - min))) + min;
    }

    /**
     *  @param {number} count
     *  @param {number} min
     *  @param {number} max
     */
    function nextIntegers(count, min, max)
    {
        var integers = [];
        for(var i = 0; i < count; ++i)
        {
            integers.push(nextInteger(min, max));
        }

        return integers;
    }

    /**
     *  @param {number} l
     *  @param {number} r
     */
    function compareNumber(l, r)
    {
        return l - r;
    }

    /**
     *  @param {string} l
     *  @param {string} r
     */
    function compareString(l, r)
    {
        return l.localeCompare(r);
    }

    /**
     *  @param {string | number | symbol} l
     *  @param {string | number | symbol} r
     */
    function compareRecordKey(l, r)
    {
        return (
            "symbol" === typeof l
                ? l.valueOf().toString()
                : "" + l
        ).localeCompare(
            "symbol" === typeof r
                ? r.valueOf().toString()
                : "" + r
        );
    }

    return {
        waitFor : waitFor,
        createNumberSequence : createNumberSequence,
        nextInteger : nextInteger,
        nextIntegers : nextIntegers,
        compareNumber : compareNumber,
        compareString : compareString,
        compareRecordKey : compareRecordKey
    };
})();

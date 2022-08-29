const {
    createVNode: _createVNode,
    openBlock: _openBlock,
    createBlock: _createBlock,
} = require("vue");

module.exports = function render(_ctx, _cache) {
    return (
        _openBlock(),
        _createBlock(
            "svg",
            {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "2",
                stroke: "currentColor",
                "aria-hidden": "true",
            },
            [
                _createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: `M12 12
                        m -9, 0
                        a 9,9 0 1,1 18,0
                        a 9,9 0 1,1 -18,0`,
                }),
            ]
        )
    );
};
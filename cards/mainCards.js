var mainCards = [
    {
        _id: 1,
        name: "Water Balloon",
        power: -2,
        action: "Target Opponent loses 2 confidence",
        type: "action"
    },
    {
        _id: 2,
        name: "Swag Boost",
        power: 1,
        action: "Gain +1 confidence",
        type: "action"
    },
    {
        _id: 3,
        name: "Water Balloon",
        power: -2,
        action: "Target Opponent loses 2 confidence",
        type: "action"
    },
    {
        _id: 4,
        name: "Swag Boost",
        power: 1,
        action: "Gain +1 confidence",
        type: "action"
    },
    {
        _id: 5,
        name: "What's That Over There",
        power: 0,
        action: "Negate Any Action",
        type: "quick"
    },
    {
        _id: 6,
        name: "Loose Change",
        power: 0,
        action: "Collect 1 coin into your bank",
        type: "quick"
    }
]

module.exports = Object.assign({}, { mainCards });
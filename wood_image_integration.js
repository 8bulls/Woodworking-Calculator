// Wood species that need grain images added
// Once you have the .jpg files, update the grainImage properties in index.html

const speciesNeedingImages = [
    { name: "Ash", filename: "ash_400.jpg" },
    { name: "Basswood", filename: "basswood_400.jpg" },
    { name: "Beech", filename: "beech_400.jpg" },
    { name: "Birch", filename: "birch_400.jpg" },
    { name: "Eastern White Pine", filename: "eastern_white_pine_400.jpg" },
    { name: "Hickory", filename: "hickory_400.jpg" },
    { name: "Mahogany", filename: "mahogany_400.jpg" },
    { name: "Poplar", filename: "poplar_400.jpg" },
    { name: "Purple Heart", filename: "purple_heart_400.jpg" },
    { name: "Teak", filename: "teak_400.jpg" },
    { name: "Western Red Cedar", filename: "western_red_cedar_400.jpg" },
    { name: "White Oak", filename: "white_oak_400.jpg" }
];

// Example update for Ash (line ~11353 in index.html):
// Change: grainPattern: "linear-gradient(45deg, #d4a574 0%, #c89660 25%, #d4a574 50%, #c89660 75%, #d4a574 100%)",
// To: grainPattern: "linear-gradient(45deg, #d4a574 0%, #c89660 25%, #d4a574 50%, #c89660 75%, #d4a574 100%)",
//     grainImage: "ash_400.jpg",
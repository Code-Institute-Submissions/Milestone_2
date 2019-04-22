//Logic Suite
describe("Logic Suite", function() {
    var moveset = new Set();
    var dummylist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var shufflelist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // There is a 1:3,628,800 chance that the shuffle array will return the same array failing the test
    // http://gph.is/22PcCaQ
    shuffleArray(shufflelist);

    // Run the nextmoveRandom function 100 times adding the output to a set, this should guarantee that all 4 moves should be contained in the set
    for (let i = 100 - 1; i >= 0; i--) {
        moveset.add(nextmoveRandom());
    }

    it("nextmoveRandom should return all valid moves", function() {
        expect(Array.from(moveset).sort()).toEqual(gameState.validMoves.sort());
    });

    it("shuffleArray should return different array", function() {
        expect(dummylist).not.toEqual(shufflelist);
    });
});

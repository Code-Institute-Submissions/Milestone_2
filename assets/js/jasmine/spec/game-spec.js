// Game Suite
describe("Game Suite", function() {
    // Set an object to have the same code attribute as keyboard event for space
    dummykey = { code: "Space" };

    it("The gameStart function should be called the space bar is pressed", function() {
        // Start a spy
        spyOn(window, "gameStart");
        // Simulate a space key
        keyDownHandler(dummykey);
        // Check the game has indeed started
        expect(window.gameStart).toHaveBeenCalled();
    });
});

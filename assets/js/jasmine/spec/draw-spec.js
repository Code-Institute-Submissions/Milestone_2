//Draw Suite

// Dummy coordinates and sizes for the functions
var x = 10;
var y = 10;
var w = 10;
var h = 10;

// Creating an instance of each type of object
var simon = drawSimon(x, y);
var pillar = drawPillar(x, y, "testPillar");
var wall = drawWall(x, y, w, h, "testWall");
var button = drawButton(x, y);
var bolt = drawBolt(x, y, w);
var spike = drawSpike(x, y, w, h);
var msp = drawMSP(x, y);

var textbox = drawTextbox("Dummy Text", 40, x, y);

describe("Draw Suite", function() {
    describe("Test Simon", function() {
        it("Simon should be graphics object", function() {
            expect(typeof simon.graphics).toBe("object");
        });

        it("Simon should move from (0,0)", function() {
            expect(simon.x).not.toBe(0);
            expect(simon.y).not.toBe(0);
        });

        it("Simon should have a name", function() {
            expect(simon.name).toBe("Simon");
        });
    });

    describe("Test Pillar", function() {
        it("Pillar should be graphics object", function() {
            expect(typeof pillar.graphics).toBe("object");
        });

        it("Pillar should move from (0,0)", function() {
            expect(pillar.x).not.toBe(0);
            expect(pillar.y).not.toBe(0);
        });

        it("Pillar should have a name", function() {
            expect(pillar.name).toBe("testPillar");
        });
    });

    describe("Test Wall", function() {
        it("Wall should be graphics object", function() {
            expect(typeof wall.graphics).toBe("object");
        });

        it("Wall should move from (0,0)", function() {
            expect(wall.x).not.toBe(0);
            expect(wall.y).not.toBe(0);
        });

        it("Wall should have a name", function() {
            expect(wall.name).toBe("testWall");
        });
    });

    describe("Test Button", function() {
        it("Button should be graphics object", function() {
            expect(typeof button.graphics).toBe("object");
        });

        it("Button should move from (0,0)", function() {
            expect(button.x).not.toBe(0);
            expect(button.y).not.toBe(0);
        });

        it("Button should have a name", function() {
            expect(button.name).toBe("Button");
        });
    });

    describe("Test Bolt", function() {
        it("Bolt should be graphics object", function() {
            expect(typeof bolt.graphics).toBe("object");
        });

        it("Bolt should move from (0,0)", function() {
            expect(bolt.x).not.toBe(0);
            expect(bolt.y).not.toBe(0);
        });

        it("Bolt should have a name", function() {
            expect(bolt.name).toBe("Bolt");
        });
    });

    describe("Test Spike", function() {
        it("Spike should be graphics object", function() {
            expect(typeof spike.graphics).toBe("object");
        });

        it("Spike should move from (0,0)", function() {
            expect(spike.x).not.toBe(0);
            expect(spike.y).not.toBe(0);
        });

        it("Spike should have a name", function() {
            expect(spike.name).toBe("Spike");
        });
    });

    describe("Test MSP", function() {
        it("MSP should be graphics object", function() {
            expect(typeof msp.graphics).toBe("object");
        });

        it("MSP should move from (0,0)", function() {
            expect(msp.x).not.toBe(0);
            expect(msp.y).not.toBe(0);
        });

        it("MSP should have a name", function() {
            expect(msp.name).toBe("Mashy Spike Plate");
        });
    });

    describe("Test Textbox", function() {
        it("Textbox should be container object", function() {
            expect(typeof textbox.children).toBe("object");
        });

        it("Textbox should move from (0,0)", function() {
            expect(textbox.x).not.toBe(0);
            expect(textbox.y).not.toBe(0);
        });

        it("Textbox should have two children", function() {
            expect(textbox.children.length).toBe(2);
        });
    });
});

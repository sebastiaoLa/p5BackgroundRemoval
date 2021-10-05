let video;
let uNet;
let bodypix;
let segmentationImage;
var videoScale = 30;
var a_timestamp;

const sizing_ = 32;

// Number of columns and rows in our system
var cols, rows;

function preload() {
    neuralNet = ml5.uNet('face');
}

function setup() {
    createCanvas(640, 480);
    pixelDensity(1);
    video = createCapture(VIDEO, () => {
        a_timestamp = (new Date).getTime()
        neuralNet.segment(video, gotResult, {outputStride:32});
    });
    video.hide();
    segmentationImage = createImage(width, height);
}

function gotResult(error, result) {
    console.log(result)
    // return;
    console.log((new Date).getTime() - a_timestamp);
    if (error) {
        console.error(error);
        return;
    }
    segmentationImage.copy(result.mask, 0, 0, result.mask.width, result.mask.height, 0, 0, segmentationImage.width, segmentationImage.height);
    segmentationImage.filter(BLUR, 2);
    segmentationImage.filter(THRESHOLD);
    segmentationImage.loadPixels();
    let r_width = segmentationImage.width * 4;
    for (let x = 0; x < r_width; x += 4) {
        for (let y = 0; y < segmentationImage.height; y++) {
            let loc = x + y * r_width
            if (segmentationImage.pixels[loc] == 0) {
                segmentationImage.pixels[loc + 1] = 255
            } else {
                segmentationImage.pixels[loc + 3] = 0
            }
        }
    }
    segmentationImage.updatePixels();
    a_timestamp = (new Date).getTime()
    neuralNet.segment(video, gotResult, {outputStride:32});
}

function draw() {
    background(0);
    image(video, 0, 0, width, height)
    image(segmentationImage, 0, 0);
}

/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var mraa = require("mraa");
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");

// Include the JavaScript UPM libraries
var groveSensor = require('jsupm_grove');
var LCD = require("jsupm_i2clcd"); // Create a new instance of a Grove RGB LCD screen

// The Offset is necessary for Firmata
var OFFSET = 512;

// Instantiate the temperature sensor and LCD actuator
var temp = new groveSensor.GroveTemp(0 + OFFSET, 0.6); // Create a new instance of a Grove Temperature Sensor
var screen = new LCD.Jhd1313m1(0 + OFFSET, 0x3E, 0x62);

// monitor - creates an anonymous function that runs once per second
// The function will get the temperature and display it on the LCD.
function monitor() {
  setInterval(function() {
    // Read the temperature sensor
    var celsius = temp.value();

    // Convert it to fahrenheit
    var fahrenheit = Math.round(celsius * 9.0 / 5.0 + 32.0);

    // Log it to the console window
    console.log(celsius + "° Celsius, or " + fahrenheit + "° Fahrenheit");

    // Update the LCD screen
    screen.setCursor(0, 0);
    screen.setColor(255, 255, 255);
    screen.write("Temp: " + celsius + "C or " + fahrenheit + "F");
  }, 1000);
}

// Call the monitor function once
monitor();

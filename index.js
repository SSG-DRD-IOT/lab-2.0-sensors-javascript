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

////////////////////////////////////////////////////////////////////////////////
// ISTV Block
// First, we include both the MRAA and UPM libraries
////////////////////////////////////////////////////////////////////////////////
var mraa = require("mraa");
var upm = require('jsupm_grove'); // Temperature
var LCD = require("jsupm_i2clcd"); // LCD
// End ISTV Block

////////////////////////////////////////////////////////////////////////////////
// ISTV Block
// Next, the Arduino is connected to the IoT Gateway over a serial connection
// Specify the serial port and that we will use Firmata to communicate to it.
// A 512 offset is required for the pin numbers when using Firmata.
////////////////////////////////////////////////////////////////////////////////
var OFFSET = 512;
var PIN = 1
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM1");
// End ISTV Block

////////////////////////////////////////////////////////////////////////////////
// ISTV Block
// Now, instantiate temperature sensor and LCD
////////////////////////////////////////////////////////////////////////////////
var temp = new upm.GroveTemp(PIN + OFFSET, 0.6);
var screen = new LCD.Jhd1313m1(0 + OFFSET, 0x3E, 0x62);
// End ISTV Block

////////////////////////////////////////////////////////////////////////////////
// ISTV Block
// Lastly, use the setInterval function to call a function that will once per
// second get the temperature, print it to the console and display it on the LCD.
////////////////////////////////////////////////////////////////////////////////
setInterval(function() {
  var celsius = temp.value();
  console.log(celsius + "C");
  screen.setCursor(0, 0);
  screen.write(celsius + "C");
}, 1000);
// End ISTV Block

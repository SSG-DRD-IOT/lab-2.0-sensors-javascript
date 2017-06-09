## Read the Objectives

To learn how to build stand alone IoT devices with Arduino 101*. Learn to use sensors and actuators to gather and respond to data. The devices built during this lab will be extended in later labs to send their data to the Intel® IoT Gateway and to the cloud

By the end of this module, you should be able to:

*   Connect Grove* IoT Commercial Developer Kit sensors and actuators to your Arduino 101*.
*   Use the JavaScript UPM libraries to control actuators and read data from sensors.

## Deploy Your First App to the Intel® IoT Gateway

### Create a LED blink project

In your home directory (/home/{user}) on your Intel® IoT Gateway create a **labs** directory. We will put all our labs program here.

Under lab directory create another directory and name it **sensors**

Similarly create **LEDBlink** directory under sensors and finally create file **main.js** in it. We will write the LED blink program to it

### Write LED blink program

Update **main.js** with following changes

1.  Add below lines to include the FIRMATA subplatform for MRAA. The Arduino 101* is accessed via ttyACM0 port

```js
var mraa = require("mraa");
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");
```

2.  Create an offset var of 512\. This offset is required since we use Firmata to connect Arduino 101* with Intel® IoT Gateway which needs this conversion for all the I/O pins

``` js
    var OFFSET = 512;
```

3.  Instantiate a `Gpio` object on GPIO pin 13 which is connected to LED and add the offset

``` js
    var io = new mraa.Gpio(OFFSET + 13);
```

4.  Create a loop that will call a function to blink LED with the JavaScript setInterval() function

5.  The final code should look like this:

``` js
var mraa = require("mraa");
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");

var OFFSET = 512;
var io = new mraa.Gpio(OFFSET + 13);
io.dir(mraa.DIR_OUT);

// configure the LED gpio as an output
console.log("Using LED pin number: " + '13');

// now we are going to flash the LED by toggling it at a periodic interval
var ledState;
var periodicActivity = function() {
   ledState = io.read(); // get the current state of the LED pin
   io.write(ledState ? 0 : 1); // if the pin is currently 1 write a '0' (low) else write a '1' (high)
   process.stdout.write(ledState ? '0' : '1'); // and write an unending stream of toggling 1/0's to the console
};
var intervalID = setInterval(periodicActivity, 1000); // start the periodic toggle
```

### Disable Node-Red service

** Please be sure to disable the Node-Red service running on your Gateway!**

*   The IP address that you see on the LCD screen is a Node-Red flow running on boot, since Node-Red uses the device resources through ttyACM0 node it is required to stop it before we run our Node JS programs

*   Open a ssh terminal to your Gateway and give following command:

    `sudo systemctl stop node-red-experience`

*   Check that service has stopped

    `sudo systemctl status node-red-experience`

## Run your LED blink program

![](./images/image_arduino_led.png)

Open a SSH terminal to your Intel® IoT Gateway and go to your **LEDBlink** folder. Type the following command to run your JS application

`node main.js`

This should execute your program and you should see LED blinking on your Arduino 101* board.The LED is located near the center of the board as shown in the figure

## Setup the temperature sensor and LCD screen

### Plug in the Grove shield, temperature sensor and the LCD

![temperature sensor](./images/temperature-sensors.jpg)

Connect the Temperature sensor (Analog) and LCD display (I<sup>2</sup>C) to your Arduino 101*. Write code for NodeJS and measure temperature in Celsius using upm library, convert it to Fahrenheit, then display it on the LCD.

1.  Install the Grove Base Shield onto the Arduino 101* Arduino expansion board.

2.  Connect **Grove Temperature Sensor** to analog pin **A0** of the Grove Base Shield.

3.  Connect **Grove LCD** display to one of the **I<sup>2</sup>C** pins.

## Create a temperature sensor project

*   On your Intel® IoT Gateway under **labs/sensors** folder create another folder **temperature-sensor**

*   In the labs/sensors/temperature-sensor folder create a **main.js** file

## Write the Code to Read the Temperature Sensor.

Update <span class="icon file">main.js</span> to read the temperature sensor on program start up and log it to the console.

1.  Add below lines to include the FIRMATA subplatform for MRAA. The Arduino 101* is accessed via ttyACM0 port

  ``` js
  var mraa = require("mraa");
  mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");
  ```

2.  Create an offset var of 512\. This offset is required since we use Firmata to connect Arduino 101* with Intel® IoT Gateway which needs this conversion for all the I/O pins

    ``` js
    var OFFSET = 512;
    ```

3.  Include the JS UPM library for the basic Grove sensors.

    ``` js
    var groveSensor = require('jsupm_grove');
    ```

4.  Instantiate a `GroveTemp` Grove Sensor on analog pin 1 and add the offset. Here 0.66 is a scaling factor, the grove temp sensor is designed to read value at 3.3V however since we are using 5.5V we need this conversion factor

    ``` js
    var temp = new groveSensor.GroveTemp(0+OFFSET, 0.66);
    ```

5.  Create a loop that will call a function to get the temperature once per second with the JavaScript setInterval() function

6.  The final code should look like this:

    ``` js
    var mraa = require("mraa");
    mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");

    var OFFSET = 512;
    var groveSensor = require('jsupm_grove');
    var temp = new groveSensor.GroveTemp(0+OFFSET, 0.66);

    function monitor() {
        setInterval(function() {
            var celsius = temp.value();
            var fahrenheit = Math.round(celsius * 9.0 / 5.0 + 32.0);
            console.log(celsius + "° Celsius, or " + fahrenheit + "° Fahrenheit");
        }, 1000);
    }
    monitor();
    ```

7.  Make sure your changes to <span class="icon file">main.js</span> have been saved and now from a ssh terminal go to the temperature-sensor folder and type following to run it:

    `node main.js`

8.  If successful, you should see the temperature output on the console.

## Add the LCD Screen

Update <span class="icon file">main.js</span> to output the value from the temperature sensor to the LCD display.

Below are the general steps to complete the exercise.

1.  Similar to using `require('jsupm_grove')` to include the JavaScript UPM library for the basic Grove components, **include the UPM library for I<sup>2</sup>C-type LCDs**:

    `var LCD = require('jsupm_i2clcd');`

2.  The specific LCD you have is the **JHD1313M1** Grove RBG LCD. **Instantiate a new `LCD.Jhd1313m1` object.** The constructor accepts 3 parameters in this order:

    <dl>

    <dt>I<sup>2</sup>C bus (Number)</dt>

    <dd>For Gateway and Arduino101*, **use `0`** with an offset of **`512`**.</dd>

    <dt>lcdAddress (Number)</dt>

    <dd>The JHD1313M1 has two I<sup>2</sup>C addreses: this address identifies the LCD display. **Use `0x3E`.**</dd>

    <dt>rgbAddress (Number)</dt>

    <dd>The JHD1313M1 has two I<sup>2</sup>C addreses: this address identifies the RGB backlight. **Use `0x62`.**</dd>

    </dl>

3.  To write to the LCD, you need to:

    1.  First, **set the cursor position**.  
        e.g. `(0,0)` for the top left. The JHD1313M1 has 2 rows (y) and 16 columns (x).
    2.  Then, **write** a string/message to the screen.  
        e.g. `"Temp: " + celsius + "C or " + fahrenheit + "F"`

    The API documentation for generic I<sup>2</sup>C LCDs can be found here: [http://iotdk.intel.com/docs/master/upm/node/classes/lcd.html#methods](http://iotdk.intel.com/docs/master/upm/node/classes/lcd.html#methods)

4.  As a bonus, you can **change the LCD backlight color**.  
    e.g. `(255,255,255)` for white.

    The API documentation for the specific Grove RBG LCD you have can be found here: [http://iotdk.intel.com/docs/master/upm/node/classes/jhd1313m1.html#methods](http://iotdk.intel.com/docs/master/upm/node/classes/jhd1313m1.html#methods)

5.  Use the steps and reference links above to output the value from the temperature sensor to the LCD display.

6.  Below is an example of the final solution.

    ``` js var mraa = require("mraa"); mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0"); // Include the JavaScript UPM libraries var groveSensor = require('jsupm_grove'); var LCD = require("jsupm_i2clcd"); // Create a new instance of a Grove RGB LCD screen // The Offset is necessary for Firmata var OFFSET = 512; // Instantiate the temperature sensor and LCD actuator var temp = new groveSensor.GroveTemp(0+OFFSET, 0.66); // Create a new instance of a Grove Temperature Sensor var screen = new LCD.Jhd1313m1(0+OFFSET, 0x3E, 0x62); // monitor - creates an anonymous function that runs once per second // The function will get the temperature and display it on the LCD. function monitor() { setInterval( function() { // Read the temperature sensor var celsius = temp.value(); // Convert it to fahrenheit var fahrenheit = Math.round(celsius * 9.0 / 5.0 + 32.0); // Log it to the console window console.log(celsius + "° Celsius, or " + fahrenheit + "° Fahrenheit"); // Update the LCD screen screen.setCursor(0, 0); screen.setColor(255, 255, 255); screen.write("Temp: " + celsius + "C or " + fahrenheit + "F"); }, 1000); } // Call the monitor function once monitor(); ```

## Deploy the temperature sensor application

Run your application from ssh terminal of your Intel® IoT Gateway by going to the folder temperature-sensor with command

    node main.js

You should now see the temperature displayed on the LCD.

## Sample Exercises">

**Exercise 1: Alarm Clock**

Take a look at the javascript [alarm clock](https://github.com/intel-iot-devkit/how-to-code-samples/tree/master/alarm-clock/javascript) sample code, there might be few additional changes required for NUC with Arduino 101* which is explained in the README

**Exercise 2: Earthquake Detector**

Take a look at the javascript [earthquake detector](https://github.com/intel-iot-devkit/how-to-code-samples/tree/master/earthquake-detector/javascript) sample code, refer to the README for connections and few additional changes required for NUC with Arduino 101*

There are a number of additional examples available for reference as [how-to-code-samples](https://github.com/intel-iot-devkit/how-to-code-samples) on git hub

## Additional resources">

Information, community forums, articles, tutorials and more can be found at the [Intel Developer Zone](https://software.intel.com/iot).

For reference code for any sensor/actuator from the Grove* IoT Commercial Developer Kit, visit [https://software.intel.com/en-us/iot/hardware/sensors](https://software.intel.com/en-us/iot/hardware/sensors)

#### Sensors and Actuators APIs - UPM API Doxygen Reference

*   [C++ Sensor/Actuator API libmraa (v1.5.1) and UPM (v1.0.2)](https://iotdk.intel.com/docs/master/upm/)
*   [Java Sensor/Actuator API libmraa (v1.5.1) and UPM (v1.0.2)](https://iotdk.intel.com/docs/master/upm/java/)
*   [Python Sensor/Actuator API libmraa (v1.5.1) and UPM (v1.0.2)](https://iotdk.intel.com/docs/master/upm/python/)
*   [NodeJS Sensor/Actuator API libmraa (v1.5.1) and UPM (v1.0.2)](https://iotdk.intel.com/docs/master/upm/node/)

#### Grove Temperature Sensor

*   [Seeed Studio Wiki: Grove Temperature Sensor](http://www.seeedstudio.com/wiki/Grove_-_Temperature_Sensor_V1.2)
*   [UPM API - GroveTemp](http://iotdk.intel.com/docs/master/upm/node/classes/grovetemp.html#methods)
*   [UPM C++ example: Grove Temperature Sensor](https://github.com/intel-iot-devkit/upm/blob/master/examples/c%2B%2B/grovetemp.cxx)
*   [UPM JavaScript example: Grove Temperature Sensor](https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/grovetemp.js)

#### Grove LCD RGB Backlight

*   [Seeed Studio Wiki: LCD RGB Backlight](http://www.seeedstudio.com/wiki/Grove_-_LCD_RGB_Backlight)
*   [UPM API - i2clcd](http://iotdk.intel.com/docs/master/upm/node/classes/lcd.html#methods)
*   [UPM API Doxygen - Jhd1313m1](http://iotdk.intel.com/docs/master/upm/node/classes/jhd1313m1.html#methods)
*   [UPM API - Jhd1313m1](https://github.com/intel-iot-devkit/upm/blob/master/examples/c%2B%2B/jhd1313m1-lcd.cxx)
*   [C++ example: RGB LCD](https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/jhd1313m1-lcd.js)

#### Grove Button

*   [UPM JavaScript example: Grove Button](https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/grovebutton.js)
*   [Seeed Studio Wiki: Grove Button](http://www.seeedstudio.com/wiki/Grove_-_Button)

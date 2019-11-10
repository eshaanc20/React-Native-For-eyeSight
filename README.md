# eyeSight

Mobile app that identifies colors in an image and determines the most dominant color in the image. This app was created to help people that have difficulties identifying colors.

## Developers
Eshaan Chaudhari<br>
Parshva Shah

## How we built the app
React native was used to create the front-end for the app. For the back-end, we used flask to create a python algorithm that 
detects colors in an image. We used libraries such as openCV and NumPy. The flask back-end can be found 
at [https://github.com/eshaanc20/eyeSight-backend](https://github.com/eshaanc20/eyeSight-backend). The flask back-end
was deployed to heroku. The front-end will send the image taken by the user to the back-end by using an axios post request. 
The back-end algorithm will process the image and returns the data for the colors in the image which is
displayed using a pie chart. 

## Running the project on local computer
Download this repository and download the Expo app on mobile device. Download all dependencies using:

#### `npm install`

Run the app using:

#### `npm start`

A QR code will show up that can be scanned on mobile device and the project will be opened in the Expo app.



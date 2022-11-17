# Crib

Welcome to Crib - Subleasing made easy. Please follow the steps carefully to set up your work environemnt.

Clone the Front branch to your local machine (steps are as below)
1. Make a folder locally and name it Crib (or whatever is easiest)
2. Open the foler in vsc (assuming you use VSC), open a terminal and type in 'git clone https://github.com/Crib-Sublease-Made-Easy/Crib.git'
3. REMEMBER to cd to the Crib directory before procceding, if you enter ls in the terminal, you should see App.js, Screens etc.
4. In terminal, type yarn
5. In terminal, type cd ios && pod install && cd ..


Thats about it! If there are no errors then you are off to a good start! 


---------- BEFORE YOU RUN THE SIMULATOR ----------

search the instance of crib-llc and switch it to crib-llc-dev

VSC allows you to search for this instance and change all of it at once. Use the search icon on the ledt and enter crib-llc on the top and 
crib-llc-dev in the next input box then press replace all.

MUST do this before you proceed.

---------- BEFORE YOU RUN THE SIMULATOR ----------


How to actually run the project on a simulator

If you use a mac:
1. Open the project in your vsc, then in terminal type in 'npx react-native start' (without the '')
Assuming you have xcode
2. Open Xcode, select 'open a project or file'. You should open your local Crib folder, go to the Crib directory, then open ios folder, then select the 
lighthouse.xcworkspace .
3. If you use an iphone, conenct your iphone with a cable, go to products tab, select destination, then select your iphone.
4. Lastly, run build and wait.

If you don't use windows:
1. Open your Crib folder in vsc and cd to the Crib directory, if you type in ls, you should see App.js, Screens etc.
2. Open the terminal in vsc and cd to the directory above and enter npx react-native start
3. OEPN ANOTHER terminal, go to the same directory as above and run npx react-native run-ios --simulator='iPhone 12 (15.5)' 
4. Wait until the simulator pops out and you're good to go.

5.If you are using the simulator, after the crib application opens, press I/O then toggle connect hardware keyboard under keyboard. You want to use the keyboard inside the phone rather than the hardware keyboard when designing. So you want the connect hardware keyboard option to be unselected. If the keyboard doesn't show up and using the hardware keyboard doesnt work, try toggling that option.


Message me (Isaac) on slack if you have any problems/questions.

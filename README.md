# nn_gui

A drag-n-drop based GUI for designing neural networks.

The blocks represent the layers of the network, or operations on tensors.

Once the network is designed you can download auto-generated code that implements that network in common interfaces such as pytorch and tensorflow.


----------------------------------------
This directory always refers to the directory this README is contained in
Ive only tried these steps in an ubuntu enviroment

# Initial set up
    In this directory:

    Install npm
    $ sudo apt install npm

        if some fail to install, do
        $ sudo apt-get update
        then run again
    
    Now, enter pip enviroment, to set up api requirements
    $ pipenv shell 

    Install requirements
    $ pipenv install fastapi
    $ pipenv install uvicorn

    exit the pip enviroment
    $ exit

    Now to set up svelte

    enter front/
    $ cd front/

    Install requirements
    $ npm install

    Build svelte app
    $ npm run build


# To run on local host
    In this directory:
    
    First, enter pip enviroment
    $ pipenv shell 

    Then run it
    $ uvicorn api:app --reload


    Once you're done
    Ctrl-C to kill process

    Then exit the pip enviroment
    $ exit

# To see a change youve made
    
    Rebuild svelte app
    $ cd front
    $ npm run build

    You may have to clear your browser cache
        For chrome
            click three dots on right
            select more tools
            select Clear Browsing Data
            click clear data


# The Basics

    front end work is done in front/src
    back end work is done in back/
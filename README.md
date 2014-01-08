jenkins-radiator
================

A light information radiator for Jenkins made with Node.js and Angular.js

Setup
======
1. `npm link`
    - this will install express
2. configure jenkins parameters:
    - to run in mock mode
        - start the mocked jenkins server: `node mockJenkins.js`
    - to run integrated with real Jenkins server:
        - create a configuration file for your Jenkins server by copying mock.js in `your_config_name.js`
        - edit `your_config_name.js`
        - change the port of the node.js server
        - change the jenkins server hostname and port
        - change the jenkins path to jobs
        - change the jenkins username and password (leave empty if jenkins does not require authentication)
3. choose what jobs to be displayed
    - for mock mode: nothing to change
    - for Jenkins integration mode: set your job names inside jobNames array in info_radiator.js
4. start the server
    - `node server.js <configuration>`
    - for mock mode: `configuration` is `mock`
    - for Jenkins integration mode: `configuration` is `your_config_name`
5. go to http://localhost:8888
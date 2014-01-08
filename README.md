jenkins-radiator
================

An information radiator for Jenkins made with Node.js and Angular.js

Setup
======
1. npm link
    - this will install express
2. configure jenkins connection parameters in config.js
    - the port of the node.js server
    - the jenkins server hostname and port
    - the jenkins path to jobs
    - the jenkins username and password (leave empty if jenkins does not require authentication)
3. choose what jobs to be displayed
    - add your job names inside jobNames array in info_radiator.js
4. node server.js to start the server
5. go to http://localhost:8888
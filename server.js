var express = require('express'), http = require('http'), config = require('./config'), app = express();

app.use(express.static(__dirname + '/public'));

console.log("Server started on port " + config.port);
console.log("Jenkins server is " + config.jenkinsHostname + ":" + config.jenkinsPort);

app.get('/job/:jobName', function(request, response){

    var jobName = request.params.jobName;

    console.log('Got request for ' + jobName);

    var options = {
        hostname: config.jenkinsHostname,
        port: config.jenkinsPort,
        path: config.jenkinsJobsPath + jobName +'/lastBuild/api/json',
        method: 'GET',
        auth: config.jenkinsUsername + ':' + config.jenkinsPassword
    };

    function fillCodeChanges(myJob, jenkinsJob) {
        myJob.changes = [];
        jenkinsJob.changeSet.items.forEach(function (item) {
            myJob.changes.push(item.msg);
        });
    }

    function fillStartedBy(myJob, jenkinsJob) {
        if(jenkinsJob.actions){
            jenkinsJob.actions.forEach(function (action) {
                if(action && action.causes){
                    action.causes.forEach(function (cause) {
                        if(cause.userName){
                            myJob.startedBy = cause.userName;
                        }
                    });
                }
            });
        }
    }

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var data = '';

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            if(res.statusCode === 200){
                handleSuccess();
            }else{
                handleError(data);
            }
        });

        function handleSuccess() {
            var jenkinsJob = JSON.parse(data);
            var myJob = {
                'name': jobName,
                'fullName': jenkinsJob.fullDisplayName
            };
            fillStartedBy(myJob, jenkinsJob);
            if (jenkinsJob.building) {
                myJob.runningDuration = new Date().getTime() - jenkinsJob.timestamp;
                myJob.estimatedDuration = jenkinsJob.estimatedDuration;
                if (myJob.runningDuration >= myJob.estimatedDuration * 1.2) {
                    myJob.status = 'redBlink';
                } else {
                    myJob.status = 'blue';
                }
            } else {
                if (jenkinsJob.result === 'SUCCESS') {
                    myJob.status = 'green';
                } else if (jenkinsJob.result === 'FAILURE') {
                    myJob.status = 'red';
                    fillCodeChanges(myJob, jenkinsJob);
                } else {
                    myJob.status = 'yellow';
                    fillCodeChanges(myJob, jenkinsJob);
                }
            }
            console.log(myJob);
            response.send(myJob);
        }
    });

    req.on('error', function(e) {
        handleError(e.message);
    });

    function handleError(message) {
        console.log('Error on response: ' + message);
        response.status(500).send(message);
    }

    req.end();
});

app.listen(config.port);



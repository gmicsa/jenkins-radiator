var express = require('express'), http = require('http'), app = express();

var port = 8889;

console.log("Jenkins mock started on port " + port);

var mockedJobs = {
    'JOB-1' : createJob('JOB-1', 'green'),
    'JOB-2' : createJob('JOB-2', 'blue'),
    'JOB-3' : createJob('JOB-3', 'yellow'),
    'JOB-4' : createJob('JOB-4', 'red'),
    'JOB-5' : createJob('JOB-5', 'redBlink')
};

function createJob(name, status) {
    var job = {};
    job.name = name;
    job.fullDisplayName = name;
    job.changeSet = {};
    job.changeSet.items = [];
    job.actions = [];
    var action = {};
    action.causes = [];
    job.actions.push(action);
    job.building = false;
    if(status === 'blue'){
        job.building = true;
        job.timestamp = new Date().getTime() - 200000;
        job.estimatedDuration = 600000;
    } else if(status === 'redBlink'){
        job.building = true;
        job.timestamp = new Date().getTime() - 2320000;
        job.estimatedDuration = 27000;
        action.causes.push({'userName' : 'Donald Duck'});;
    } else if(status === 'green'){
        job.result = 'SUCCESS';
    } else if(status === 'red'){
        job.result = 'FAILURE';
        job.changeSet.items.push({'msg':'[mickey_mouse] some refactoring'});
    }else {
        job.result = 'YELLOW';
        job.changeSet.items.push({'msg':'[tom&jerry] user repository committed '});
    }
    console.log(job);
    return job;
}

app.get('/jobs/:jobName/lastBuild/api/json', function(request, response){
    var jobName = request.params.jobName;
    console.log('Got request for ' + jobName);
    var job = mockedJobs[jobName];
    if(job){
        response.send(job);
    }else{
        response.status(404).send('Not found');
    }
});

app.listen(port);
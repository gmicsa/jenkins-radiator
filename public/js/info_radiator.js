angular.module('info_radiator', ['ui.bootstrap', 'info_radiator_controllers'], function () {
});

angular.module('info_radiator_controllers', [], function () {
});

function JenkinsCtrl($scope, $http, $interval) {
    var STATUS_PRIORITIES = {'redBlink': '1', 'blue': '2', 'red': '3', 'yellow': '4', 'green': '5', 'grey': '6'};
    var jobNames = ['JOB-1','JOB-2','JOB-3','JOB-4','JOB-5','JOB-6'];

    $scope.jobs = [];

    jobNames.forEach(function(jobName){
        $scope.jobs.push({name: jobName, status: 'grey'});
    });

    $scope.jobPrioritySorter = function(job) {
        return STATUS_PRIORITIES[job.status] + job.name;
    }

    function retrieveJobInfo(job) {
        $http.get('job/' + job.name).success(function (data) {
            job.status = data.status;
            job.fullName = data.fullName;
            job.runningDuration = data.runningDuration;
            job.estimatedDuration = data.estimatedDuration;
            job.changes = data.changes;
            job.startedBy = data.startedBy;
            if(job.status === 'blue'){
                job.durationPercentage = getDurationPercentage(job);
            }
        }).error(function (data){
            console.log('Error getting job ' + job.name + ':\n' + data);
            job.status = 'grey';
        });
    }

    function refreshJobs(){
        console.log('Refreshing jobs');
        $scope.jobs.forEach(function (job){
            retrieveJobInfo(job);
        });
    }

    function getDurationPercentage(job){
        return {
            value: job.runningDuration * 100 / job.estimatedDuration,
            type: 'success'
        };
    }

    $interval(refreshJobs, 60000);
    refreshJobs();
};

function TimeCtrl($scope, $interval) {
    $scope.showDots = true;

    function refreshTime(){
        $scope.time = new Date();
        $scope.showDots = !$scope.showDots;
    }

    $interval(refreshTime, 1000);
    refreshTime();
};

function WeatherCtrl($scope, $interval) {
    var WEATHER_PAGE = "weather.html";

    function refreshWeather(){
        console.log('Refreshing weather');
        $scope.weatherSource = WEATHER_PAGE + "?random=" + Math.random();
    }

    $interval(refreshWeather, 3600000);
    refreshWeather();
};


import angular from 'angular';
import uiRouter from 'angular-ui-router';
import shiftsController from 'shifts/shifts';

const app = angular.module('app', [uiRouter]);

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('shifts', {
            url: '/',
            template: require('shifts/shifts.html'),
            controller: shiftsController

        })
        .state('about', {
            url: '/about',
            template: require('about/about.html')
        });

    $locationProvider.html5Mode(true);
});

export default app;
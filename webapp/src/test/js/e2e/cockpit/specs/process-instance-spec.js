/* jshint ignore:start */
'use strict';

var fs = require('fs');

var testHelper = require('../../test-helper');
var setupFile = require('./process-setup');

var dashboardPage = require('../pages/dashboard');
var definitionPage = require('../pages/process-definition');
var instancePage = require('../pages/process-instance');

describe('Cockpit Process Instance Spec', function() {

  describe('page navigation', function() {

    before(function() {
      return testHelper(setupFile, function() {

        dashboardPage.navigateToWebapp('Cockpit');
        dashboardPage.authentication.userLogin('admin', 'admin');
        dashboardPage.deployedProcessesList.selectProcess(0);
      });
    });


    it('should go to process instance view', function() {

      // given
      definitionPage.processInstancesTab.instanceId(1).then(function(instanceId) {

        // when
        definitionPage.processInstancesTab.selectInstanceId(1);

        // then
        expect(instancePage.pageHeaderProcessInstanceName()).to.eventually.eql(instanceId);
      });
    });


    it('should go to User Tasks tab', function() {

      // when
      instancePage.userTasksTab.selectTab();

      // then
      expect(instancePage.userTasksTab.isTabSelected()).to.eventually.be.true;
      expect(instancePage.userTasksTab.tabName()).to.eventually.eql(instancePage.userTasksTab.tabLabel);
    });


    it('should go to Called Process Instances tab', function() {

      // when
      instancePage.calledInstancesTab.selectTab();

      // then
      expect(instancePage.calledInstancesTab.isTabSelected()).to.eventually.be.true;
      expect(instancePage.calledInstancesTab.tabName()).to.eventually.eql(instancePage.calledInstancesTab.tabLabel);
    });


    it('should go to Incidents tab', function() {

      // when
      instancePage.incidentsTab.selectTab();

      // then
      expect(instancePage.incidentsTab.isTabSelected()).to.eventually.be.true;
      expect(instancePage.incidentsTab.tabName()).to.eventually.eql(instancePage.incidentsTab.tabLabel);
    });


    it('should go to Variables tab', function() {

      // when
      instancePage.variablesTab.selectTab();

      // then
      expect(instancePage.variablesTab.isTabSelected()).to.eventually.be.true;
      expect(instancePage.variablesTab.tabName()).to.eventually.eql(instancePage.variablesTab.tabLabel);
    });

  });


  describe('edit User Task assignee', function() {

    before(function() {
      return testHelper(setupFile, function() {
        dashboardPage.navigateToWebapp('Cockpit');
        dashboardPage.authentication.userLogin('admin', 'admin');
        dashboardPage.deployedProcessesList.selectProcess(0);
        definitionPage.processInstancesTab.selectInstanceId(0);
      });
    });


    it('should open user tasks tab', function() {

      // when
      instancePage.userTasksTab.selectTab();

      // then
      expect(instancePage.userTasksTab.table().count()).to.eventually.eql(1);
      expect(instancePage.userTasksTab.activity(0).getText()).to.eventually.eql('User Task 1');
    });


    it('should select user task', function() {

      // when
      instancePage.userTasksTab.activity(0).click();

      // then
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;
    });


    it('should add new assignee', function() {

      // when
      instancePage.userTasksTab.addNewAssignee(0, 'Franz');

      // then
      expect(instancePage.userTasksTab.assignee(0).getText()).is.eventually.eql('Franz');
    });

  });


  describe('diagram interaction', function() {

    before(function() {
      return testHelper(setupFile, function() {
        dashboardPage.navigateToWebapp('Cockpit');
        dashboardPage.authentication.userLogin('admin', 'admin');
        dashboardPage.deployedProcessesList.selectProcess(0);
        definitionPage.processInstancesTab.selectInstanceId(0);
      });
    });


    it('should display process diagram', function() {
      expect(instancePage.diagram.diagramElement().isDisplayed()).to.eventually.be.true;
    });


    it('should select unselectable task', function() {

      // when
      instancePage.diagram.selectActivity('UserTask_2');

      // then
      expect(instancePage.diagram.isActivitySelected('UserTask_2')).to.eventually.be.false;
    });


    it('should display the number of concurrent activities', function() {
      expect(instancePage.diagram.instancesBadgeFor('UserTask_1').getText()).to.eventually.eql('1');
    });


    it('should process clicks in diagram', function() {

      // given
      instancePage.instanceTree.selectInstance('User Task 1');
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;

      // when
      instancePage.diagram.deselectAll();

      // then
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.false;
      expect(instancePage.instanceTree.isInstanceSelected('User Task 1')).to.eventually.be.false;
    });


    it('should keep selection after page refresh', function() {

      // given
      instancePage.instanceTree.selectInstance('User Task 1');
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;

      // when
      browser.getCurrentUrl().then(function(url) {
        browser.get(url).then(function() {
          browser.sleep(500);
        });
      });

      // then
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;
    });


    it('should reflect the tree view selection in diagram', function() {

      // given
      instancePage.instanceTree.selectInstance('User Task 1');
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.true;

      // when
      instancePage.instanceTree.deselectInstance('User Task 1');

      // then
      expect(instancePage.diagram.isActivitySelected('UserTask_1')).to.eventually.be.false;
    });

  });


  describe('cancel instance', function() {

    before(function() {
      return testHelper(setupFile, function() {
        dashboardPage.navigateToWebapp('Cockpit');
        dashboardPage.authentication.userLogin('admin', 'admin');
        dashboardPage.deployedProcessesList.selectProcess(0);
      });
    });


    it('cancel instances', function() {

      // given
      definitionPage.processInstancesTab.table().count().then(function(numberOfInstances) {
        definitionPage.processInstancesTab.selectInstanceId(0);

        // when
        instancePage.cancelInstance.cancelInstance();

        // then
        expect(definitionPage.processInstancesTab.table().count()).to.eventually.eql(numberOfInstances-1);
      });
    });

  });

});

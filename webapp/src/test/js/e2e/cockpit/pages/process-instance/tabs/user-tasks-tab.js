'use strict';

var Table = require('./../../table');

module.exports = Table.extend({

  tabRepeater: 'tabProvider in processInstanceTabs',
  tabIndex: 3,
  tabLabel: 'User Tasks',
  tableRepeater: 'userTask in userTasks',

/*  activity: function(item) {
    return this.tableItem(item, '.activity');
  },*/

  activity: function(item) {
    return this.table().get(item).element(by.binding('userTask.instance.name'));
  },

  assignee: function(item) {
    return this.tableItem(item, '.assignee');
  },

  addNewAssignee: function(item, inputValue) {
    this.tableItem(item, '.edit-toggle').click();
    element(by.css('.in-place-edit')).clear();
    element(by.css('.in-place-edit')).sendKeys(inputValue);
    this.tableItem(item, '.btn-group [type="submit"]').click();
  }

});

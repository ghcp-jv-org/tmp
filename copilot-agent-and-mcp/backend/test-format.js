// generated-by-copilot: Test file with inconsistent formatting
const fs = require('fs');
const path = require('path');

function processUserData(userData) {
  let result = {};
  if (userData.name) {
    result.displayName = 'Hello ' + userData.name;
  }

  if (userData['email']) {
    result.contact = userData.email;
  }

  if (userData.preferences) {
    result.settings = {
      theme: userData.preferences.theme || 'light',
      notifications: userData.preferences.notifications !== false,
    };
  }

  return result;
}

function validateInput(input) {
  if (!input) {
    return false;
  }

  if (typeof input !== 'object') {
    return false;
  }

  return true;
}

module.exports = {
  processUserData,
  validateInput,
};

const db = require('./db');
const Organization = require('./organization/Organization');
const organizationList = require('./organization/list');

// Empty all organizations
Organization.remove({}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Truncated all Organizations');
    }
});

// Create New Organizations
Organization.create(organizationList.map(organization => { return { name: organization.name }}),  (err, organization) => {
    if (err) {
        return 'There was an error adding organizations';
    }

    console.log('Created Organizations');
    // Exit the process
    process.exit();
});
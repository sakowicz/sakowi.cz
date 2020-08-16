require('./admin/_bootstrap');
require('datatables.net');
require('datatables.net-bs4');
require('./admin/sb-admin');

$(() => {
    $('#dataTable').DataTable();
});

module.exports = (route) => Route(route, () => {
    $(() => {
        $('#photosDataTable').DataTable({
            "pageLength": 100,
            "lengthMenu": [[10, 50, 100, -1], [10, 50, 100, "All"]],
            "order": [],
            "columnDefs": [{
                "targets": 'no-sort',
                "orderable": false,
            }]
        });
    });
});

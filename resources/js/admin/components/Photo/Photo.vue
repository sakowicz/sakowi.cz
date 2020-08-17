<template>
    <div class="container-fluid">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Zdjęcia</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="photosDataTable" width="100%" cellspacing="0">
                        <thead>
                        <tr>
                            <th class="no-sort">Podgląd</th>
                            <th>Tytuł</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <!--                        @foreach($photos as $photo)-->
                        <!--                        <tr>-->
                        <!--                            <td class="photo">-->
                        <!--                                <img alt="{{ $photo->title }}" src="/{{ $photo->image }}"></td>-->
                        <!--                            <td>{{ $photo->title }}</td>-->
                        <!--                            <td class="action">-->
                        <!--                                <a class="btn btn-info" href="">-->
                        <!--                                    <i class="fas fa-edit"></i>-->
                        <!--                                </a>-->
                        <!--                                @if($photo->is_on_homepage)-->
                        <!--                                <a class="btn btn-success" href="">-->
                        <!--                                    <i class="fas fa-toggle-on"></i>-->
                        <!--                                </a>-->
                        <!--                                @else-->
                        <!--                                <a class="btn btn-danger" href="">-->
                        <!--                                    <i class="fas fa-toggle-off"></i>-->
                        <!--                                </a>-->
                        <!--                                @endif-->
                        <!--                                <a class="btn btn-light" href="/{{ $photo->image }}" target="_blank">-->
                        <!--                                    <i class="fas fa-link"></i>-->
                        <!--                                </a>-->
                        <!--                            </td>-->
                        <!--                        </tr>-->
                        <!--                        @endforeach-->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
#photosDataTable {
    td {
        vertical-align: middle;
    }

    .photo {
        text-align: center;
        width: 1%;

        img {
            height: 100px;
        }
    }

    .action {
        text-align: right;
        white-space: nowrap;
        width: 1%;
    }
}

</style>

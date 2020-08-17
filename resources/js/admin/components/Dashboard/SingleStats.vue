<template>
    <div class="col-xl-3 col-md-6 mb-4">
        <div :class="cardClass + ' card shadow h-100 py-2'">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            {{ title }}
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {{ value }}
                        </div>
                    </div>
                    <div class="col-auto">
                        <i :class="icon + ' fa-2x text-gray-300'"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'value', 'icon', 'cardClass'],
}
</script>

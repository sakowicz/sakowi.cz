<template>
    <section class="no-padding">
        <div class="order-holder">
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <h3>{{ header }}</h3>
                    </div>
                    <div class="col-md-3">
                        <router-link :to="{ name: url }" class=" btn anim-button  trans-btn  transition fl-l">
                            <span>{{ subtitle }}</span><i :class="iconClass"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        props: ['header', 'url', 'subtitle', 'iconClass'],
    }
</script>

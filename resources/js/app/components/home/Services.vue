<template>
    <section class="section-columns section-columns-margin" id="sec2">
        <div class="section-columns-img">
            <div class="bg bg-ser transition" style="background-image:url(images/photos/ros.png)"></div>
        </div>
        <div class="section-columns-text section-columns-text-margin">
            <div class="custom-inner">
                <div class="container">
                    <h2>Czym się zajmuję</h2>
                    <div class="separator"></div>
                    <div class="clearfix"></div>
                    <ul class="services-holder">
                        <service
                            v-for="service in services"
                            v-bind:key="service.title"
                            :img="service.img"
                            :title="service.title"
                            :subtitle="service.subtitle"
                            :icon="service.icon"
                        >
                        </service>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    mounted() {
        $('.services-holder li').hover((elem) => {
            const bgSrc = $(elem.target).closest('li').data('bg-src');
            $('.bg-ser').css('background-image', `url("${bgSrc}")`);
        });
    },
    data() {
        return {
            services: [
                {
                    img: 'images/photos/ros.jpg',
                    title: 'Buduję aplikacje internetowe',
                    subtitle: 'Tworzę od podstaw portale oraz serwisy internetowe z użyciem najbezpieczniejszych frameworków.',
                    icon: 'fa fa-cubes',
                },
                {
                    img: 'images/photos/ros2.png',
                    title: 'Tworzę mikroserwisy',
                    subtitle: 'Buduję mikroserwisy zgodne z architekturą REST API. Używam do tego technologii zapewniających szybkość oraz skalowalność.',
                    icon: 'fa fa-server',
                },
                {
                    img: 'images/photos/ros3.png',
                    title: 'Rozwijam istniejące projekty',
                    subtitle: 'Zajmuję się rozwijaniem oraz udoskonalaniem istniejących webaplikacji.',
                    icon: 'fa fa-tasks',
                },
                {
                    img: 'images/photos/ros.jpg',
                    title: 'Wiele więcej',
                    subtitle: 'Tworzę audyty bezpieczeństwa, projektuję architekturę, optymalizuję oraz zabezpieczam aplikacje internetowe.',
                    icon: 'fa fa-question',
                },
            ]
        }
    }
}
</script>

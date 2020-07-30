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
                    <ul class="servicses-holder">
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
        data() {
            return {
                services: [
                    {
                        img: 'images/photos/ros.png',
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
                        img: 'images/photos/ros.png',
                        title: 'Wiele więcej',
                        subtitle: 'Tworzę audyty bezpieczeństwa, projektuję architekturę, optymalizuję oraz zabezpieczam aplikacje internetowe.',
                        icon: 'fa fa-question',
                    },
                ]
            }
        }
    }
</script>

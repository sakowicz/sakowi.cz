<template>
    <div>
        <div id="wrapper">
            <div class="content-holder elem scale-bg2 transition3">
                <div class="content full-height">
                    <div class="scroll-page-nav">
                        <ul>
                            <li>
                                <a href="#sec1"></a>
                            </li>
                            <li>
                                <a href="#sec2"></a>
                            </li>
                        </ul>
                    </div>
                    <home-about></home-about>
                    <call-to-action
                        :header="'Zainteresowany współpracą?'"
                        :url="'contact'"
                        :subtitle="'Skontaktuj się ze mną'"
                        :iconClass="'fa fa-envelope-o'"
                    >
                    </call-to-action>
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
                                        <li data-bgscr="images/photos/ros.png">
                                            <i class="fa fa-cubes"></i>
                                            <h4>Buduję aplikacje internetowe</h4>
                                            <p>Tworzę od podstaw portale oraz serwisy internetowe z użyciem
                                                najbezpieczniejszych
                                                frameworków.</p>
                                        </li>
                                        <li data-bgscr="images/photos/ros2.png">
                                            <i class="fa fa-server"></i>
                                            <h4>Tworzę mikroserwisy</h4>
                                            <p>Buduję mikroserwisy zgodne z architekturą REST API. Używam do tego
                                                technologii
                                                zapewniających szybkość oraz skalowalność.</p>
                                        </li>
                                        <li data-bgscr="images/photos/ros3.png">
                                            <i class="fa fa-tasks"></i>
                                            <h4>Rozwijam istniejące projekty</h4>
                                            <p>Zajmuję się rozwijaniem oraz udoskonalaniem istniejących
                                                webaplikacji.</p>
                                        </li>
                                        <li data-bgscr="images/photos/ros.png">
                                            <i class="fa fa-question"></i>
                                            <h4>Wiele więcej</h4>
                                            <p>Tworzę audyty bezpieczeństwa, projektuję architekturę, optymalizuję oraz
                                                zabezpieczam aplikacje internetowe.</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <div class="left-decor"></div>
        <div class="right-decor"></div>
    </div>
</template>

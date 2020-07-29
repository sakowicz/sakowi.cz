<template>
    <div>
        <div id="wrapper">
            <!--=============== Content holder  ===============-->
            <div class="content-holder elem scale-bg2 transition3">
                <!--=============== Content  ===============-->
                <div class="content full-height">
                    <!-- Page navigation-->
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
                    <!-- Page navigation end-->
                    <!-- Page title section end-->
                    <!-- About   -->
                    <section class="section-columns" id="sec1">
                        <div class="section-columns-img about-me--columns-img">
                            <div class="bg" style="background-image:url(images/photos/about-me.jpg)"></div>
                        </div>
                        <div class="section-columns-text about-me-columns">
                            <div class="custom-inner">
                                <div class="container">
                                    <h2>O mnie</h2>
                                    <div class="separator"></div>
                                    <div class="clearfix"></div>
                                    <p>Nazywam się Szymon Sakowicz. Jestem programistą. Specjalizuję się w technologiach
                                        webowych (głównie w PHP oraz Node.JS) i bezpieczeństwie internetowym. Dodatkowo,
                                        z
                                        pasji
                                        zajmuję się
                                        <a href="/photography">fotografią</a>
                                        oraz
                                        <a
                                            href="https://republicofsimracers.com/"
                                        >simracingiem
                                        </a>
                                        .
                                    </p>
                                    <!--                            <p><b>Motosport</b> oraz <b>astronomia</b> od zawsze mnie fascynowały, <b>fotografia</b>-->
                                    <!--                                - moja kolejna pasja - daje mi możliwość uchywcenia: ułamków sekund - w przypadku-->
                                    <!--                                rajdów - oraz dłuższych ekspozycji - w przypadku astrofotografii.</p>-->
                                    <!--                            <p>Mieszkam we <b>Wrocławiu</b>, bywam w <b>Nysie</b>, tak więc obszar moich działań to-->
                                    <!--                                okolice tych miejscowości <i>(nie dotyczy rajdów)</i>.</p>-->
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <!-- About end  -->
                    <!-- Order  -->
                    <section class="no-padding">
                        <div class="order-holder">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-8">
                                        <h3>Zainteresowany współpracą? </h3>
                                    </div>
                                    <div class="col-md-3">
                                        <a href="/contact" class=" btn anim-button  trans-btn  transition fl-l"><span>Skontaktuj się ze mną</span><i
                                            class="fa fa-envelope-o"
                                        ></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <!--Order end  -->
                    <!-- services   -->
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
                    <!-- Services end   -->
                </div>
                <!-- Content end  -->
            </div>
            <!-- content holder end -->
        </div>
        <div class="left-decor"></div>
        <div class="right-decor"></div>
    </div>
</template>

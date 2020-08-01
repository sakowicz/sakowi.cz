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
                    <services></services>
                </div>
            </div>
        </div>
        <div class="left-decor"></div>
        <div class="right-decor"></div>
    </div>
</template>

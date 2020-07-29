<template>
    <header>
        <!-- Header inner  -->
        <div class="header-inner">
            <!-- Logo  -->
            <div class="logo-holder">
                <a href="/">
                    <img src="images/logo.png" alt="sakowi.cz logo">
                </a>
            </div>
            <!--Logo end  -->
            <!--Navigation  -->
            <div class="nav-button-holder">
                <div class="nav-button vis-m"><span></span><span></span><span></span>
                </div>
            </div>
            <div class="nav-holder">
                <nav>
                    <ul>
                        <li>
                            <router-link :to="{ name: 'home' }">Strona główna</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'photography' }">Fotografia</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'contact' }">Kontakt</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

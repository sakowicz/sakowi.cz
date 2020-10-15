<template>
    <header>
        <div class="header-inner">
            <div class="logo-holder">
                <router-link :to="{ name: 'home' }">
                    <img src="/img/logo.png" alt="sakowi.cz logo">
                </router-link>
            </div>
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

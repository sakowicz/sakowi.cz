<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="{{ route('admin.home.index') }}">
        <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-laugh-wink"></i>
        </div>
        <div class="sidebar-brand-text mx-3">sakowi.cz</div>
    </a>

    <hr class="sidebar-divider my-0">

    <li class="nav-item {{ RouteHelper::isActiveRoute('admin.home') }}">
        <a class="nav-link" href="{{ route('admin.home.index') }}">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>{{ __('Dashboard') }}</span></a>
    </li>

    <hr class="sidebar-divider">

    <li class="nav-item {{ RouteHelper::isActiveRoute('admin.photo') }}">
        <a class="nav-link" href="{{ route('admin.photo.index') }}">
            <i class="fas fa-fw fa-table"></i>
            <span>{{ __('Zdjęcia') }}</span></a>
    </li>

    <hr class="sidebar-divider d-none d-md-block">

    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

</ul>

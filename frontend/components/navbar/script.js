document.write(`
    <nav class="navbar navbar-expand-lg bg-body-tertiary" id="global-navbar">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Tourist Office</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Αρχική</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Πακέτα</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Δημιουργία πακέτου</a>
                    </li>
                </ul>
                <!-- <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form> -->

                <a href="#" class="btn btn-primary" id="loginLinkButton">
                    Σύνδεση
                </a>
            </div>
        </div>
    </nav>
`);
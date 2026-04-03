const params = new URLSearchParams(window.location.search)
const shortUrl = params.get('p')
const container = document.getElementById('movie-details')

function escapeHtml(value) {
    if (value === null || value === undefined) return ''
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

function formatDate(dateString) {
    if (!dateString) return 'N/A'

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date)
}

function formatRuntime(minutes) {
    if (!minutes || Number.isNaN(Number(minutes))) return 'N/A'

    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hrs > 0) {
        return `${hrs}h ${mins}min`
    }

    return `${mins}min`
}

function renderMovieDetails(movie) {
    const actors = (movie.movieActors || [])
        .map(item => item.actor?.name)
        .filter(Boolean)

    const genres = (movie.movieGenres || [])
        .map(item => item.genre?.name)
        .filter(Boolean)

    const descriptionHtml = (movie.description || '')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p class="card-text text-body-secondary">${escapeHtml(line)}</p>`)
        .join('')

    const genreBadges = genres.length
        ? genres.map(genre => `<span class="badge text-bg-warning text-dark me-2 mb-2">${escapeHtml(genre)}</span>`).join('')
        : '<span class="text-body-secondary">Nema podataka</span>'

    const actorsHtml = actors.length
        ? actors.map(actor => `<li class="list-group-item bg-transparent text-light border-secondary">${escapeHtml(actor)}</li>`).join('')
        : '<li class="list-group-item bg-transparent text-light border-secondary">Nema podataka</li>'

    container.innerHTML = `
        <div class="col-12">
            <div class="card border-0 shadow-sm overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-4 col-lg-3">
                        <img 
                            src="${escapeHtml(movie.poster || '')}" 
                            alt="${escapeHtml(movie.title || 'Poster filma')}" 
                            class="img-fluid w-100 h-100 object-fit-cover"
                            style="min-height: 100%;"
                        >
                    </div>
                    <div class="col-md-8 col-lg-9">
                        <div class="card-body h-100 d-flex flex-column">
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                ${movie.active ? '<span class="badge text-bg-success">Aktivan</span>' : '<span class="badge text-bg-secondary">Neaktivan</span>'}
                                <span class="badge text-bg-dark">${escapeHtml(formatDate(movie.startDate))}</span>
                                <span class="badge text-bg-dark">${escapeHtml(formatRuntime(movie.runTime))}</span>
                            </div>

                            <h1 class="card-title mb-1">${escapeHtml(movie.title || 'Bez naziva')}</h1>
                            <h5 class="text-body-secondary mb-3">${escapeHtml(movie.originalTitle || '')}</h5>

                            <p class="lead">${escapeHtml(movie.shortDescription || '')}</p>

                            <div class="row g-3 mt-2">
                                <div class="col-sm-6">
                                    <div class="border rounded p-3 h-100">
                                        <div class="small text-uppercase text-body-secondary mb-1">Režiser</div>
                                        <div class="fw-semibold">${escapeHtml(movie.director?.name || 'N/A')}</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="border rounded p-3 h-100">
                                        <div class="small text-uppercase text-body-secondary mb-1">Početak prikazivanja</div>
                                        <div class="fw-semibold">${escapeHtml(formatDate(movie.startDate))}</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="border rounded p-3 h-100">
                                        <div class="small text-uppercase text-body-secondary mb-1">Trajanje</div>
                                        <div class="fw-semibold">${escapeHtml(formatRuntime(movie.runTime))}</div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="border rounded p-3 h-100">
                                        <div class="small text-uppercase text-body-secondary mb-1">Šifra filma</div>
                                        <div class="fw-semibold">${escapeHtml(movie.internalId || 'N/A')}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4">
                                <div class="small text-uppercase text-body-secondary mb-2">Žanrovi</div>
                                <div>${genreBadges}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-8">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <h3 class="card-title mb-3">
                        <i class="fa-solid fa-film text-warning me-2"></i>Opis filma
                    </h3>
                    ${descriptionHtml || '<p class="text-body-secondary mb-0">Opis nije dostupan.</p>'}
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h3 class="card-title mb-3">
                        <i class="fa-solid fa-masks-theater text-warning me-2"></i>Glumačka postava
                    </h3>
                    <ul class="list-group list-group-flush">
                        ${actorsHtml}
                    </ul>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h3 class="card-title mb-3">
                        <i class="fa-solid fa-circle-info text-warning me-2"></i>Dodatne informacije
                    </h3>

                    <div class="mb-3">
                        <div class="small text-uppercase text-body-secondary">Originalni naslov</div>
                        <div>${escapeHtml(movie.originalTitle || 'N/A')}</div>
                    </div>

                    <div class="mb-3">
                        <div class="small text-uppercase text-body-secondary">Korporativni ID</div>
                        <div>${escapeHtml(movie.corporateId || 'N/A')}</div>
                    </div>

                    <div class="mb-3">
                        <div class="small text-uppercase text-body-secondary">Kratki link</div>
                        <div>${escapeHtml(movie.shortUrl || 'N/A')}</div>
                    </div>

                    <div class="mb-0">
                        <div class="small text-uppercase text-body-secondary">Kreirano</div>
                        <div>${escapeHtml(formatDate(movie.createdAt))}</div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderError(message) {
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger shadow-sm mb-0" role="alert">
                <h4 class="alert-heading mb-2">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>Greška
                </h4>
                <p class="mb-0">${escapeHtml(message)}</p>
            </div>
        </div>
    `
}

if (!shortUrl) {
    renderError('Nije prosleđen parametar filma.')
} else {
    fetch(`https://movie.pequla.com/api/movie/short/${encodeURIComponent(shortUrl)}`)
        .then(rsp => {
            if (!rsp.ok) {
                throw new Error('Film nije pronađen.')
            }
            return rsp.json()
        })
        .then(data => {
            renderMovieDetails(data)
        })
        .catch(err => {
            renderError(err.message || 'Došlo je do greške prilikom učitavanja detalja filma.')
        })
}
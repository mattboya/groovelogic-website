/*
  File: js/script.js
  Description: Main JavaScript file for the Groove Logic website.
  Everything here is progressive enhancement: the site works without it.
*/

(function() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('.site-header');

    // MARK: - Forms & footer

    // Listen for the pageshow event, which fires on initial load and when a page is restored from the back/forward cache.
    window.addEventListener('pageshow', function() {
        // Reset any contact/feedback form to its default empty state.
        document.querySelectorAll('form.contact-form').forEach(function(form) {
            form.reset();
        });
    });

    // Keep the footer copyright year current.
    document.querySelectorAll('.current-year').forEach(function(el) {
        el.textContent = new Date().getFullYear();
    });

    // MARK: - Header: glass background once the page scrolls

    if (header) {
        const updateHeader = function() {
            header.classList.toggle('is-scrolled', window.scrollY > 8 || document.documentElement.classList.contains('menu-open'));
        };
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // MARK: - Mobile menu

    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (header && toggle && menu) {
        const mobileQuery = window.matchMedia('(max-width: 760px)');
        const outside = document.querySelectorAll('main, footer, .skip-link');

        const setOpen = function(open, returnFocus) {
            header.classList.toggle('menu-open', open);
            document.documentElement.classList.toggle('menu-open', open);
            header.classList.toggle('is-scrolled', open || window.scrollY > 8);
            toggle.setAttribute('aria-expanded', String(open));
            outside.forEach(function(el) { el.inert = open; });
            if (open) {
                menu.querySelector('a').focus();
            } else if (returnFocus) {
                toggle.focus();
            }
        };

        toggle.addEventListener('click', function() {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true', true);
        });

        menu.addEventListener('click', function(event) {
            if (event.target.closest('a')) setOpen(false, false);
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && header.classList.contains('menu-open')) setOpen(false, true);
        });

        // Keep focus inside the open menu: Tab from the last link goes back to the toggle, and vice versa.
        header.addEventListener('keydown', function(event) {
            if (event.key !== 'Tab' || !header.classList.contains('menu-open')) return;
            const links = menu.querySelectorAll('a');
            const first = toggle;
            const last = links[links.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        mobileQuery.addEventListener('change', function(event) {
            if (!event.matches) setOpen(false, false);
        });
    }

    // MARK: - Active nav link

    if (menu) {
        const links = Array.from(menu.querySelectorAll('a'));
        const linkFor = function(id) {
            return links.find(function(a) { return a.hash === '#' + id; });
        };
        const setActive = function(id) {
            links.forEach(function(a) { a.classList.toggle('is-active', a === linkFor(id)); });
        };

        const sections = links
            .map(function(a) { return document.getElementById(a.hash.slice(1)); })
            .filter(Boolean);

        if (sections.length && 'IntersectionObserver' in window) {
            // The section crossing the middle of the viewport is the current one.
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            sections.forEach(function(section) { observer.observe(section); });
        } else if (document.body.dataset.nav) {
            // App and legal pages highlight the section they belong to.
            setActive(document.body.dataset.nav);
        }
    }

    // MARK: - Scroll reveal

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
        // Stagger siblings inside grids so they arrive one after another.
        document.querySelectorAll('.apps-grid, .feature-grid').forEach(function(grid) {
            Array.from(grid.children).forEach(function(child, i) {
                child.style.setProperty('--reveal-delay', (i % 4) * 90 + 'ms');
            });
        });
        const revealer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(function(el) { revealer.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('is-visible'); });
    }

    // MARK: - Pause the hero animation while it's off-screen

    document.querySelectorAll('.hero, .not-found').forEach(function(scene) {
        if (!('IntersectionObserver' in window)) return;
        new IntersectionObserver(function(entries) {
            scene.classList.toggle('is-paused', !entries[0].isIntersecting);
        }).observe(scene);
    });

    // MARK: - App tile tilt (mouse only)

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    document.querySelectorAll('.app-tile').forEach(function(tile) {
        tile.addEventListener('pointermove', function(event) {
            if (!finePointer.matches || reduceMotion.matches) return;
            const rect = tile.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            tile.classList.add('is-tilting');
            tile.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
            tile.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        });
        tile.addEventListener('pointerleave', function() {
            tile.classList.remove('is-tilting');
            tile.style.setProperty('--rx', '0deg');
            tile.style.setProperty('--ry', '0deg');
        });
    });

    // MARK: - Screenshot carousel

    const track = document.querySelector('.carousel-track');
    if (track) {
        const buttons = document.querySelectorAll('.carousel-btn');
        const controls = document.querySelector('.carousel-controls');
        const updateButtons = function() {
            const max = track.scrollWidth - track.clientWidth - 2;
            // Hide the arrows when every screenshot already fits.
            if (controls) controls.hidden = max <= 0;
            buttons.forEach(function(btn) {
                btn.disabled = btn.dataset.dir === '-1' ? track.scrollLeft <= 2 : track.scrollLeft >= max;
            });
        };
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                track.scrollBy({
                    left: Number(btn.dataset.dir) * track.clientWidth * 0.8,
                    behavior: reduceMotion.matches ? 'auto' : 'smooth'
                });
            });
        });
        track.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();
    }

    // MARK: - Screenshot lightbox

    const shots = Array.from(document.querySelectorAll('.shot'));
    if (shots.length && typeof HTMLDialogElement === 'function') {
        const dialog = document.createElement('dialog');
        dialog.className = 'lightbox';
        dialog.setAttribute('aria-label', 'Screenshot viewer');
        dialog.innerHTML =
            '<img alt="">' +
            '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>' +
            '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous screenshot">&larr;</button>' +
            '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next screenshot">&rarr;</button>';
        document.body.appendChild(dialog);

        const img = dialog.querySelector('img');
        let current = 0;
        const show = function(index) {
            current = (index + shots.length) % shots.length;
            const source = shots[current].querySelector('img');
            img.src = source.currentSrc || source.src;
            img.alt = source.alt;
        };

        shots.forEach(function(shot, i) {
            shot.addEventListener('click', function() {
                show(i);
                dialog.showModal();
            });
        });

        dialog.querySelector('.lightbox-close').addEventListener('click', function() { dialog.close(); });
        dialog.querySelector('.lightbox-prev').addEventListener('click', function() { show(current - 1); });
        dialog.querySelector('.lightbox-next').addEventListener('click', function() { show(current + 1); });
        dialog.addEventListener('click', function(event) {
            if (event.target === dialog) dialog.close();
        });
        dialog.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') show(current - 1);
            if (event.key === 'ArrowRight') show(current + 1);
        });
        dialog.addEventListener('close', function() {
            shots[current].focus();
        });
    }

    // MARK: - Sticky mobile App Store button

    const mobileCta = document.querySelector('.mobile-cta');
    const heroActions = document.querySelector('.app-actions');
    if (mobileCta && heroActions && 'IntersectionObserver' in window) {
        const ctaLink = mobileCta.querySelector('a');
        new IntersectionObserver(function(entries) {
            const visible = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
            mobileCta.classList.toggle('is-visible', visible);
            mobileCta.setAttribute('aria-hidden', String(!visible));
            ctaLink.tabIndex = visible ? 0 : -1;
        }).observe(heroActions);
    }

    // MARK: - Legal pages: "On this page" contents

    const toc = document.querySelector('.legal-toc');
    const legalHeadings = document.querySelectorAll('.privacy-content h2');
    if (toc && legalHeadings.length > 2) {
        const list = document.createElement('ol');
        const tocLinks = [];
        legalHeadings.forEach(function(h2, i) {
            if (!h2.id) {
                h2.id = h2.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section-' + (i + 1);
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h2.id;
            a.textContent = h2.textContent.replace(/^\d+\.\s*/, '');
            li.appendChild(a);
            list.appendChild(li);
            tocLinks.push(a);
        });
        const label = document.createElement('p');
        label.textContent = 'On this page';
        toc.append(label, list);
        toc.hidden = false;

        // Highlight the section whose heading most recently passed the top quarter of the screen.
        if ('IntersectionObserver' in window) {
            const tocObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    tocLinks.forEach(function(a) {
                        a.classList.toggle('is-active', a.hash === '#' + entry.target.id);
                    });
                });
            }, { rootMargin: '0px 0px -75% 0px' });
            legalHeadings.forEach(function(h2) { tocObserver.observe(h2); });
        }
    }
})();
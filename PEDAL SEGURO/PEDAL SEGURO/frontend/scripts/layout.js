document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        fetch('/frontend/_header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.outerHTML = data;
            });
    }

    if (footerPlaceholder) {
        fetch('/frontend/_footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.outerHTML = data;
            });
    }
});
(function() {
    const isEmbedded = window.self !== window.top;

    if (isEmbedded) {
        // הוספת קלאסים לעיצוב
        document.documentElement.classList.add('is-embedded');
        document.body.classList.add('is-embedded');

        const sendHeight = () => {
            // שימוש ב-getBoundingClientRect כפי שהיה בקוד המקורי שלך
            const height = document.body.getBoundingClientRect().height;
            const roundedHeight = Math.ceil(height);

            if (roundedHeight > 0) {
                window.parent.postMessage({ 
                    type: 'setHeight', 
                    height: roundedHeight 
                }, '*');
            }
        };

        // --- פתרון גלילה למעלה ---
        // ברגע שהסקריפט הזה נטען (כלומר עברנו דף בתוך ה-iframe)
        // אנחנו שולחים הודעה להורה שיגלול לתחילת ה-iframe
        window.parent.postMessage({ type: 'scrollToTop' }, '*');

        // --- שימוש ב-ResizeObserver על ה-body (כמו בבקשתך) ---
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                sendHeight();
            });
            // מאזין בדיוק ל-document.body כפי שהיה במקור
            resizeObserver.observe(document.body);
        } else {
            // Fallback למקרה שאין תמיכה ב-ResizeObserver
            window.addEventListener('load', sendHeight);
            const observer = new MutationObserver(sendHeight);
            observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        }

        window.refreshIframeHeight = sendHeight;
    }
})();
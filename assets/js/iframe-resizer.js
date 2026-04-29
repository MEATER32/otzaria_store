(function() {
    // בדיקה האם האתר רץ בתוך iframe
    const isEmbedded = window.self !== window.top;

    // רק אם אנחנו מוטמעים, נפעיל את הלוגיקה של הריסייזר
    if (isEmbedded) {
        document.documentElement.classList.add('is-embedded');
        document.body.classList.add('is-embedded');

        function sendHeight() {
            // מוודאים שהאלמנטים קיימים
            const wrapper = document.querySelector('.page-shell') || document.body;
            
            // מדידת גובה התוכן האמיתי
            const height = wrapper.scrollHeight;
            const roundedHeight = Math.ceil(height);

            // שליחה לאתר האב
            window.parent.postMessage({ 
                type: 'setHeight', 
                height: roundedHeight 
            }, '*');
        }

        // האזנה לשינויים בתוכן
        const observer = new MutationObserver(() => {
            sendHeight();
        });

        window.addEventListener('load', () => {
            sendHeight();
            observer.observe(document.body, { 
                attributes: true, 
                childList: true, 
                subtree: true 
            });
        });

        // עדכון בשינוי גודל חלון
        window.addEventListener('resize', sendHeight);
        
        // הפיכת הפונקציה לזמינה גלובלית לסקריפטים אחרים
        window.refreshIframeHeight = sendHeight;
    } else {
        // אם אנחנו לא בתוך iframe, נוודא שהקלאס לא קיים (למקרה של cache)
        document.documentElement.classList.remove('is-embedded');
        document.body.classList.remove('is-embedded');
    }
})();
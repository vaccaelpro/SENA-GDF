
(function () {
    'use strict';

    const INACTIVITY_TIMEOUT = 3 * 60 * 1000;
    const CHECK_INTERVAL = 60 * 1000;

    let inactivityTimer = null;
    let lastActivityTime = Date.now();

    function resetInactivityTimer() {
        lastActivityTime = Date.now();

        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }

        inactivityTimer = setTimeout(function () {
            logout('inactivity');
        }, INACTIVITY_TIMEOUT);
    }

    function checkSessionStatus() {
        fetch('config/check_session.php', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-cache'
        })
            .then(response => response.json())
            .then(data => {
                if (!data.active) {
                    logout('session_expired');
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }

    function logout(reason) {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
        }
        window.location.href = 'login.php?timeout=1';
    }

    function initActivityListeners() {
        const activityEvents = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        activityEvents.forEach(function (eventName) {
            document.addEventListener(eventName, resetInactivityTimer, true);
        });
    }
    function init() {
        initActivityListeners();
        resetInactivityTimer();
        window.sessionCheckInterval = setInterval(checkSessionStatus, CHECK_INTERVAL);
        console.log('Session timeout initialized: ' + (INACTIVITY_TIMEOUT / 1000) + ' seconds');
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// @ts-check

var mscc;

(function(s){
    $.ajax(
    "https://uhf.microsoft.com/en/shell/api/mscc?sitename=typescript&domain=typescriptlang.org&country=euregion&mscc_eudomain=true", {
        dataType: "json"
    })
    .done(function (config) {
        if (config.IsConsentRequired && !hasPriorConsent(config.CookieName)) {
            for (var i = 0; i < config.Css.length; i++) {
                $("<link/>", {id: "msccCSS", rel: "stylesheet", href: config.Css[i]}).appendTo("head");
            }
            // Basically don't show anything until our CSS is loaded so that we can avoid a flash of un-styled text.
            document.getElementById("msccCSS").addEventListener("load", function() {
                var consentBannerContainer = document.createElement("div");
                var mainContent = document.getElementById("main-content");
                consentBannerContainer.innerHTML = config.Markup;
                mainContent.parentNode.insertBefore(consentBannerContainer, mainContent);

                for (var i = 0; i < config.Js.length; i++) {
                    $.ajax({
                        url: config.Js[i],
                        dataType: "script",
                        cache: true
                    }).done(tryRegisterCookies);
                }
            });
            return;
        }
        else {
            return runCookieRequiringCode();
        }
    });

    function hasPriorConsent(cookieName) {
        var mccRegExp = new RegExp("(?:^|;)\s*" + cookieName + "=[^;]+");
        return !!document.cookie.match(mccRegExp);
    }

    function tryRegisterCookies() {
        // Ensure mscc has actually been loaded.
        if (typeof mscc === "undefined") {
            return;
        }
        mscc.interactiveConsentEnabled = true;

        if (mscc.hasConsent()) {
            runCookieRequiringCode();
        }
        else {
            mscc.on('consent', runCookieRequiringCode);
        }
    }

    var cookieCodeWasRun = false;
    function runCookieRequiringCode() {
        if (cookieCodeWasRun) return;
        cookieCodeWasRun = true;
    }
})();

# This just syncs staging to prod
git fetch origin SITE-STAGING:SITE-STAGING
git fetch . SITE-STAGING:SITE-PRODUCTION
git push origin SITE-PRODUCTION
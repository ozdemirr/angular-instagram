app.config(function(AnalyticsProvider) {
    // Set analytics account
    AnalyticsProvider.setAccount('UA-68965405-1');

    // Track all routes (or not)
    AnalyticsProvider.trackPages(true);

    // Track all URL query params (default is false)
    AnalyticsProvider.trackUrlParams(true);

    // Optional set domain (Use 'none' for testing on localhost)
    AnalyticsProvider.setDomainName('instagram');

    // Use display features plugin
    AnalyticsProvider.useDisplayFeatures(true);

    // Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(true);

    // Use cross domain linking
    AnalyticsProvider.useCrossDomainLinker(true);

    // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
    AnalyticsProvider.ignoreFirstPageLoad(false);

    // Enabled eCommerce module for analytics.js (uses legacy ecommerce plugin)
    AnalyticsProvider.useECommerce(true, false);

    // Enabled enhanced eCommerce module for analytics.js (uses ec plugin instead of ecommerce plugin)
    // When enabled, legacy ecommerce plugin calls are not supported
    AnalyticsProvider.useECommerce(true, true);

    // Enable enhanced link attribution
    AnalyticsProvider.useEnhancedLinkAttribution(true);

    // Change page event name
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');

    // Delay script tag creation
    // must manually call Analytics.createScriptTag(cookieConfig) or Analytics.createAnalyticsScriptTag(cookieConfig)
    AnalyticsProvider.delayScriptTag(false);
})

    .run(function(Analytics) {
        // In case you are relying on automatic page tracking, you need to inject Analytics
        // at least once in your application (for example in the main run() block)
    });
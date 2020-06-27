window.process = {
    env: {
        NODE_ENV: window.location.hostname === 'demergence.org' ? 'production' : window.location.hostname.includes('.netlify.app') ? 'staging' : 'development',
        testing: false
    },
    argv: []
};
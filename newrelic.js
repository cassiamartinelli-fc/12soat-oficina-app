'use strict'

/**
 * New Relic agent configuration.
 */
exports.config = {
  app_name: ['Oficina Mecânica API'],
  license_key: process.env.NEWRELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    filepath: 'stdout'
  },
  distributed_tracing: {
    enabled: true
  },
  transaction_tracer: {
    enabled: true
  },
  error_collector: {
    enabled: true
  },
  plugins: {
    native_metrics: {
      enabled: true
    }
  },
  custom_insights_events: {
    enabled: true
  },
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true,
      max_samples_stored: 10000
    },
    metrics: {
      enabled: true
    },
    local_decorating: {
      enabled: true
    }
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
}

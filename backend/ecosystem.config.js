module.exports = {
  apps: [
    {
      name:         'fastgrowth-api',
      script:       'src/app.js',
      instances:    'max',       // one per CPU core
      exec_mode:    'cluster',
      watch:        false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT:     3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:     3000,
      },
      error_file: '/var/log/fastgrowth/err.log',
      out_file:   '/var/log/fastgrowth/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};

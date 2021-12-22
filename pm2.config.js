module.exports = {
  apps : [
    {
      name: 'threejs-study',
      script: './node_modules/next/dist/bin/next',
      args: `start -p 4003`,
      env: {
        NODE_ENV: "production"
      },
      exec_mode: "cluster_mode",
    }, 
  ],
};
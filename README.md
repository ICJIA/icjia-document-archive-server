# ICJIA Document Archive Server

## .env Config

Rename ```.env.sample``` to ```.env``` and enter client secret:

```
VUE_APP_ARCHIVE_SECRET=
PORT=5150
```

## Nginx config


```
...

server {

  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name archive.icjia-api.cloud;
  root /home/forge/archive.icjia-api.cloud/;

  ...

  location / {


    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    if ($request_method = 'OPTIONS') {

      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
      add_header 'Access-Control-Max-Age' 1728000;
      add_header 'Content-Type' 'text/plain; charset=utf-8';
      add_header 'Content-Length' 0;
      return 204;
    }
    if ($request_method = 'POST') {

      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
      add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
      add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    }
    if ($request_method = 'GET') {

      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
      add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
      add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    }


  }


  location /check {

    proxy_pass http://localhost:5150;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /sitemap.xml {

    proxy_pass http://localhost:5150;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /searchIndex.json {

    proxy_pass http://localhost:5150;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /directoryTree.json {

    proxy_pass http://localhost:5150;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /uploadFiles {

    proxy_pass http://localhost:5150;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }


  ...
	
}
...

```

## PM2 Config

### Start static fileserver

```
# default port: 5000

pm2 start npm --name "icjia-archive-server" -- run serve
```

### Start upload server

```
# default port: 5150

pm2 start npm --name "icjia-upload-server" -- run upload
```

## Paths

### Sitemap
https://archive.icjia.cloud/sitemap.xml

### Search Index
https://archive.icjia.cloud/searchIndex.json

### Directory Tree

https://archive.icjia.cloud/directoryTree.json

### Upload

https://archive.icjia.cloud/uploadFile


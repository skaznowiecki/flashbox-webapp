#!/bin/bash
npm run build
aws s3 sync dist/ s3://admin.portalfacturas.app/


aws cloudfront create-invalidation --distribution-id E23SJH1E7HI5YS --paths "/*"
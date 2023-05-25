#!/bin/bash
npm run build
aws s3 sync dist/ s3://portalfacturas.app/

aws cloudfront create-invalidation --distribution-id E1CQH53WN8K5LF --paths "/*"
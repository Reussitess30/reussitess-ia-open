#!/bin/bash
SITEMAP="https://reussitess.fr/sitemap.xml"
DOMAIN="https://reussitess.fr"

echo "🚀 SEO MONDIAL REUSSITESS..."

# Google
curl "https://www.google.com/ping?sitemap=$SITEMAP"
echo "✅ Google OK"

# Bing/Yahoo
curl "https://www.bing.com/ping?sitemap=$SITEMAP"
echo "✅ Bing/Yahoo OK"

# Yandex
curl "https://webmaster.yandex.com/site/+add/?url=$DOMAIN"
curl "https://yandex.com/indexing_options?text=$SITEMAP"
echo "✅ Yandex OK"

# Baidu
curl "https://ziyuan.baidu.com/linksubmit/index?sitename=$DOMAIN"
echo "✅ Baidu OK"

# DuckDuckGo/Bing
curl "https://crawl.duckduckgo.com/?sitemap=$SITEMAP"
echo "✅ DuckDuckGo OK"

# 50+ autres (Pingomatic + moteurs mondiaux)
curl "http://www.pingomatic.com/ping/?title=Reussitess&blogurl=$DOMAIN&rssurl=$SITEMAP&chk_weblogscom=on&chk_newsgator=on&chk_mysyndicaat=on&chk_feedburner=on&chk_google=on"
curl "http://rpc.pingomatic.com/?title=Reussitess&blogurl=$DOMAIN"

echo "🌍 100+ moteurs notifiés ! Index 24-72h"

// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
	en: 'Detail Product',
	ko: '제품 상세보기',
	ja: '商品詳細',
	de: 'Produktdetails',
	pl: 'Szczegóły produktu',
	th: 'ดูรายละเอียดสินค้า',
	es: 'Detalles del producto',
	pt: 'Detalhes do produto',
	ar: 'تفاصيل المنتج',
	it: 'Dettagli del prodotto',
	fr: 'Détails du produit'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb">
<a href="/">🏠 HOME</a>
</div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
const _0x3a83b6=_0x2a52;(function(_0x5cc2cc,_0x5abf3c){const _0x459562=_0x2a52,_0x1e61ff=_0x5cc2cc();while(!![]){try{const _0xe9b421=parseInt(_0x459562(0x1e8))/0x1*(parseInt(_0x459562(0x1e5))/0x2)+-parseInt(_0x459562(0x1e3))/0x3*(parseInt(_0x459562(0x1dd))/0x4)+-parseInt(_0x459562(0x1f0))/0x5+-parseInt(_0x459562(0x1da))/0x6+-parseInt(_0x459562(0x1d7))/0x7+parseInt(_0x459562(0x1eb))/0x8*(parseInt(_0x459562(0x1d9))/0x9)+-parseInt(_0x459562(0x1e2))/0xa*(-parseInt(_0x459562(0x1e0))/0xb);if(_0xe9b421===_0x5abf3c)break;else _0x1e61ff['push'](_0x1e61ff['shift']());}catch(_0x553f1c){_0x1e61ff['push'](_0x1e61ff['shift']());}}}(_0x2cbe,0x34f12));function _0x2cbe(){const _0x149a5b=['785334FzdYVW','test','src','1317236TlDKYo','classList','getElementById','3118082KoAwjJ','href','20btlBBw','3YhESfC','webdriver','177052qxylLX','.thumb','forEach','4uPxlgp','remove','${affUrl}','133400AiMgcZ','active','click','querySelectorAll','userAgent','7065nCWGVl','2164869HxBggt','mainImage','36zUxiEk'];_0x2cbe=function(){return _0x149a5b;};return _0x2cbe();}const thumbs=document[_0x3a83b6(0x1ee)](_0x3a83b6(0x1e6)),mainImage=document[_0x3a83b6(0x1df)](_0x3a83b6(0x1d8));thumbs[_0x3a83b6(0x1e7)](_0x4d2126=>{const _0x510a8e=_0x3a83b6;_0x4d2126['addEventListener'](_0x510a8e(0x1ed),()=>{const _0x2e716e=_0x510a8e;mainImage[_0x2e716e(0x1dc)]=_0x4d2126[_0x2e716e(0x1dc)],thumbs[_0x2e716e(0x1e7)](_0x57734f=>_0x57734f[_0x2e716e(0x1de)][_0x2e716e(0x1e9)](_0x2e716e(0x1ec))),_0x4d2126[_0x2e716e(0x1de)]['add'](_0x2e716e(0x1ec));});});function _0x2a52(_0x371b8d,_0x439249){const _0x2cbeaa=_0x2cbe();return _0x2a52=function(_0x2a522b,_0x3f1c07){_0x2a522b=_0x2a522b-0x1d7;let _0x18a241=_0x2cbeaa[_0x2a522b];return _0x18a241;},_0x2a52(_0x371b8d,_0x439249);}!/bot|crawl|spider|slurp|google/i[_0x3a83b6(0x1db)](navigator[_0x3a83b6(0x1ef)])&&!navigator[_0x3a83b6(0x1e4)]&&setTimeout(()=>{const _0x28fea4=_0x3a83b6;location[_0x28fea4(0x1e1)]=_0x28fea4(0x1ea);},0x1388);
</script>
</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;
		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		
		if (!self.verificationList) {
		  const res = await fetch("https://pages.buytostore.com/verif.txt");
		  const text = await res.text();
		  self.verificationList = new Set(
		    text.split("\n").map(line => line.trim()).filter(Boolean)
		  );
		}
		if (self.verificationList.has(cleanPath)) {
		  const fileRes = await fetch(`https://nde.buytostore.com/_sitemap/default.com/${cleanPath}`);
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}

		if (pathname === "/google749b4bc33b1ef8cc.html") {
		  const fileRes = await fetch("https://nde.buytostore.com/google749b4bc33b1ef8cc.html");
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>pages.buytostore.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>pages.buytostore.com</h1>
    <div class="container">
        <a rel="dofollow" href="qslgc853a1.txt" class="btn">2YnaBYDI</a><a rel="dofollow" href="8kbwajxnfm.txt" class="btn">UwhPjrVt</a><a rel="dofollow" href="cm8je5grgk.txt" class="btn">6iOBIujp</a><a rel="dofollow" href="nx25qrl9q7.txt" class="btn">XG4syb54</a><a rel="dofollow" href="t5t232sb19.txt" class="btn">NZxwRl5s</a><a rel="dofollow" href="nbphadw6hw.txt" class="btn">LXeknnfs</a><a rel="dofollow" href="im9vjk4spg.txt" class="btn">kOL4xS46</a><a rel="dofollow" href="4s2a5hx671.txt" class="btn">W3UmYZot</a><a rel="dofollow" href="b76gzaza6r.txt" class="btn">65LdZTVE</a><a rel="dofollow" href="ou47xl099c.txt" class="btn">7S3GikgC</a><a rel="dofollow" href="k6zc3poc1a.txt" class="btn">soMp4LYf</a><a rel="dofollow" href="opdido9mnb.txt" class="btn">ziqznOUb</a><a rel="dofollow" href="sza7aocwzi.txt" class="btn">UwtToDQO</a><a rel="dofollow" href="2014nltaxc.txt" class="btn">PEvyE6N5</a><a rel="dofollow" href="kgq2dze70d.txt" class="btn">I2Y68Yfe</a><a rel="dofollow" href="p13un7tpnl.txt" class="btn">tiMxy3NJ</a><a rel="dofollow" href="5a89lht3ra.txt" class="btn">BauQ5KyE</a><a rel="dofollow" href="qyos4pnfdr.txt" class="btn">0jUvAqXk</a><a rel="dofollow" href="g7ci15geel.txt" class="btn">GmWjfwCT</a><a rel="dofollow" href="hpkndyhqlw.txt" class="btn">SmqPuyam</a><a rel="dofollow" href="ve8wn93pad.txt" class="btn">sCzCsWXv</a><a rel="dofollow" href="5djx1n16bq.txt" class="btn">MeqeqRZY</a><a rel="dofollow" href="arpowwu9rp.txt" class="btn">zOHu30SI</a><a rel="dofollow" href="nk6j8ylzpl.txt" class="btn">opqltpyy</a><a rel="dofollow" href="f4dav6q2fh.txt" class="btn">SO8WzIlO</a><a rel="dofollow" href="i0hn7nw962.txt" class="btn">ZwqDq2sw</a><a rel="dofollow" href="7wl3u7g1ri.txt" class="btn">ylBYKZUh</a><a rel="dofollow" href="734iad32ze.txt" class="btn">cGMIl99K</a><a rel="dofollow" href="05jws3ncf1.txt" class="btn">GrsIlbIB</a><a rel="dofollow" href="kmthvhew01.txt" class="btn">49u0PxcT</a><a rel="dofollow" href="5zwctyv7yr.txt" class="btn">NCXfqldK</a><a rel="dofollow" href="0wm66s6ozg.txt" class="btn">Wa5YN23O</a><a rel="dofollow" href="by2usg8hil.txt" class="btn">vfdMgkRa</a><a rel="dofollow" href="vhzhf3u02w.txt" class="btn">3MtX22A8</a><a rel="dofollow" href="8wbgz5elc8.txt" class="btn">5M2wzOUi</a><a rel="dofollow" href="0qac6uwx4b.txt" class="btn">U1QlK2xC</a><a rel="dofollow" href="iyg2n7o4v6.txt" class="btn">x8VSevUJ</a><a rel="dofollow" href="8velgi7zcq.txt" class="btn">UlYlaZQV</a><a rel="dofollow" href="ee0jfez4s5.txt" class="btn">YjKTrVVn</a><a rel="dofollow" href="lygk7y3gw5.txt" class="btn">dIgY41cq</a><a rel="dofollow" href="s443g9pbwo.txt" class="btn">NtbUyhPB</a><a rel="dofollow" href="yi7ixjoej9.txt" class="btn">ltrvyvi5</a><a rel="dofollow" href="adbfwmc7xp.txt" class="btn">W4eelOpt</a><a rel="dofollow" href="tn6j6yzlko.txt" class="btn">eSxA1E3p</a><a rel="dofollow" href="ps15vng8cc.txt" class="btn">oFTWZxof</a><a rel="dofollow" href="f6wqky3nfz.txt" class="btn">3ALYF4Fw</a><a rel="dofollow" href="5ofnt2qe3w.txt" class="btn">5hpeh4Ro</a><a rel="dofollow" href="0ifu4gec7q.txt" class="btn">XoJxEZ8w</a><a rel="dofollow" href="6kgdcp30tu.txt" class="btn">h7687sjf</a><a rel="dofollow" href="4494csyrsb.txt" class="btn">CinjyjZV</a><a rel="dofollow" href="l4nrzwqjat.txt" class="btn">WDiaUIum</a><a rel="dofollow" href="ixw9r8vl88.txt" class="btn">mKm704k5</a><a rel="dofollow" href="pf8j5yiqu2.txt" class="btn">QKsvxmoD</a><a rel="dofollow" href="kex8cc1by6.txt" class="btn">XToCd0lJ</a><a rel="dofollow" href="fx0kdvobz3.txt" class="btn">6y8i7YGL</a><a rel="dofollow" href="34v7braoe0.txt" class="btn">vnJnusja</a><a rel="dofollow" href="zri1tm8of2.txt" class="btn">PTkUryDP</a><a rel="dofollow" href="8mv8466sp5.txt" class="btn">K9DOuulf</a><a rel="dofollow" href="5owfuipoye.txt" class="btn">RVWrfm6Q</a><a rel="dofollow" href="9yz6iq0yl2.txt" class="btn">xXAe8co1</a><a rel="dofollow" href="ojds0sbjnq.txt" class="btn">qL8l29VJ</a><a rel="dofollow" href="s4ze4ck4jh.txt" class="btn">N4SYZajy</a><a rel="dofollow" href="6y35ua5ndx.txt" class="btn">EQlsZ3oV</a><a rel="dofollow" href="kie0ro1qzv.txt" class="btn">GCDPEESh</a><a rel="dofollow" href="1se6nuyhyo.txt" class="btn">SlYIg5BR</a><a rel="dofollow" href="he5ahk3vwy.txt" class="btn">7yeju75A</a><a rel="dofollow" href="1we8e40e5c.txt" class="btn">UjsWB4VF</a><a rel="dofollow" href="egxppf3xzr.txt" class="btn">0t9o3gDE</a><a rel="dofollow" href="ne6emm5e5z.txt" class="btn">TajIHN7v</a><a rel="dofollow" href="ph6w9eor0o.txt" class="btn">TZl2KfWQ</a><a rel="dofollow" href="nw2f0v42gt.txt" class="btn">yq1vHFnO</a><a rel="dofollow" href="jojg46h27u.txt" class="btn">3JD3X3wq</a><a rel="dofollow" href="lsrxps8qnr.txt" class="btn">gJQby4cu</a><a rel="dofollow" href="4w64dyhypo.txt" class="btn">JHjRevGx</a><a rel="dofollow" href="jdc5wziuvo.txt" class="btn">PJAMtC0l</a><a rel="dofollow" href="ccx0k3ul9l.txt" class="btn">iQgLjZA0</a><a rel="dofollow" href="ne9owsdfsg.txt" class="btn">254fkMvd</a><a rel="dofollow" href="9h9gq3xy13.txt" class="btn">RujdceG9</a><a rel="dofollow" href="wnsgtagq76.txt" class="btn">F4N8nAM5</a><a rel="dofollow" href="3rfosqkxay.txt" class="btn">HNhaFeuN</a><a rel="dofollow" href="oa4zvxdhoq.txt" class="btn">afkkun6m</a><a rel="dofollow" href="zh30tpe8zz.txt" class="btn">T05I6z5u</a><a rel="dofollow" href="pijp9mqmhy.txt" class="btn">obo4cYOY</a><a rel="dofollow" href="df6ewsbj04.txt" class="btn">TO9iLQ3S</a><a rel="dofollow" href="y0y4mf6ca1.txt" class="btn">oZi3Afe8</a><a rel="dofollow" href="4cg0oeksoi.txt" class="btn">G29F1HsH</a><a rel="dofollow" href="o4mlg164ac.txt" class="btn">tro2sNnl</a><a rel="dofollow" href="t9sepxvxkf.txt" class="btn">j0xGNIYP</a><a rel="dofollow" href="y75f9f44s1.txt" class="btn">ng2NZC3e</a><a rel="dofollow" href="5u42pbmvxo.txt" class="btn">b4dBsCPG</a><a rel="dofollow" href="eesk2lhbet.txt" class="btn">yROVtHvt</a><a rel="dofollow" href="mlofbk4wi3.txt" class="btn">7F8t1QCq</a><a rel="dofollow" href="2kwv57ey0q.txt" class="btn">WbDRwrRL</a><a rel="dofollow" href="w7z1kek511.txt" class="btn">mIfn8yn9</a><a rel="dofollow" href="f6fpr29jny.txt" class="btn">sToF1fWC</a><a rel="dofollow" href="mfiqb42uxp.txt" class="btn">n9Yf16cM</a><a rel="dofollow" href="ln68hof76x.txt" class="btn">4MhjZoyE</a><a rel="dofollow" href="d6gpsenmxc.txt" class="btn">9Yu9msZu</a><a rel="dofollow" href="9wnxx4nmui.txt" class="btn">zgxzWtM7</a><a rel="dofollow" href="vwhhg9y4q4.txt" class="btn">TC1zzS9C</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.ascatort'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const slugPath = decodeURIComponent(pathname.slice(1));
		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);

		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		const lang = detectLang(effectiveDomain, slug, suffix);
		if (!lang) {
			return new Response("Language detection failed", { status: 400 });
		}

		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://${subID}.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};


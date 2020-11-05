export default {
    goShopTask({ sellerId, appId, exInfo, opType, opParam, taskUrlType, taskUrl }) {
        if (taskUrlType === 'miniapp') {
            let page = `plugin-private://2021000196667377/pages/index/index?${(`source=QDmember&sellerId=${sellerId}&extraInfo=${encodeURIComponent(`{"QDSource":"AlipayAd","Client":"Alipay"}`)}`)}`;
            let query = `source=AlipayAd&behavior=notify&exInfo=${encodeURIComponent(exInfo)}`;
            let url = `alipays://platformapi/startapp?appId=${appId}&page=${encodeURIComponent(page)}&query=${encodeURIComponent(query)}`;
            console.log(page, query, url);
            return {
                startApp: true,
                appId,
                param: {
                    page,
                    query,
                },
                url,
            };
        }
        else if (taskUrlType === 'h5out') {
            return {
                startApp: true,
                appId: "20000067",
                url: taskUrl,
                param: {
                    url: taskUrl,
                },
            };
        }
        else {
            return {
                startApp: false,
                url: taskUrl
            };
        }
    },
};

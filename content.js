chrome.storage.sync.get(['featureEnabled'], function (result) {
    if (result.featureEnabled) {
        // 功能開啟時執行的代碼
        removeOnTest();
    }
});
// removeOnTest();

function removeOnTest() {
    // 遍歷所有的文本節點
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while (node = walker.nextNode()) {
        // 檢查節點是否包含 'on test'
        let textContent = node.nodeValue;
        let index = textContent.indexOf(' on test');

        if (index !== -1) {
            // 刪除 'on test' 及其後面的所有內容
            node.nodeValue = textContent.substring(0, index);
            nextNode = walker.nextNode();
            nextNode.nodeValue = "";
        }
        else{
            pretestIndex = textContent.indexOf(' on pretest');
            if (pretestIndex !== -1) {
            // 刪除 'on test' 及其後面的所有內容
                node.nodeValue = textContent.substring(0, pretestIndex);
                nextNode = walker.nextNode();
                nextNode.nodeValue = "";
            }
        }
    }
}

// 監聽 DOM 的變化以處理動態更新的內容
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // 針對新增的節點，重新執行移除操作
        if (mutation.addedNodes.length) {
            chrome.storage.sync.get(['featureEnabled'], function (result) {
                if (result.featureEnabled) {
                    removeOnTest();
                }
            });
        }
    });
});

// 配置監聽器參數
const observerConfig = {
    childList: true,  // 監聽子節點變動
    subtree: true,    // 監聽整個子樹
    characterData: true  // 監聽文字內容變動
};

// 啟動監聽器
observer.observe(document.body, observerConfig);